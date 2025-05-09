from rest_framework import serializers
from django.contrib.auth.models import User
from .models import EmailCampaign

class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class EmailCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailCampaign
        fields = '__all__'
