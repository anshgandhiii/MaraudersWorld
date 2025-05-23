# gamemodels_app/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User # User model is from django.contrib.auth
from .models import PlayerProfile

@receiver(post_save, sender=User)
def create_player_profile_on_user_creation(sender, instance, created, **kwargs):
    """
    Signal handler to create PlayerProfile when a User is created.
    """
    if created:
        PlayerProfile.objects.create(user=instance)
        # Note: If wizard_name handling is done in RegisterSerializer (auth_app),
        # it might update the profile there after it's created by this signal.