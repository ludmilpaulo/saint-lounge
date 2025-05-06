# documents/serializers.py
from rest_framework import serializers
from .models import Document, Signature

class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    signed_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_url', 'signed_file', 'signed_file_url', 'uploaded_by', 'is_signed', 'created_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else None

    def get_signed_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.signed_file.url) if obj.signed_file else None

class SignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signature
        fields = '__all__'
