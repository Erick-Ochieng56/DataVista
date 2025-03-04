from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PredictiveModelViewSet, 
    PredictionViewSet, 
    AnalysisRequestViewSet
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'predictive-models', PredictiveModelViewSet)
router.register(r'predictions', PredictionViewSet)
router.register(r'analysis-requests', AnalysisRequestViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]