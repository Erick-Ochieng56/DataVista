from rest_framework import serializers
from .models import Alert, AlertNotification
from django.contrib.gis.geos import Point

class AlertSerializer(serializers.ModelSerializer):
    """Serializer for Alert model"""
    longitude = serializers.FloatField(write_only=True, required=False)
    latitude = serializers.FloatField(write_only=True, required=False)

    class Meta:
        model = Alert
        fields = [
            'id', 'name', 'user', 'crime_types', 'location', 
            'address', 'search_distance_meters', 'is_active',
            'notification_method', 'check_frequency', 
            'notification_contact', 'created_at', 'updated_at',
            'longitude', 'latitude'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Custom create method to handle location setting"""
        longitude = validated_data.pop('longitude', None)
        latitude = validated_data.pop('latitude', None)
        
        # Set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        
        # Create the alert
        alert = Alert.objects.create(**validated_data)
        
        # Set location if provided
        if longitude is not None and latitude is not None:
            alert.set_location(longitude, latitude)
            alert.save()
        
        return alert

    def update(self, instance, validated_data):
        """Custom update method to handle location updates"""
        longitude = validated_data.pop('longitude', None)
        latitude = validated_data.pop('latitude', None)
        
        # Update alert fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Set location if provided
        if longitude is not None and latitude is not None:
            instance.set_location(longitude, latitude)
        
        instance.save()
        return instance

class AlertNotificationSerializer(serializers.ModelSerializer):
    """Serializer for AlertNotification model"""
    class Meta:
        model = AlertNotification
        fields = '__all__'
        read_only_fields = ['id', 'sent_at']