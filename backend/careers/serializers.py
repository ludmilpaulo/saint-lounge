from rest_framework import viewsets
from .models import Career, JobApplication
from .serializers import CareerSerializer, JobApplicationSerializer

class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all().order_by('-created_at')
    serializer_class = CareerSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-submitted_at')
    serializer_class = JobApplicationSerializer
