from django.urls import path, include
from rest_framework.routers import DefaultRouter

from.serializers import JobApplicationViewSet
from .views import CareerViewSet

router = DefaultRouter()
router.register(r'careers', CareerViewSet)
router.register(r'job-applications', JobApplicationViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]
