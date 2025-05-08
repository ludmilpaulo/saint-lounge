from django.db import models
from ckeditor5.fields import CKEditor5Field

class Career(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    description = CKEditor5Field("Text", config_name="extends")
    requirements = CKEditor5Field("Text", config_name="extends")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('processing', 'Processing'),
        ('review', 'Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')

    def __str__(self):
        return f"{self.full_name} - {self.career.title}"

