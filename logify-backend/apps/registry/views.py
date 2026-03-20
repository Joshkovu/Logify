# from django.shortcuts import render

# Create your views here.
from apps.registry.models import RegistrationAttempts, StudentRegistry
from apps.registry.serializer import (
    RegistrationAttemptsSerializer,
    StudentRegistrySerializer,
)
from django.contrib.auth import get_user_model
from requests import Response
from rest_framework import permissions, viewsets


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
    queryset = RegistrationAttempts.objects.all()
    serializer_class = RegistrationAttemptsSerializer
    permission_classes = [IsStudent]


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
