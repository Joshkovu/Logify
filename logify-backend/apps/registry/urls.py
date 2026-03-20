from apps.registry.views import (
    ExportStudentsViewSet,
    ImportStudentsViewSet,
    RegistrationAttemptsViewSet,
    StudentRegistryViewSet,
)
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"students", StudentRegistryViewSet, basename="students")

router.register(
    r"registration-attempts", RegistrationAttemptsViewSet, basename="registration-attempts"
)
urlpatterns = [
    path("", include(router.urls)),
    path(
        "import-students/",
        ImportStudentsViewSet.as_view({"post": "create"}),
        name="import-students",
    ),
    path(
        "export-students/", ExportStudentsViewSet.as_view({"get": "list"}), name="export-students"
    ),
]
