from django.db import models

class EmailCampaign(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    body_html = models.TextField()  # HTML email content
    recipient_list = models.JSONField()  # Stores list of emails
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
