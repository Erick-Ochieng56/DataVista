from rest_framework import serializers # type: ignore
from rest_framework_gis.serializers import GeoFeatureModelSerializer # type: ignore
from .models import CrimeCategory, CrimeType, Crime, CrimeAttribute

class CrimeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeCategory
        fields = ['id', 'name', 'description']

class CrimeTypeSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = CrimeType
        fields = ['id', 'name', 'description', 'category', 'category_name', 'severity_level']

class CrimeTypeDetailSerializer(serializers.ModelSerializer):
    category = CrimeCategorySerializer(read_only=True)
    
    class Meta:
        model = CrimeType
        fields = ['id', 'name', 'description', 'category', 'severity_level']

class CrimeAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeAttribute
        fields = ['id', 'name', 'value']

class CrimeSerializer(serializers.ModelSerializer):
    crime_type_name = serializers.ReadOnlyField(source='crime_type.name')
    agency_name = serializers.ReadOnlyField(source='agency.name')
    attributes = CrimeAttributeSerializer(many=True, read_only=True)
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    
    class Meta:
        model = Crime
        fields = [
            'id', 'incident_id', 'crime_type', 'crime_type_name', 
            'description', 'occurred_at', 'reported_at', 
            'agency', 'agency_name', 'data_source', 
            'block_address', 'zip_code', 'city', 'state', 'country',
            'longitude', 'latitude', 'verification_status',
            'attributes', 'created_at', 'updated_at', 'is_active'
        ]
    
    def get_longitude(self, obj):
        if obj.location:
            return obj.location.x
        return None
    
    def get_latitude(self, obj):
        if obj.location:
            return obj.location.y
        return None

class CrimeGeoSerializer(GeoFeatureModelSerializer):
    crime_type_name = serializers.ReadOnlyField(source='crime_type.name')
    agency_name = serializers.ReadOnlyField(source='agency.name')
    
    class Meta:
        model = Crime
        geo_field = 'location'
        fields = [
            'id', 'incident_id', 'crime_type', 'crime_type_name', 
            'description', 'occurred_at', 'reported_at', 
            'agency', 'agency_name', 'block_address',
            'verification_status'
        ]

class CrimeDetailSerializer(serializers.ModelSerializer):
    crime_type = CrimeTypeDetailSerializer(read_only=True)
    attributes = CrimeAttributeSerializer(many=True, read_only=True)
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    
    class Meta:
        model = Crime
        fields = [
            'id', 'incident_id', 'crime_type', 'description', 
            'occurred_at', 'reported_at', 'agency', 'data_source', 
            'longitude', 'latitude', 'block_address', 'zip_code', 
            'city', 'state', 'country', 'verification_status',
            'attributes', 'created_at', 'updated_at', 'is_active'
        ]
        
    def get_longitude(self, obj):
        if obj.location:
            return obj.location.x
        return None
    
    def get_latitude(self, obj):
        if obj.location:
            return obj.location.y
        return None

class CrimeCreateUpdateSerializer(serializers.ModelSerializer):
    longitude = serializers.FloatField(write_only=True)
    latitude = serializers.FloatField(write_only=True)
    attributes = CrimeAttributeSerializer(many=True, required=False)
    
    class Meta:
        model = Crime
        fields = [
            'incident_id', 'crime_type', 'description', 
            'occurred_at', 'reported_at', 'agency', 'data_source', 
            'longitude', 'latitude', 'block_address', 'zip_code', 
            'city', 'state', 'country', 'verification_status',
            'attributes', 'is_active'
        ]
    
    def create(self, validated_data):
        attributes_data = validated_data.pop('attributes', [])
        longitude = validated_data.pop('longitude')
        latitude = validated_data.pop('latitude')
        
        crime = Crime.objects.create(**validated_data)
        crime.set_location(longitude, latitude)
        crime.save()
        
        for attribute_data in attributes_data:
            CrimeAttribute.objects.create(crime=crime, **attribute_data)
        
        return crime
    
    def update(self, instance, validated_data):
        attributes_data = validated_data.pop('attributes', None)
        longitude = validated_data.pop('longitude', None)
        latitude = validated_data.pop('latitude', None)
        
        # Update the crime instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update location if provided
        if longitude is not None and latitude is not None:
            instance.set_location(longitude, latitude)
        
        instance.save()
        
        # Update attributes if provided
        if attributes_data is not None:
            instance.attributes.all().delete()  # Remove existing attributes
            for attribute_data in attributes_data:
                CrimeAttribute.objects.create(crime=instance, **attribute_data)
        
        return instance