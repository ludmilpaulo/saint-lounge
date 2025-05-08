from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Career, JobApplication
from .serializers import JobApplicationSerializer
from django.template.loader import render_to_string

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-submitted_at')
    serializer_class = JobApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        application = serializer.instance

        # HR notification with HTML email
        hr_html = render_to_string("emails/hr_notification.html", {
            "full_name": application.full_name,
            "email": application.email,
            "title": application.career.title,
            "location": application.career.location,
            "cover_letter": application.cover_letter
        })

        email = EmailMessage(
            subject=f"New Application – {application.career.title}",
            body=hr_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.HR_NOTIFICATION_EMAIL],
        )
        email.content_subtype = "html"  # Set content type to HTML
        if application.resume:
            email.attach(application.resume.name, application.resume.read(), application.resume.file.content_type)
        email.send(fail_silently=False)

        # Applicant confirmation email
        applicant_html = render_to_string("emails/applicant_confirmation.html", {
            "full_name": application.full_name,
            "title": application.career.title
        })

        confirmation_email = EmailMessage(
            subject=f"Application Received – {application.career.title}",
            body=applicant_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[application.email],
        )
        confirmation_email.content_subtype = "html"
        confirmation_email.send(fail_silently=False)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all().order_by('-created_at')
    serializer_class = CareerSerializer
