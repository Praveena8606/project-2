from django.urls import path

from .views import (
    DocumentClauseListView,
    DocumentDeleteView,
    DocumentDetailView,
    DocumentListView,
    DocumentRiskListView,
    DocumentUploadView,
    StatsView,
)
from .auth_views import login_view, logout_view, me_view, register_view


urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────
    path("auth/login/",    login_view,    name="auth-login"),
    path("auth/logout/",   logout_view,   name="auth-logout"),
    path("auth/me/",       me_view,       name="auth-me"),
    path("auth/register/", register_view, name="auth-register"),

    # ── Analytics & Stats ─────────────────────────────────────
    path("stats/", StatsView.as_view(), name="contract-stats"),

    # ── Documents ─────────────────────────────────────────────
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
        "documents/<int:pk>/delete/",
        DocumentDeleteView.as_view(),
        name="document-delete",
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