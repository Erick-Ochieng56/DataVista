from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import Agency, AgencyAPIConfig, AgencyUser

@admin.register(Agency)
class AgencyAdmin(GISModelAdmin):
    """
    Admin configuration for Agency model
    """
    list_display = (
        'name', 
        'agency_code', 
        'agency_type', 
        'city', 
        'state', 
        'is_active', 
        'integration_status'
    )
    list_filter = (
        'agency_type', 
        'is_active', 
        'integration_status', 
        'city', 
        'state'
    )
    search_fields = (
        'name', 
        'agency_code', 
        'city', 
        'state'
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AgencyAPIConfig)
class AgencyAPIConfigAdmin(admin.ModelAdmin):
    """
    Admin configuration for AgencyAPIConfig model
    """
    list_display = (
        'agency', 
        'api_type', 
        'auth_type', 
        'last_sync'
    )
    list_filter = (
        'api_type', 
        'auth_type'
    )
    search_fields = (
        'agency__name', 
        'agency__agency_code'
    )
    readonly_fields = ('last_sync',)

@admin.register(AgencyUser)
class AgencyUserAdmin(admin.ModelAdmin):
    """
    Admin configuration for AgencyUser model
    """
    list_display = (
        'user', 
        'agency', 
        'role', 
        'is_primary'
    )
    list_filter = (
        'role', 
        'is_primary'
    )
    search_fields = (
        'user__username', 
        'agency__name'
    )
    readonly_fields = ('created_at', 'updated_at')