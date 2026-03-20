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
router.register(r"import", ImportStudentsViewSet, basename="import-students")
router.register(r"export", ExportStudentsViewSet, basename="export-students")
router.register(
    r"registration-attempts", RegistrationAttemptsViewSet, basename="registration-attempts"
)
urlpatterns = [
    path("", include(router.urls)),
]
