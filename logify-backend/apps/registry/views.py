# from django.shortcuts import render

# Create your views here.
from apps.registry.models import RegistrationAttempts, StudentRegistry
from apps.registry.serializer import (
    RegistrationAttemptsSerializer,
    StudentRegistrySerializer,
)
from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets
from rest_framework.response import Response


class IsInternshipAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == get_user_model().INTERNSHIP_ADMIN  # type: ignore


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == get_user_model().STUDENT  # type: ignore


class StudentRegistryViewSet(viewsets.ModelViewSet):
    queryset = StudentRegistry.objects.all()
    serializer_class = StudentRegistrySerializer
    permission_classes = [IsInternshipAdmin]


class RegistrationAttemptsViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationAttemptsSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return RegistrationAttempts.objects.none()
        return RegistrationAttempts.objects.filter(webmail=user.email)  # type: ignore


class ImportStudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsInternshipAdmin]

    def create(self, request):
        # Logic for importing students from a file
        return Response()


class ExportStudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsInternshipAdmin]

    def list(self, request):
        # Logic for exporting students to a file
        return Response()
