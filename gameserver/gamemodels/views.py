from rest_framework import generics, status, views as drf_views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q
from .models import (
    PlayerProfile, Wand, PlayerQuestProgress, Quest, GameItem, PlayerInventory,
    MagicalLocation, MapReport, PlayerGPSTrace, PlayerWand
)
from .serializers import (
    PlayerProfileSerializer, DashboardSerializer, PlayerQuestProgressSerializer,
    GameItemSerializer, PlayerInventorySerializer, MagicalLocationSerializer,
    QuestSerializer, MapReportSerializer, PlayerGPSTraceSerializer, PlayerWandSerializer
)


class PlayerWandListCreateView(generics.ListCreateAPIView):
    serializer_class = PlayerWandSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        player_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerWand.objects.filter(player=player_profile).select_related('wand')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        player_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        context['player'] = player_profile
        return context

    def perform_create(self, serializer):
        player_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        serializer.save(player=player_profile)

class PlayerWandDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PlayerWandSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        player_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerWand.objects.filter(player=player_profile)

class UserDashboardView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
        except PlayerProfile.DoesNotExist:
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
            return self.request.user.profile
        except PlayerProfile.DoesNotExist:
            profile, created = PlayerProfile.objects.get_or_create(user=self.request.user)
            if created:
                print(f"Profile created on-the-fly for user {request.user.username} in PlayerProfileDetailView")
            return profile

class UserCompletedQuestsView(generics.ListAPIView):
    serializer_class = PlayerQuestProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerQuestProgress.objects.filter(
            player=user_profile, status='COMPLETED'
        ).select_related('quest').order_by('-completed_at')

class UserActiveQuestsView(generics.ListAPIView):
    serializer_class = PlayerQuestProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerQuestProgress.objects.filter(
            player=user_profile
        ).exclude(status='COMPLETED').exclude(status='FAILED').select_related('quest').order_by('quest__title')

class GameItemListView(generics.ListAPIView):
    serializer_class = GameItemSerializer
    permission_classes = [IsAuthenticated]
    queryset = GameItem.objects.all()

class PlayerInventoryListView(generics.ListAPIView):
    serializer_class = PlayerInventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerInventory.objects.filter(player=user_profile).select_related('item')

