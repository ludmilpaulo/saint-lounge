# documents/views.py
import io
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, Signature
from .serializers import DocumentSerializer, SignatureSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class SignatureViewSet(viewsets.ModelViewSet):
    queryset = Signature.objects.all()
    serializer_class = SignatureSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        document_id = request.data.get('document')
        document = Document.objects.get(id=document_id)
        signature_image = request.FILES.get('signature_image')
        x = float(request.data.get('x', 100))
        y = float(request.data.get('y', 500))

        signature = Signature.objects.create(
            document=document,
            signer=request.user,
            signature_image=signature_image,
        )

        self.embed_signature_into_pdf(document, signature, x, y)

        document.is_signed = True
        document.save()

        serializer = self.get_serializer(signature)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def embed_signature_into_pdf(self, document, signature, x, y):
        # Use signed_file if exists, else original file
        pdf_path = document.signed_file.path if document.signed_file else document.file.path
        sig_path = signature.signature_image.path

        pdf_doc = fitz.open(pdf_path)
        page = pdf_doc[0]  # page 1

        img = Image.open(sig_path)
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes = img_bytes.getvalue()

        rect = fitz.Rect(x, y, x + 200, y + 100)
        page.insert_image(rect, stream=img_bytes)

        # Add signer name + date text
        signer_name = signature.signer.get_full_name() or signature.signer.username
        signed_at = signature.signed_at.strftime("%Y-%m-%d %H:%M")

        text = f"Signed by {signer_name} on {signed_at}"

        page.insert_text(
            fitz.Point(x, y + 110),  # place text just under signature
            text,
            fontsize=10,
            color=(0, 0, 0)
        )

        # Save new signed file
        signed_pdf_path = pdf_path.replace('documents/', 'signed_documents/')
        if not signed_pdf_path.endswith('.pdf'):
            signed_pdf_path += '.pdf'

        pdf_doc.save(signed_pdf_path)
        pdf_doc.close()

        # Update signed_file always
        with open(signed_pdf_path, 'rb') as f:
            document.signed_file.save(
                signed_pdf_path.split('/')[-1],
                ContentFile(f.read()),
                save=True
            )
