from pathlib import Path

from rest_framework import serializers

from .models import Document, ExtractedClause, RiskFlag


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "uploaded_file",
            "uploaded_at",
            "status",
            "extracted_text",
        ]
        read_only_fields = [
            "id",
            "uploaded_at",
            "status",
            "extracted_text",
        ]

    def validate_uploaded_file(self, uploaded_file):
        extension = Path(uploaded_file.name).suffix.lower()

        if extension != ".pdf":
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        max_size = 10 * 1024 * 1024

        if uploaded_file.size > max_size:
            raise serializers.ValidationError(
                "PDF file size must not exceed 10 MB."
            )

        return uploaded_file


class ExtractedClauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedClause
        fields = [
            "id",
            "document",
            "clause_type",
            "content",
            "page_number",
        ]
        read_only_fields = ["id"]


class RiskFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskFlag
        fields = [
            "id",
            "document",
            "keyword",
            "severity",
            "description",
        ]
        read_only_fields = ["id"]