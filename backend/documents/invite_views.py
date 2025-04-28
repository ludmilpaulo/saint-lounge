# documents/invite_views.py
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from django.conf import settings

class SendInviteView(APIView):
    def post(self, request):
        document_id = request.data.get('document_id')
        email = request.data.get('email')

        if not document_id or not email:
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        # Construct signing link
        signing_link = f"{settings.FRONTEND_URL}/sign/{document_id}"

        subject = f"Invitation to sign document: {document.title}"
        message = f"You have been invited to sign the document.\n\nSign here: {signing_link}\n\nThank you."
        from_email = settings.DEFAULT_FROM_EMAIL

        send_mail(subject, message, from_email, [email])

        return Response({"message": "Invitation sent!"}, status=status.HTTP_200_OK)
