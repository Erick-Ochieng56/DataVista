from django.contrib import admin
from django.utils.html import format_html
from .models import Report, ReportTemplate, ScheduledReport

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'user', 'start_date', 'end_date', 
        'status', 'format', 'created_at', 
        'download_file_link'
    )
    list_filter = ('status', 'format', 'created_at')
    search_fields = ('title', 'user__username')
    
    def download_file_link(self, obj):
        if obj.file:
            return format_html(
                '<a href="{}" target="_blank">Download</a>', 
                obj.file.url
            )
        return 'No file'
    download_file_link.short_description = 'Report File'

@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'template_type', 'format', 
        'is_public', 'owner', 'created_at'
    )
    list_filter = ('template_type', 'format', 'is_public')
    search_fields = ('name', 'description')

@admin.register(ScheduledReport)
class ScheduledReportAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'user', 'template', 'frequency', 
        'is_active', 'last_generated', 'created_at'
    )
    list_filter = ('frequency', 'is_active', 'created_at')
    search_fields = ('name', 'user__username')