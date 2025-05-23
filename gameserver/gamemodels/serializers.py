# gamemodels_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User # Needed if User fields are directly manipulated or read
from .models import (
    PlayerProfile, Wand, PlayerQuestProgress, Quest, HOUSE_CHOICES,
    WAND_CORE_CHOICES, WOOD_TYPE_CHOICES, QUEST_STATUS_CHOICES
)

class WandSerializer(serializers.ModelSerializer):
    core_display = serializers.CharField(source='get_core_display', read_only=True)
    wood_type_display = serializers.CharField(source='get_wood_type_display', read_only=True)

    class Meta:
        model = Wand
        fields = ['id', 'core', 'wood_type', 'length_inches', 'flexibility',
                  'core_display', 'wood_type_display']


class PlayerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    # If you added display_name to PlayerProfile model, include it here:
    # display_name = serializers.CharField(required=False, allow_blank=True) # Make it updatable
    house_display = serializers.CharField(source='get_house_display', read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            'id', 'user', 'username', 'email', # Add display_name if it exists on model
            'house', 'house_display', 'level', 'xp', 'avatar_url',
            'current_latitude', 'current_longitude', 'last_seen',
        ]
        # 'user' FK should be read-only after creation via signal.
        # 'username' and 'email' are read from the related User model.
        read_only_fields = ['user', 'username', 'email', 'level', 'xp', 'last_seen']
        # Allow 'display_name', 'house', 'avatar_url', 'current_latitude', 'current_longitude' to be updated.

    def update(self, instance, validated_data):
        # User's username/email are not typically updated via profile endpoint.
        # Password changes should go through a dedicated password change endpoint.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class QuestTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = ['id', 'title', 'description', 'xp_reward']


class PlayerQuestProgressSerializer(serializers.ModelSerializer):
    quest = QuestTitleSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = PlayerQuestProgress
        fields = ['id', 'quest', 'status', 'status_display', 'started_at', 'completed_at']


class DashboardSerializer(serializers.Serializer):
    profile = PlayerProfileSerializer(read_only=True)
    wand = WandSerializer(read_only=True, allow_null=True)
    completed_quests_count = serializers.IntegerField(read_only=True)
    pending_quests_count = serializers.IntegerField(read_only=True)
    in_progress_quests_count = serializers.IntegerField(read_only=True)

    def to_representation(self, instance_profile): # instance is PlayerProfile
        user_wand = Wand.objects.filter(assigned_to=instance_profile).first()

        completed_quests_count = PlayerQuestProgress.objects.filter(
            player=instance_profile, status='COMPLETED'
        ).count()
        pending_quests_count = PlayerQuestProgress.objects.filter(
            player=instance_profile, status='PENDING'
        ).count()
        in_progress_quests_count = PlayerQuestProgress.objects.filter(
            player=instance_profile, status__in=['IN_PROGRESS', 'ACCEPTED']
        ).count()

        profile_data = PlayerProfileSerializer(instance_profile, context=self.context).data
        wand_data = WandSerializer(user_wand, context=self.context).data if user_wand else None

        return {
            'profile': profile_data,
            'wand': wand_data,
            'completed_quests_count': completed_quests_count,
            'pending_quests_count': pending_quests_count,
            'in_progress_quests_count': in_progress_quests_count,
        }