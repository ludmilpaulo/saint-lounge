from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
import mimetypes
from .models import JobApplication
from .serializers import JobApplicationSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-submitted_at')
    serializer_class = JobApplicationSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("🚨 Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        application = serializer.instance

        # ✅ HR Email
        try:
            hr_html = render_to_string("emails/hr_notification.html", {
                "full_name": application.full_name,
                "email": application.email,
                "title": application.career.title,
                "location": application.career.location,
                "cover_letter": application.cover_letter,
            })

            email = EmailMessage(
                subject=f"New Application – {application.career.title}",
                body=hr_html,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.HR_NOTIFICATION_EMAIL],
            )
            email.content_subtype = "html"

            if application.resume:
                resume_file = application.resume
                mime_type, _ = mimetypes.guess_type(resume_file.name)
                email.attach(
                    resume_file.name,
                    resume_file.read(),
                    mime_type or 'application/octet-stream'
                )

            email.send(fail_silently=False)

        except Exception as e:
            print("❌ Failed to send HR email:", str(e))

        # ✅ Confirmation Email to Applicant
        try:
            lang = getattr(application, 'language', 'en') or 'en'  # fallback to English

            context = {
                "full_name": application.full_name,
                "title": application.career.title,
            }

            if lang == 'pt':
                template = "emails/pt/applicant_confirmation.html"
            else:
                template = "emails/en/applicant_confirmation.html"

            applicant_html = render_to_string(template, context)

            confirmation = EmailMessage(
                subject=f"Application Received – {application.career.title}",
                body=applicant_html,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[application.email],
            )
            confirmation.content_subtype = "html"
            confirmation.send(fail_silently=False)

        except Exception as e:
            print("❌ Failed to send confirmation email:", str(e))

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
