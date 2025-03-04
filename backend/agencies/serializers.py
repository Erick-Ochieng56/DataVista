from rest_framework import serializers
from .models import Agency, AgencyAPIConfig, AgencyUser

class AgencySerializer(serializers.ModelSerializer):
    """Serializer for Agency model"""
    class Meta:
        model = Agency
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class AgencyAPIConfigSerializer(serializers.ModelSerializer):
    """Serializer for AgencyAPIConfig model"""
    class Meta:
        model = AgencyAPIConfig
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'api_key': {'write_only': True}
        }

class AgencyUserSerializer(serializers.ModelSerializer):
    """Serializer for AgencyUser model"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)

    class Meta:
        model = AgencyUser
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')