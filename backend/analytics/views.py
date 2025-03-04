from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q

from .models import PredictiveModel, Prediction, AnalysisRequest
from .serializers import (
    PredictiveModelSerializer, 
    PredictionSerializer, 
    AnalysisRequestSerializer
)

class PredictiveModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Predictive Models
    Allows CRUD operations and additional actions like training and deployment
    """
    queryset = PredictiveModel.objects.all()
    serializer_class = PredictiveModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Set the creator of the model"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def train_model(self, request, pk=None):
        """
        Initiate model training process
        """
        model = self.get_object()
        model.status = 'training'
        model.last_trained = timezone.now()
        model.save()

        # TODO: Actual model training logic would go here
        # This is a placeholder for actual machine learning training process
        return Response({
            'status': 'Model training initiated',
            'model': self.get_serializer(model).data
        })

    @action(detail=True, methods=['post'])
    def deploy_model(self, request, pk=None):
        """
        Deploy a trained model to active status
        """
        model = self.get_object()
        
        # Check if model is ready for deployment
        if model.status != 'training':
            return Response({
                'error': 'Model must complete training before deployment'
            }, status=status.HTTP_400_BAD_REQUEST)

        model.status = 'active'
        model.save()

        return Response({
            'status': 'Model deployed successfully',
            'model': self.get_serializer(model).data
        })

class PredictionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Crime Predictions
    """
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Set the generator of the prediction"""
        serializer.save(generated_by=self.request.user)

    def get_queryset(self):
        """
        Optionally filter predictions by various parameters
        """
        queryset = Prediction.objects.all()
        
        # Filter by model type
        model_type = self.request.query_params.get('model_type', None)
        if model_type:
            queryset = queryset.filter(model__model_type=model_type)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date and end_date:
            queryset = queryset.filter(
                Q(prediction_start_date__gte=start_date) & 
                Q(prediction_end_date__lte=end_date)
            )
        
        return queryset

    @action(detail=True, methods=['post'])
    def verify_prediction(self, request, pk=None):
        """
        Verify a prediction after its time period has passed
        """
        prediction = self.get_object()
        
        # TODO: Implement actual verification logic 
        # This would involve comparing predicted vs actual crime data
        prediction.is_verified = True
        prediction.verified_at = timezone.now()
        prediction.save()

        return Response({
            'status': 'Prediction verified',
            'prediction': self.get_serializer(prediction).data
        })

class AnalysisRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Analysis Requests
    """
    queryset = AnalysisRequest.objects.all()
    serializer_class = AnalysisRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Set the user creating the analysis request"""
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """
        Filter analysis requests by status or user
        """
        queryset = AnalysisRequest.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

    @action(detail=True, methods=['post'])
    def process_request(self, request, pk=None):
        """
        Process an analysis request
        """
        analysis_request = self.get_object()
        
        # Check if request is pending
        if analysis_request.status != 'pending':
            return Response({
                'error': 'Only pending requests can be processed'
            }, status=status.HTTP_400_BAD_REQUEST)

        analysis_request.status = 'processing'
        analysis_request.save()

        # TODO: Implement actual analysis request processing logic
        # This might involve selecting an appropriate predictive model
        # and generating a prediction

        return Response({
            'status': 'Analysis request is being processed',
            'request': self.get_serializer(analysis_request).data
        })