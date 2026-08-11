from rest_framework import generics
from rest_framework.exceptions import ValidationError

from .clause_categorizer import extract_and_save_clauses
from .models import Document, ExtractedClause, RiskFlag
from .risk_detector import detect_risks
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
            # Step 1: Extract text from uploaded PDF
            extracted_text = extract_text_from_pdf(
                document.uploaded_file.path
            )

            # Step 2: Make sure text was extracted
            if not extracted_text:
                raise ValueError(
                    "No readable text was found in the PDF."
                )

            # Step 3: Save extracted text
            document.extracted_text = extracted_text
            document.status = "Processed"

            document.save(
                update_fields=[
                    "extracted_text",
                    "status",
                ]
            )

            # Step 4: Automatically extract and save clauses
            extract_and_save_clauses(document)

            # Step 5: Automatically detect and save risks
            detect_risks(document)

        except Exception as error:
            document.status = "Failed"
            document.save(
                update_fields=["status"]
            )

            raise ValidationError(
                {
                    "uploaded_file": (
                        "The PDF could not be processed. "
                        "Please upload a valid text-based PDF."
                    )
                }
            ) from error


class DocumentListView(generics.ListAPIView):
    queryset = Document.objects.all().order_by(
        "-uploaded_at"
    )
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
        ).order_by(
            "page_number",
            "id",
        )


class DocumentRiskListView(generics.ListAPIView):
    serializer_class = RiskFlagSerializer

    def get_queryset(self):
        document_id = self.kwargs["document_id"]

        return RiskFlag.objects.filter(
            document_id=document_id
        ).order_by("id")