import random
from datetime import timedelta
from django.utils import timezone
# documents/models.py
from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_signed = models.BooleanField(default=False)
    signed_file = models.FileField(upload_to='signed_documents/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Signature(models.Model):
    document = models.ForeignKey(Document, related_name='signatures', on_delete=models.CASCADE)
    signer = models.ForeignKey(User, on_delete=models.CASCADE)
    signature_image = models.ImageField(upload_to='signatures/')
    signed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, null=True, blank=True)

    def __str__(self):
        return f"Signature by {self.signer.username} on {self.document.title}"


class OTP(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.created_at > timezone.now() - timedelta(minutes=10)  # 10 minutes valid

    @staticmethod
    def generate_otp(email):
        code = ''.join(random.choices('0123456789', k=6))
        otp = OTP.objects.create(email=email, code=code)
        return otp
# models.py placeholder (Document, Signature, OTP)