from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, LoginHistory
from django.db import transaction

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_image', 'address', 'city', 'state', 
                  'zip_code', 'country', 'default_search_radius', 'updated_at']
        read_only_fields = ['updated_at']

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with additional profile information"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'user_type', 'is_email_verified', 
                  'theme_preference', 'profile']
        read_only_fields = ['id', 'is_email_verified']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password validation and profile creation"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    # Add profile to registration serializer
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 
                  'first_name', 'last_name', 'phone_number', 'user_type',
                  'theme_preference', 'profile']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'theme_preference': {'required': False}
        }
    
    def validate(self, attrs):
        """
        Validate that passwords match
        """
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        """
        Create user with hashed password and profile if provided
        """
        # Extract profile data if it exists
        profile_data = validated_data.pop('profile', {})
        
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            user_type=validated_data.get('user_type', 'public'),
            theme_preference=validated_data.get('theme_preference', 'system')
        )
        
        # Create or update user profile with provided data
        if profile_data:
            UserProfile.objects.update_or_create(
                user=user,
                defaults=profile_data
            )
        else:
            # Create default profile if none provided
            UserProfile.objects.create(user=user)
            
        return user

class LoginHistorySerializer(serializers.ModelSerializer):
    """Serializer for LoginHistory model"""
    class Meta:
        model = LoginHistory
        fields = ['login_time', 'ip_address', 'user_agent', 
                  'device_type', 'was_successful', 'failure_reason']