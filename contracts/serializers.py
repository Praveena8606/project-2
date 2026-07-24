from pathlib import Path

from rest_framework import serializers

from .models import Document


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