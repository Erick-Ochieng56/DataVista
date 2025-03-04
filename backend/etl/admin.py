from django.contrib import admin
from .models import DataSource, ETLJob, DataValidationRule, ETLJobLog

@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    """Admin configuration for DataSource model"""
    list_display = ['name', 'agency', 'source_type', 'is_active', 'sync_frequency']
    list_filter = ['agency', 'source_type', 'is_active', 'sync_frequency']
    search_fields = ['name', 'description']

@admin.register(ETLJob)
class ETLJobAdmin(admin.ModelAdmin):
    """Admin configuration for ETLJob model"""
    list_display = ['job_id', 'data_source', 'status', 'start_time', 'end_time']
    list_filter = ['status', 'start_time', 'end_time']
    search_fields = ['job_id']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(DataValidationRule)
class DataValidationRuleAdmin(admin.ModelAdmin):
    """Admin configuration for DataValidationRule model"""
    list_display = ['name', 'data_source', 'rule_type', 'field_name', 'is_active']
    list_filter = ['data_source', 'rule_type', 'is_active']
    search_fields = ['name', 'description']

@admin.register(ETLJobLog)
class ETLJobLogAdmin(admin.ModelAdmin):
    """Admin configuration for ETLJobLog model"""
    list_display = ['job', 'level', 'message', 'timestamp']
    list_filter = ['job', 'level', 'timestamp']
    search_fields = ['message']