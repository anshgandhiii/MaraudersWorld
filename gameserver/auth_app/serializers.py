# auth_app/serializers.py
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from gamemodels.models import PlayerProfile # Import PlayerProfile from gamemodels_app

# MyTokenObtainPairSerializer (remains the same as your previous version)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        try:
            profile = PlayerProfile.objects.get(user=user) # Query PlayerProfile
            token['house'] = profile.house
            # You might also want to include the wizard_name here if it's stored on PlayerProfile
            # if hasattr(profile, 'display_name'):
            # token['wizard_name'] = profile.display_name
        except PlayerProfile.DoesNotExist:
            token['house'] = None
            # token['wizard_name'] = None
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    # This 'wizard_name' is for the input from the frontend.
    # We'll use it to set a field on PlayerProfile.
    wizard_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=100)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'wizard_name') # Include wizard_name

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "User with this email already exists."})
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError(
                {"username": "User with this username already exists."})
        return attrs

    def create(self, validated_data):
        # Pop wizard_name as it's not a field on the Django User model
        wizard_name_from_input = validated_data.pop('wizard_name', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        # PlayerProfile is created by the signal in gamemodels_app.
        # Now, if wizard_name was provided, try to update the PlayerProfile.
        # This assumes you have a field like 'display_name' or similar on PlayerProfile
        # to store the wizard_name. If User.username IS the wizard_name, this step is not needed.
        if wizard_name_from_input:
            try:
                profile = PlayerProfile.objects.get(user=user)
                # **DECISION POINT for wizard_name storage:**
                # Option 1: Add a 'display_name' field to PlayerProfile model:
                # profile.display_name = wizard_name_from_input
                #
                # Option 2: Use User.first_name (if appropriate):
                # user.first_name = wizard_name_from_input
                # user.save() # Save the user object again if modifying it
                #
                # For now, let's assume you'll add `display_name` to `PlayerProfile` model
                # If PlayerProfile.display_name exists:
                if hasattr(profile, 'display_name'):
                    profile.display_name = wizard_name_from_input
                    profile.save()
                else:
                    # Fallback or log: PlayerProfile doesn't have a field for wizard_name
                    print(f"Note: wizard_name '{wizard_name_from_input}' provided but no 'display_name' field on PlayerProfile for user {user.username}")

            except PlayerProfile.DoesNotExist:
                # This should ideally not happen if the signal is working correctly.
                print(f"Error: PlayerProfile for user {user.username} not found after creation.")
        return user


class UserSerializer(serializers.ModelSerializer): # This is for user details, used in RegisterView response
    # If you want to nest profile information directly in the UserSerializer:
    # profile = PlayerProfileSerializer(read_only=True) # Assuming PlayerProfileSerializer is defined in gamemodels_app

    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # 'profile' could be added here
        # If you add 'profile' here, you'd need to import PlayerProfileSerializer from gamemodels_app
        # and ensure 'profile' is the related_name from User to PlayerProfile.