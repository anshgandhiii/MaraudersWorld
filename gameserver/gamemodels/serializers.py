from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    PlayerProfile, Wand, PlayerQuestProgress, Quest, GameItem, PlayerInventory,
    MagicalLocation, MapReport, PlayerGPSTrace,
    HOUSE_CHOICES, WAND_CORE_CHOICES, WOOD_TYPE_CHOICES, QUEST_STATUS_CHOICES,
    POI_TYPE_CHOICES, ITEM_TYPE_CHOICES, MAP_REPORT_TYPE_CHOICES, MAP_REPORT_STATUS_CHOICES
)
from django.utils import timezone

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
    house_display = serializers.CharField(source='get_house_display', read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            'id', 'user', 'username', 'email', 'house', 'house_display', 'level', 'xp',
            'avatar_url', 'current_latitude', 'current_longitude', 'last_seen'
        ]
        read_only_fields = ['user', 'username', 'email', 'level', 'xp', 'last_seen']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class GameItemSerializer(serializers.ModelSerializer):
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)

    class Meta:
        model = GameItem
        fields = ['id', 'name', 'description', 'item_type', 'item_type_display', 'image_url', 'rarity']

class PlayerInventorySerializer(serializers.ModelSerializer):
    item = GameItemSerializer(read_only=True)

    class Meta:
        model = PlayerInventory
        fields = ['id', 'item', 'quantity']

class MagicalLocationSerializer(serializers.ModelSerializer):
    poi_type_display = serializers.CharField(source='get_poi_type_display', read_only=True)
    discovered_by_username = serializers.CharField(source='discovered_by.username', read_only=True, allow_null=True)

    class Meta:
        model = MagicalLocation
        fields = [
            'id', 'name', 'description', 'latitude', 'longitude', 'poi_type',
            'poi_type_display', 'real_world_identifier', 'discovered_by',
            'discovered_by_username', 'is_active', 'verification_score',
            'created_at', 'updated_at'
        ]

class QuestSerializer(serializers.ModelSerializer):
    item_reward = GameItemSerializer(read_only=True)
    target_location = MagicalLocationSerializer(read_only=True)

    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'description', 'xp_reward', 'item_reward',
            'min_player_level', 'target_location', 'is_repeatable', 'is_active',
            'created_at'
        ]

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

class MapReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)
    related_poi = MagicalLocationSerializer(read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MapReport
        fields = [
            'id', 'reporter', 'reporter_username', 'latitude', 'longitude',
            'report_type', 'report_type_display', 'description_text', 'photo',
            'related_poi', 'timestamp', 'status', 'status_display',
            'ai_confidence_score', 'admin_notes', 'resolved_at', 'resolver'
        ]
        read_only_fields = ['reporter', 'timestamp', 'status', 'ai_confidence_score', 'admin_notes', 'resolved_at', 'resolver']

class PlayerGPSTraceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerGPSTrace
        fields = ['id', 'player', 'timestamp', 'latitude', 'longitude']
        read_only_fields = ['player', 'timestamp']

class DashboardSerializer(serializers.Serializer):
    profile = PlayerProfileSerializer(read_only=True)
    wand = WandSerializer(read_only=True, allow_null=True)
    completed_quests_count = serializers.IntegerField(read_only=True)
    pending_quests_count = serializers.IntegerField(read_only=True)
    in_progress_quests_count = serializers.IntegerField(read_only=True)

    def to_representation(self, instance_profile):
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