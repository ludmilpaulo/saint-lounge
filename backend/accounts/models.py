from django.db import models
from django.contrib.auth.models import User

def upload_to(instance, filename):
    return f"user_files/{instance.user.username}/{filename}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # 📎 File uploads
    cv = models.FileField(upload_to=upload_to, null=True, blank=True)
    id_document = models.FileField(upload_to=upload_to, null=True, blank=True)
    certificate = models.FileField(upload_to=upload_to, null=True, blank=True)
    driver_license = models.ImageField(upload_to=upload_to, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    @property
    def departments(self):
        return self.user.groups.values_list('name', flat=True)
