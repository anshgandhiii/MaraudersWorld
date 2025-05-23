from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# Assuming your PlayerProfile model is in another app, e.g., 'game_app'
# from game_app.models import PlayerProfile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # Add any other user details you want in the token
        # try:
        #     profile = PlayerProfile.objects.get(user=user)
        #     token['house'] = profile.house
        # except PlayerProfile.DoesNotExist:
        #     token['house'] = None

        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

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
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            # Password is set separately to ensure it's hashed
        )
        user.set_password(validated_data['password'])
        user.save()

        # Optional: Create PlayerProfile upon registration
        # from game_app.models import PlayerProfile # Import here to avoid circular dependency
        # PlayerProfile.objects.create(user=user)

        return user

class UserSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True) # Or a nested serializer
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # Add 'profile' if you have a related field