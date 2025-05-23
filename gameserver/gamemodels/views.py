# gamemodels_app/views.py
from rest_framework import generics, status, views as drf_views # Renamed to avoid clash if using django.views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User # If needed for direct queries, though usually through profile

from .models import PlayerProfile, Wand, PlayerQuestProgress, Quest # Assuming models are in current app
from .serializers import (
    PlayerProfileSerializer,
    DashboardSerializer,
    PlayerQuestProgressSerializer
)

class UserDashboardView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.profile # Access through the related_name 'profile'
        except PlayerProfile.DoesNotExist:
            # This should be rare if the signal works.
            # Could create profile here or return 404.
            # For robustness, let's try to create it if missing for an authenticated user.
            profile, created = PlayerProfile.objects.get_or_create(user=request.user)
            if created:
                print(f"Profile created on-the-fly for user {request.user.username} in DashboardView")

        serializer = DashboardSerializer(profile, context={'request': request})
        return Response(serializer.data)


class PlayerProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            # Users can only access/update their own profile.
            return self.request.user.profile
        except PlayerProfile.DoesNotExist:
            # If profile does not exist, create it. This ensures endpoint is robust.
            profile, created = PlayerProfile.objects.get_or_create(user=self.request.user)
            if created:
                 print(f"Profile created on-the-fly for user {self.request.user.username} in PlayerProfileDetailView")
            return profile

    # perform_update is handled by default by RetrieveUpdateAPIView correctly with serializer.save()

class UserCompletedQuestsView(generics.ListAPIView):
    serializer_class = PlayerQuestProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure profile exists, similar to above views
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerQuestProgress.objects.filter(
            player=user_profile,
            status='COMPLETED' # Direct string comparison
        ).select_related('quest').order_by('-completed_at')


class UserActiveQuestsView(generics.ListAPIView):
    serializer_class = PlayerQuestProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerQuestProgress.objects.filter(
            player=user_profile
        ).exclude(
            status='COMPLETED'
        ).exclude(
            status='FAILED' # Optionally exclude failed
        ).select_related('quest').order_by('quest__title')