class PlayerInventoryAddView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity', 1)
        
        if not item_id:
            return Response({'error': 'item_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = GameItem.objects.get(id=item_id)
        except GameItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        inventory_item, created = PlayerInventory.objects.get_or_create(
            player=user_profile, item=item, defaults={'quantity': quantity}
        )
        if not created:
            inventory_item.quantity += int(quantity)
            inventory_item.save()
        
        serializer = PlayerInventorySerializer(inventory_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class MagicalLocationListView(generics.ListAPIView):
    serializer_class = MagicalLocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MagicalLocation.objects.filter(is_active=True)
        min_lat = self.request.query_params.get('min_lat')
        max_lat = self.request.query_params.get('max_lat')
        min_lon = self.request.query_params.get('min_lon')
        max_lon = self.request.query_params.get('max_lon')
        
        if all([min_lat, max_lat, min_lon, max_lon]):
            try:
                min_lat, max_lat = float(min_lat), float(max_lat)
                min_lon, max_lon = float(min_lon), float(max_lon)
                queryset = queryset.filter(
                    latitude__range=(min_lat, max_lat),
                    longitude__range=(min_lon, max_lon)
                )
            except ValueError:
                pass
        return queryset

class MagicalLocationDetailView(generics.RetrieveAPIView):
    serializer_class = MagicalLocationSerializer
    permission_classes = [IsAuthenticated]
    queryset = MagicalLocation.objects.filter(is_active=True)

class MagicalLocationSuggestView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['reporter'] = request.user.id
        data['report_type'] = 'NEW_POI_SUGGESTION'
        serializer = MapReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestAvailableListView(generics.ListAPIView):
    serializer_class = QuestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        completed_quests = PlayerQuestProgress.objects.filter(
            player=user_profile, status='COMPLETED'
        ).values_list('quest__id', flat=True)
        queryset = Quest.objects.filter(
            is_active=True,
            min_player_level__lte=user_profile.level
        ).exclude(id__in=completed_quests)
        user_lat = user_profile.current_latitude
        user_lon = user_profile.current_longitude
        if user_lat and user_lon:
            min_lat = user_lat - 0.1
            max_lat = user_lat + 0.1
            min_lon = user_lon - 0.1
            max_lon = user_lon + 0.1
            queryset = queryset.filter(
                Q(target_location__isnull=True) |
                Q(target_location__latitude__range=(min_lat, max_lat),
                  target_location__longitude__range=(min_lon, max_lon))
            )
        return queryset

class QuestDetailView(generics.RetrieveAPIView):
    serializer_class = QuestSerializer
    permission_classes = [IsAuthenticated]
    queryset = Quest.objects.filter(is_active=True)

class PlayerQuestListView(generics.ListAPIView):
    serializer_class = PlayerQuestProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerQuestProgress.objects.filter(player=user_profile).select_related('quest')

class QuestAcceptView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quest_id, *args, **kwargs):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        try:
            quest = Quest.objects.get(id=quest_id, is_active=True)
        except Quest.DoesNotExist:
            return Response({'error': 'Quest not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if quest.min_player_level > user_profile.level:
            return Response({'error': 'Player level too low'}, status=status.HTTP_400_BAD_REQUEST)
        
        progress, created = PlayerQuestProgress.objects.get_or_create(
            player=user_profile, quest=quest, defaults={'status': 'ACCEPTED', 'started_at': timezone.now()}
        )
        if not created and progress.status != 'PENDING':
            return Response({'error': 'Quest already in progress or completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        progress.status = 'ACCEPTED'
        progress.started_at = timezone.now()
        progress.save()
        return Response(PlayerQuestProgressSerializer(progress).data, status=status.HTTP_200_OK)

class QuestProgressUpdateView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, progress_id, *args, **kwargs):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        try:
            progress = PlayerQuestProgress.objects.get(id=progress_id, player=user_profile)
        except PlayerQuestProgress.DoesNotExist:
            return Response({'error': 'Quest progress not found'}, status=status.HTTP_404_NOT_FOUND)
        
        status = request.data.get('status')
        if status not in ['IN_PROGRESS', 'FAILED']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        if status == 'IN_PROGRESS' and progress.status == 'PENDING':
            progress.status = 'ACCEPTED'
            progress.started_at = timezone.now()
        elif status == 'IN_PROGRESS':
            progress.status = status
        elif status == 'FAILED':
            progress.status = status
            progress.completed_at = timezone.now()
        
        progress.save()
        return Response(PlayerQuestProgressSerializer(progress).data, status=status.HTTP_200_OK)

class QuestCompleteView(drf_views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, progress_id, *args, **kwargs):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        try:
            progress = PlayerQuestProgress.objects.get(id=progress_id, player=user_profile)
        except PlayerQuestProgress.DoesNotExist:
            return Response({'error': 'Quest progress not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if progress.status == 'COMPLETED':
            return Response({'error': 'Quest already completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_profile.xp += progress.quest.xp_reward
        user_profile.level = user_profile.xp // 1000 + 1
        user_profile.save()
        
        if progress.quest.item_reward:
            inventory_item, created = PlayerInventory.objects.get_or_create(
                player=user_profile, item=progress.quest.item_reward, defaults={'quantity': 1}
            )
            if not created:
                inventory_item.quantity += 1
                inventory_item.save()
        
        progress.status = 'COMPLETED'
        progress.completed_at = timezone.now()
        progress.save()
        return Response(PlayerQuestProgressSerializer(progress).data, status=status.HTTP_200_OK)

class MapReportCreateView(generics.CreateAPIView):
    serializer_class = MapReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class PlayerGPSTraceCreateView(generics.ListCreateAPIView):
    serializer_class = PlayerGPSTraceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerGPSTrace.objects.filter(player=user_profile).order_by('timestamp')

    def perform_create(self, serializer):
        user_profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        serializer.save(player=user_profile, timestamp=timezone.now())