import io
import os
from PIL import Image
from django.conf import settings
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, Signature
from .serializers import SignatureSerializer
import fitz  # PyMuPDF


class SignatureViewSet(viewsets.ModelViewSet):
    queryset = Signature.objects.all()
    serializer_class = SignatureSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            document_id = int(request.data.get('document'))
            user_id = int(request.data.get('user_id'))
            x = float(request.data.get('x', 100))
            y = float(request.data.get('y', 500))
            page_number = int(request.data.get('page_number', 1))
        except (ValueError, TypeError):
            return Response({"detail": "Invalid input."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.get(id=document_id)
            user = User.objects.get(id=user_id)
        except Document.DoesNotExist:
            return Response({"detail": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        signature_image = request.FILES.get('signature_image')
        if not signature_image:
            return Response({"detail": "Signature image is required."}, status=status.HTTP_400_BAD_REQUEST)

        signature = Signature.objects.create(
            document=document,
            signer=user,
            signature_image=signature_image,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:512],
        )

        self.embed_signature_into_pdf(document, signature, x, y, page_number)

        document.is_signed = True
        document.save()

        serializer = self.get_serializer(signature)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def embed_signature_into_pdf(self, document, signature, x, y, page_number):
        # Use signed_file if exists, else original file
        pdf_path = document.signed_file.path if document.signed_file else document.file.path
        sig_path = signature.signature_image.path

        # Load the PDF and signature image
        pdf_doc = fitz.open(pdf_path)
        page_index = max(0, page_number - 1)
        if page_index >= len(pdf_doc):
            page_index = 0
        page = pdf_doc[page_index]

        # Convert image to bytes
        img = Image.open(sig_path)
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes = img_bytes.getvalue()

        # Insert signature image
        rect = fitz.Rect(x, y, x + 200, y + 100)
        page.insert_image(rect, stream=img_bytes)

        # Add signer name and date
        signer_name = signature.signer.get_full_name() or signature.signer.username
        signed_at = signature.signed_at.strftime("%Y-%m-%d %H:%M")
        text = f"Signed by {signer_name} on {signed_at}"
        page.insert_text(fitz.Point(x, y + 110), text, fontsize=10, color=(0, 0, 0))

        # Ensure signed_documents directory exists
        signed_dir = os.path.join(settings.MEDIA_ROOT, 'signed_documents')
        os.makedirs(signed_dir, exist_ok=True)

        # Build signed PDF path
        filename = os.path.basename(pdf_path).replace(".pdf", "-signed.pdf")
        signed_pdf_path = os.path.join(signed_dir, filename)

        # Save the signed PDF
        pdf_doc.save(signed_pdf_path)
        pdf_doc.close()

        # Save file to Document.signed_file
        with open(signed_pdf_path, 'rb') as f:
            document.signed_file.save(
                filename,
                ContentFile(f.read()),
                save=True
            )
