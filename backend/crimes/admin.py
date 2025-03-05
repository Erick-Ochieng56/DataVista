from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import CrimeCategory, CrimeType, Crime, CrimeAttribute

@admin.register(CrimeCategory)
class CrimeCategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Crime Categories"""
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(CrimeType)
class CrimeTypeAdmin(admin.ModelAdmin):
    """Admin configuration for Crime Types"""
    list_display = ['name', 'category', 'severity_level']
    list_filter = ['category', 'severity_level']
    search_fields = ['name', 'description']

@admin.register(Crime)
class CrimeAdmin(GISModelAdmin):
    """Admin configuration for Crime Incidents"""
    list_display = [
        'incident_id', 
        'crime_type', 
        'occurred_at', 
        'city', 
        'state', 
        'verification_status'
    ]
    list_filter = [
        'crime_type', 
        'city', 
        'state', 
        'verification_status', 
        'occurred_at'
    ]
    search_fields = [
        'incident_id', 
        'description', 
        'block_address'
    ]
    
    # Use OSMGeoAdmin to provide map interface for location
    default_lon = 0  # Default longitude
    default_lat = 0  # Default latitude
    default_zoom = 2

@admin.register(CrimeAttribute)
class CrimeAttributeAdmin(admin.ModelAdmin):
    """Admin configuration for Crime Attributes"""
    list_display = ['crime', 'name', 'value']
    list_filter = ['name']
    search_fields = ['name', 'value']