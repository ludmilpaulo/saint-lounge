from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mass_mail, EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth.models import User
from .models import EmailCampaign
from .serializers import EmailCampaignSerializer, UserEmailSerializer

class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all().order_by('-created_at')
    serializer_class = EmailCampaignSerializer

    @action(detail=False, methods=['get'])
    def user_emails(self, request):
        users = User.objects.exclude(email="").values_list('email', flat=True)
        return Response(list(users))
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        campaign = self.get_object()
        success = True

        try:
            for email in campaign.recipient_list:
                msg = EmailMultiAlternatives(
                    subject=campaign.subject,
                    body='',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[email]
                )
                msg.attach_alternative(campaign.body_html, "text/html")
                msg.send()
        except Exception as e:
            success = False
            print("❌ Error sending email:", str(e))

        campaign.status = 'sent' if success else 'failed'
        campaign.save()

        return Response({'status': campaign.status})


