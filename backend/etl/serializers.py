from rest_framework import serializers
from .models import DataSource, ETLJob, DataValidationRule, ETLJobLog

class DataSourceSerializer(serializers.ModelSerializer):
    """Serializer for DataSource model"""
    class Meta:
        model = DataSource
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ETLJobSerializer(serializers.ModelSerializer):
    """Serializer for ETLJob model"""
    class Meta:
        model = ETLJob
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class DataValidationRuleSerializer(serializers.ModelSerializer):
    """Serializer for DataValidationRule model"""
    class Meta:
        model = DataValidationRule
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ETLJobLogSerializer(serializers.ModelSerializer):
    """Serializer for ETLJobLog model"""
    class Meta:
        model = ETLJobLog
        fields = '__all__'
        read_only_fields = ['timestamp']