from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DataSource, ETLJob, DataValidationRule, ETLJobLog
from .serializers import (
    DataSourceSerializer, 
    ETLJobSerializer, 
    DataValidationRuleSerializer, 
    ETLJobLogSerializer
)

class DataSourceViewSet(viewsets.ModelViewSet):
    """ViewSet for DataSource model"""
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def trigger_sync(self, request, pk=None):
        """Manually trigger sync for a specific data source"""
        data_source = self.get_object()
        # Implement your sync logic here
        # This is a placeholder - you'll need to add actual sync implementation
        try:
            # Example: Create an ETL job
            etl_job = ETLJob.objects.create(
                data_source=data_source,
                job_id=f"manual_sync_{data_source.id}",
                status='running'
            )
            return Response({
                'status': 'Sync initiated',
                'job_id': etl_job.job_id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'Sync failed',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class ETLJobViewSet(viewsets.ModelViewSet):
    """ViewSet for ETLJob model"""
    queryset = ETLJob.objects.all()
    serializer_class = ETLJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def job_logs(self, request, pk=None):
        """Retrieve logs for a specific ETL job"""
        etl_job = self.get_object()
        logs = ETLJobLog.objects.filter(job=etl_job)
        serializer = ETLJobLogSerializer(logs, many=True)
        return Response(serializer.data)

class DataValidationRuleViewSet(viewsets.ModelViewSet):
    """ViewSet for DataValidationRule model"""
    queryset = DataValidationRule.objects.all()
    serializer_class = DataValidationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

class ETLJobLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ETLJobLog model (read-only)"""
    queryset = ETLJobLog.objects.all()
    serializer_class = ETLJobLogSerializer
    permission_classes = [permissions.IsAuthenticated]
