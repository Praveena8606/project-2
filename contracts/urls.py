from django.urls import path

from .views import (
    DocumentClauseListView,
    DocumentDetailView,
    DocumentListView,
    DocumentRiskListView,
    DocumentUploadView,
)


urlpatterns = [
    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload",
    ),
    path(
        "documents/",
        DocumentListView.as_view(),
        name="document-list",
    ),
    path(
        "documents/<int:pk>/",
        DocumentDetailView.as_view(),
        name="document-detail",
    ),
    path(
        "documents/<int:document_id>/clauses/",
        DocumentClauseListView.as_view(),
        name="document-clause-list",
    ),
    path(
        "documents/<int:document_id>/risks/",
        DocumentRiskListView.as_view(),
        name="document-risk-list",
    ),
]