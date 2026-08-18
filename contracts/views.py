from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

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


class DocumentDeleteView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class StatsView(APIView):
    def get(self, request):
        total_documents = Document.objects.count()
        processed_documents = Document.objects.filter(status="Processed").count()
        processing_documents = Document.objects.filter(status="Processing").count()
        failed_documents = Document.objects.filter(status="Failed").count()

        total_clauses = ExtractedClause.objects.count()
        total_risks = RiskFlag.objects.count()

        high_risks = RiskFlag.objects.filter(severity__iexact="High").count()
        medium_risks = RiskFlag.objects.filter(severity__iexact="Medium").count()
        low_risks = RiskFlag.objects.filter(severity__iexact="Low").count()

        recent_documents = Document.objects.order_by("-uploaded_at")[:5]
        recent_docs_serialized = DocumentSerializer(recent_documents, many=True).data

        clause_type_counts = (
            ExtractedClause.objects.values("clause_type")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )

        return Response({
            "total_documents": total_documents,
            "processed_documents": processed_documents,
            "processing_documents": processing_documents,
            "failed_documents": failed_documents,
            "total_clauses": total_clauses,
            "total_risks": total_risks,
            "risk_distribution": {
                "high": high_risks,
                "medium": medium_risks,
                "low": low_risks,
            },
            "clause_distribution": list(clause_type_counts),
            "recent_documents": recent_docs_serialized,
        })