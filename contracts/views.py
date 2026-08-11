from rest_framework import generics
from rest_framework.exceptions import ValidationError

from .models import Document, ExtractedClause, RiskFlag
from .serializers import (
    DocumentSerializer,
    ExtractedClauseSerializer,
    RiskFlagSerializer,
)
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

            if not extracted_text:
                raise ValueError(
                    "No readable text was found in the PDF."
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
                        "Please upload a valid text-based PDF."
                    )
                }
            ) from error


class DocumentListView(generics.ListAPIView):
    queryset = Document.objects.all().order_by("-uploaded_at")
    serializer_class = DocumentSerializer


class DocumentDetailView(generics.RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentClauseListView(generics.ListAPIView):
    serializer_class = ExtractedClauseSerializer

    def get_queryset(self):
        document_id = self.kwargs["document_id"]

        return ExtractedClause.objects.filter(
            document_id=document_id
        ).order_by("page_number", "id")


class DocumentRiskListView(generics.ListAPIView):
    serializer_class = RiskFlagSerializer

    def get_queryset(self):
        document_id = self.kwargs["document_id"]

        return RiskFlag.objects.filter(
            document_id=document_id
        ).order_by("id")