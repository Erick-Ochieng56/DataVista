from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Report, ReportTemplate, ScheduledReport

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ReportSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'status', 'file']

    def create(self, validated_data):
        # Automatically set the user to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ReportTemplateSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = ReportTemplate
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Automatically set the owner to the current user
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class ScheduledReportSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    template = ReportTemplateSerializer(read_only=True)
    
    class Meta:
        model = ScheduledReport
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_generated']

    def create(self, validated_data):
        # Automatically set the user to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)