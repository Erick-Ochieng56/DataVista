from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from accounts import models

from .models import Report, ReportTemplate, ScheduledReport
from .serializers import (
    ReportSerializer, 
    ReportTemplateSerializer, 
    ScheduledReportSerializer
)

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own reports
        return Report.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['GET'])
    def pending_reports(self, request):
        """Retrieve pending reports for the current user"""
        pending_reports = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(pending_reports, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['POST'])
    def regenerate(self, request, pk=None):
        """Regenerate a specific report"""
        report = self.get_object()
        report.status = 'pending'
        report.save()
        # You would typically trigger a background task here to regenerate the report
        return Response({'status': 'Report queued for regeneration'})

class ReportTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = ReportTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can see public templates or their own templates
        return ReportTemplate.objects.filter(
            Q(is_public=True) | Q(owner=self.request.user)
        )
    
    @action(detail=False, methods=['GET'])
    def public_templates(self, request):
        """Retrieve all public report templates"""
        public_templates = ReportTemplate.objects.filter(is_public=True)
        serializer = self.get_serializer(public_templates, many=True)
        return Response(serializer.data)

class ScheduledReportViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduledReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own scheduled reports
        return ScheduledReport.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['POST'])
    def toggle_active(self, request, pk=None):
        """Toggle the active status of a scheduled report"""
        scheduled_report = self.get_object()
        scheduled_report.is_active = not scheduled_report.is_active
        scheduled_report.save()
        
        return Response({
            'id': scheduled_report.id, 
            'is_active': scheduled_report.is_active
        })
    
    @action(detail=False, methods=['GET'])
    def upcoming_reports(self, request):
        """Retrieve upcoming scheduled reports for the current user"""
        upcoming_reports = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(upcoming_reports, many=True)
        return Response(serializer.data)