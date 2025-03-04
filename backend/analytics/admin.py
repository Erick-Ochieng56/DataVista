from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import PredictiveModel, Prediction, AnalysisRequest

@admin.register(PredictiveModel)
class PredictiveModelAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'model_type', 
        'status', 
        'model_version', 
        'last_trained', 
        'created_by'
    )
    list_filter = (
        'model_type', 
        'status', 
        'created_at', 
        'last_trained'
    )
    search_fields = (
        'name', 
        'description', 
        'model_version'
    )
    readonly_fields = (
        'created_at', 
        'updated_at'
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields read-only for non-superusers"""
        if not request.user.is_superuser:
            return self.readonly_fields + ('created_by',)
        return self.readonly_fields

@admin.register(Prediction)
class PredictionAdmin(OSMGeoAdmin):
    list_display = (
        'model', 
        'prediction_start_date', 
        'prediction_end_date', 
        'confidence_level', 
        'is_verified', 
        'generated_by'
    )
    list_filter = (
        'model__model_type', 
        'prediction_start_date', 
        'is_verified', 
        'generated_at'
    )
    search_fields = (
        'model__name', 
        'generated_by__username'
    )
    readonly_fields = (
        'generated_at', 
        'verified_at'
    )

@admin.register(AnalysisRequest)
class AnalysisRequestAdmin(OSMGeoAdmin):
    list_display = (
        'title', 
        'user', 
        'status', 
        'start_date', 
        'end_date', 
        'created_at'
    )
    list_filter = (
        'status', 
        'start_date', 
        'end_date', 
        'created_at'
    )
    search_fields = (
        'title', 
        'description', 
        'user__username'
    )
    readonly_fields = (
        'created_at', 
        'updated_at', 
        'completed_at'
    )
