from django.contrib.auth.models import User, Group
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .serializers import UserSerializer, GroupSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print("🚨 Payload:", request.data)
        response = super().create(request, *args, **kwargs)
        print("✅ Response:", response.data)
        return response


   

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]
