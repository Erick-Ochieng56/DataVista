from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ReportViewSet, 
    ReportTemplateViewSet, 
    ScheduledReportViewSet
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'report-templates', ReportTemplateViewSet, basename='report-template')
router.register(r'scheduled-reports', ScheduledReportViewSet, basename='scheduled-report')

urlpatterns = [
    path('', include(router.urls)),
]