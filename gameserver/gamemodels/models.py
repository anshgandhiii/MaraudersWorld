from django.contrib.auth.models import User
from django.db import models

# Choices for ENUM-like fields
HOUSE_CHOICES = [
    ('GRYFFINDOR', 'Gryffindor'),
    ('HUFFLEPUFF', 'Hufflepuff'),
    ('RAVENCLAW', 'Ravenclaw'),
    ('SLYTHERIN', 'Slytherin'),
]

QUEST_STATUS_CHOICES = [
    ('PENDING', 'Pending'),
    ('ACCEPTED', 'Accepted'),
    ('IN_PROGRESS', 'In Progress'),
    ('COMPLETED', 'Completed'),
    ('FAILED', 'Failed'),
]

POI_TYPE_CHOICES = [
    ('MAGICAL_LANDMARK', 'Magical Landmark'),
    ('POTION_INGREDIENT_SPOT', 'Potion Ingredient Spot'),
    ('CREATURE_HABITAT', 'Creature Habitat'),
    ('HISTORICAL_SITE', 'Historical Magical Site'),
    ('PLAYER_SUGGESTED', 'Player Suggested'),
    ('PORTKEY_LOCATION', 'Portkey Location'),
]

ITEM_TYPE_CHOICES = [
    ('INGREDIENT', 'Ingredient'),
    ('POTION', 'Potion'),
    ('ARTIFACT', 'Artifact'),
    ('SPELL_SCROLL', 'Spell Scroll'),
    ('COLLECTIBLE', 'Collectible'),
]

MAP_REPORT_TYPE_CHOICES = [
    ('OBSTRUCTION', 'Muggle Obstruction'),
    ('NEW_PATH', 'New Magical Passage'),
    ('POI_INACCURACY', 'Faded Magic (POI Error)'),
    ('NEW_POI_SUGGESTION', 'New Magical Sighting'),
    ('PHOTO_EVIDENCE', 'Photo Evidence'),
    ('ACCESS_ISSUE', 'Accessibility Issue'),
]

MAP_REPORT_STATUS_CHOICES = [
    ('SUBMITTED', 'Submitted'),
    ('REVIEWING', 'Under Review'),
    ('VERIFIED', 'Verified & Integrated'),
    ('REJECTED', 'Rejected'),
    ('NEEDS_MORE_INFO', 'Needs More Information'),
]

WAND_CORE_CHOICES = [
    ('PHOENIX_FEATHER', 'Phoenix Feather'),
    ('DRAGON_HEARTSTRING', 'Dragon Heartstring'),
    ('UNICORN_HAIR', 'Unicorn Hair'),
    ('VEELA_HAIR', 'Veela Hair'),
    ('THUNDERBIRD_TAIL', 'Thunderbird Tail Feather'),
]

WOOD_TYPE_CHOICES = [
    ('HOLLY', 'Holly'),
    ('OAK', 'Oak'),
    ('YEW', 'Yew'),
    ('ELDER', 'Elder'),
    ('HAWTHORN', 'Hawthorn'),
]

class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    house = models.CharField(max_length=20, choices=HOUSE_CHOICES, null=True, blank=True)
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)
    avatar_url = models.URLField(max_length=255, null=True, blank=True)
    current_latitude = models.FloatField(null=True, blank=True)
    current_longitude = models.FloatField(null=True, blank=True)
    last_seen = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile ({self.house})"

class Wand(models.Model):
    core = models.CharField(max_length=30, choices=WAND_CORE_CHOICES)
    wood_type = models.CharField(max_length=30, choices=WOOD_TYPE_CHOICES)
    length_inches = models.DecimalField(max_digits=4, decimal_places=1, help_text="Wand length in inches")
    flexibility = models.CharField(max_length=50, help_text="e.g., 'Supple', 'Rigid', 'Bendy'")
    assigned_to = models.ManyToManyField(PlayerProfile, related_name="wand", blank=True)

    def __str__(self):
        return f"{self.wood_type} wand with {self.core} ({self.length_inches}\" - {self.flexibility})"

class MagicalLocation(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    poi_type = models.CharField(max_length=50, choices=POI_TYPE_CHOICES)
    real_world_identifier = models.CharField(max_length=100, blank=True, null=True, help_text="HERE API ID or similar")
    discovered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="discovered_locations")
    is_active = models.BooleanField(default=True)
    verification_score = models.IntegerField(default=0, help_text="Score based on player verifications")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.poi_type})"

class GameItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    item_type = models.CharField(max_length=30, choices=ITEM_TYPE_CHOICES)
    image_url = models.URLField(max_length=255, null=True, blank=True)
    rarity = models.PositiveSmallIntegerField(default=1, help_text="1=common, 5=legendary")

    def __str__(self):
        return f"{self.name} ({self.item_type})"

class PlayerInventory(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name="inventory_items")
    item = models.ForeignKey(GameItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('player', 'item')

    def __str__(self):
        return f"{self.player.user.username} has {self.quantity} of {self.item.name}"

class Quest(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    xp_reward = models.PositiveIntegerField(default=10)
    item_reward = models.ForeignKey(GameItem, on_delete=models.SET_NULL, null=True, blank=True, related_name="reward_for_quests")
    min_player_level = models.PositiveIntegerField(default=1)
    target_location = models.ForeignKey(MagicalLocation, on_delete=models.SET_NULL, null=True, blank=True, related_name="quests_at_location")
    is_repeatable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class PlayerQuestProgress(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name="quest_progress")
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name="player_attempts")
    status = models.CharField(max_length=20, choices=QUEST_STATUS_CHOICES, default='PENDING')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('player', 'quest')

    def __str__(self):
        return f"{self.player.user.username} - {self.quest.title} ({self.status})"

class MapReport(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="map_reports")
    latitude = models.FloatField()
    longitude = models.FloatField()
    report_type = models.CharField(max_length=30, choices=MAP_REPORT_TYPE_CHOICES)
    description_text = models.TextField(blank=True, help_text="Player's description of the issue/finding")
    photo = models.ImageField(upload_to='map_reports/%Y/%m/%d/', null=True, blank=True)
    related_poi = models.ForeignKey(MagicalLocation, on_delete=models.SET_NULL, null=True, blank=True, related_name="reports")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=MAP_REPORT_STATUS_CHOICES, default='SUBMITTED')
    ai_confidence_score = models.FloatField(null=True, blank=True, help_text="Confidence from AI analysis")
    admin_notes = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="resolved_reports")

    def __str__(self):
        return f"Report by {self.reporter.username} at ({self.latitude}, {self.longitude}) - {self.get_report_type_display()}"

class ReportVerification(models.Model):
    map_report = models.ForeignKey(MapReport, on_delete=models.CASCADE, related_name="verifications")
    verifier = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_verifications")
    agrees_with_report = models.BooleanField()
    comment = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('map_report', 'verifier')

    def __str__(self):
        return f"{self.verifier.username} {'agrees' if self.agrees_with_report else 'disagrees'} with report {self.map_report_id}"

class PlayerGPSTrace(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name="gps_traces")
    timestamp = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        ordering = ['player', 'timestamp']

    def __str__(self):
        return f"GPS Trace for {self.player.user.username} at {self.timestamp}"