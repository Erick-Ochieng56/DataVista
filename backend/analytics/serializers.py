from rest_framework import serializers
from django.contrib.gis.geos import Polygon
from .models import PredictiveModel, Prediction, AnalysisRequest
from crimes.models import CrimeType

class CrimeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeType
        fields = ['id', 'name']
        ref_name = 'AnalyticsCrimeTypeSerializer'

class PredictiveModelSerializer(serializers.ModelSerializer):
    target_crime_types = CrimeTypeSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField()

    class Meta:
        model = PredictiveModel
        fields = '__all__'
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }

class PredictionSerializer(serializers.ModelSerializer):
    model = PredictiveModelSerializer(read_only=True)
    model_id = serializers.PrimaryKeyRelatedField(
        queryset=PredictiveModel.objects.all(), 
        source='model', 
        write_only=True
    )
    generated_by = serializers.StringRelatedField()
    area = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = '__all__'
        extra_kwargs = {
            'generated_at': {'read_only': True}
        }

    def get_area(self, obj):
        """Convert PostGIS geometry to GeoJSON if area exists"""
        if obj.area:
            return obj.area.geojson
        return None

    def to_internal_value(self, data):
        """Handle GeoJSON area input"""
        if 'area' in data and isinstance(data['area'], dict):
            try:
                # Convert GeoJSON to PostGIS Polygon
                area_geojson = data['area']
                area = Polygon.from_geojson(area_geojson)
                data['area'] = area
            except Exception as e:
                raise serializers.ValidationError(f"Invalid area format: {str(e)}")
        return super().to_internal_value(data)

class AnalysisRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    result_prediction = PredictionSerializer(read_only=True)
    area = serializers.SerializerMethodField()

    class Meta:
        model = AnalysisRequest
        fields = '__all__'
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'completed_at': {'read_only': True}
        }

    def get_area(self, obj):
        """Convert PostGIS geometry to GeoJSON if area exists"""
        if obj.area:
            return obj.area.geojson
        return None

    def to_internal_value(self, data):
        """Handle GeoJSON area input"""
        if 'area' in data and isinstance(data['area'], dict):
            try:
                # Convert GeoJSON to PostGIS Polygon
                area_geojson = data['area']
                area = Polygon.from_geojson(area_geojson)
                data['area'] = area
            except Exception as e:
                raise serializers.ValidationError(f"Invalid area format: {str(e)}")
        return super().to_internal_value(data)