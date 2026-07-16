from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse(
        {
            "message": "Welcome to LegalTech Contract Parsing API",
            "status": "Running Successfully",
            "upload_api": "/api/upload/",
            "admin": "/admin/",
        }
    )


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("contracts.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )