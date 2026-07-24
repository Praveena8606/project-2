from rest_framework import generics
from rest_framework.exceptions import ValidationError

from .models import Document
from .serializers import DocumentSerializer
from .utils import extract_text_from_pdf


class DocumentUploadView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def perform_create(self, serializer):
        document = serializer.save(status="Processing")

        try:
            extracted_text = extract_text_from_pdf(
                document.uploaded_file.path
            )

            document.extracted_text = extracted_text
            document.status = "Processed"
            document.save(
                update_fields=[
                    "extracted_text",
                    "status",
                ]
            )

        except Exception as error:
            document.status = "Failed"
            document.save(update_fields=["status"])

            raise ValidationError(
                {
                    "uploaded_file": (
                        "The PDF could not be processed. "
                        "Please upload a valid PDF file."
                    )
                }
            ) from error


class DocumentListView(generics.ListAPIView):
    queryset = Document.objects.all().order_by("-uploaded_at")
    serializer_class = DocumentSerializer


class DocumentDetailView(generics.RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer   