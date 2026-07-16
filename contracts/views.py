from rest_framework import generics
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Document
from .serializers import DocumentSerializer


class DocumentUploadView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]