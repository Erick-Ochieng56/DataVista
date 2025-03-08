from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, LoginHistory

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_image', 'address', 'city', 'state', 
                  'zip_code', 'country', 'default_search_radius', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with additional profile information"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'user_type', 'is_email_verified', 
                  'theme_preference', 'profile']
        read_only_fields = ['id', 'is_email_verified']
        ref_name = 'AccountsUserSerializer'

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password validation"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 
                  'first_name', 'last_name', 'phone_number', 'user_type']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False}
        }
    
    def validate(self, attrs):
        """
        Validate that passwords match
        """
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        """
        Create user with hashed password
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            user_type=validated_data.get('user_type', 'public')
        )
        return user

class LoginHistorySerializer(serializers.ModelSerializer):
    """Serializer for LoginHistory model"""
    class Meta:
        model = LoginHistory
        fields = ['login_time', 'ip_address', 'user_agent', 
                  'device_type', 'was_successful', 'failure_reason']