# from django.shortcuts import render
from apps.accounts.models import User

# Create your views here.
from apps.accounts.permissions import IsInternshipAdmin
from apps.placements.models import InternshipPlacements
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Departments, Institutions, Programmes
from .serializer import (
    DepartmentsSerializer,
    InstitutionsSerializer,
    ProgrammesSerializer,
)


def get_accessible_institution_ids(user):
    if user.is_superuser or user.role == User.INTERNSHIP_ADMIN:
        return Institutions.objects.values_list("id", flat=True)

    if user.role == User.STUDENT:
        return InternshipPlacements.objects.filter(intern=user).values_list(
            "institution_id", flat=True
        )

    if user.role == User.WORKPLACE_SUPERVISOR:
        return InternshipPlacements.objects.filter(workplace_supervisor=user).values_list(
            "institution_id", flat=True
        )

    if user.role == User.ACADEMIC_SUPERVISOR:
        return InternshipPlacements.objects.filter(academic_supervisor=user).values_list(
            "institution_id", flat=True
        )

    return Institutions.objects.none().values_list("id", flat=True)


def get_accessible_department_ids(user):
    if user.is_superuser or user.role == User.INTERNSHIP_ADMIN:
        return Departments.objects.values_list("id", flat=True)

    if user.role == User.STUDENT:
        return Departments.objects.filter(
            institution_id__in=InternshipPlacements.objects.filter(intern=user).values_list(
                "institution_id", flat=True
            )
        ).values_list("id", flat=True)

    if user.role == User.WORKPLACE_SUPERVISOR:
        return Departments.objects.filter(
            institution_id__in=InternshipPlacements.objects.filter(
                workplace_supervisor=user
            ).values_list("institution_id", flat=True)
        ).values_list("id", flat=True)

    if user.role == User.ACADEMIC_SUPERVISOR:
        return Departments.objects.filter(
            institution_id__in=InternshipPlacements.objects.filter(
                academic_supervisor=user
            ).values_list("institution_id", flat=True)
        ).values_list("id", flat=True)

    return Departments.objects.none().values_list("id", flat=True)


def get_accessible_programme_ids(user):
    if user.is_superuser or user.role == User.INTERNSHIP_ADMIN:
        return Programmes.objects.values_list("id", flat=True)

    if user.role == User.STUDENT:
        return InternshipPlacements.objects.filter(intern=user).values_list(
            "programme_id", flat=True
        )

    if user.role == User.ACADEMIC_SUPERVISOR:
        return InternshipPlacements.objects.filter(academic_supervisor=user).values_list(
            "programme_id", flat=True
        )

    return Programmes.objects.none().values_list("id", flat=True)


class InstitutionsListView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def get(self, request):
        institutions = Institutions.objects.all()
        serializer = InstitutionsSerializer(institutions, many=True)
        return Response(serializer.data)


class InstitutionsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        institution = self.get_object(pk)
        if pk not in get_accessible_institution_ids(request.user):
            raise PermissionDenied("You do not have access to this institution")
        serializer = InstitutionsSerializer(institution)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Institutions.objects.get(pk=pk)
        except Institutions.DoesNotExist:
            raise NotFound("Institution not found.")


class DepartmentsListView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def get(self, request):
        departments = Departments.objects.all()
        serializer = DepartmentsSerializer(departments, many=True)
        return Response(serializer.data)


class DepartmentsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        department = self.get_object(pk)
        if pk not in get_accessible_department_ids(request.user):
            raise PermissionDenied("You do not have access to this department.")
        serializer = DepartmentsSerializer(department)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Departments.objects.get(pk=pk)
        except Departments.DoesNotExist:
            raise NotFound("Department not found.")


class InstitutionDepartmentsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, institution_id):
        accessible_institution_ids = get_accessible_institution_ids(request.user)
        if institution_id not in accessible_institution_ids:
            raise PermissionDenied("You do not have access to this institution's departments")
        departments = Departments.objects.filter(institution_id=institution_id)
        serializer = DepartmentsSerializer(departments, many=True)
        return Response(serializer.data)


class ProgrammesListView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def get(self, request):
        programmes = Programmes.objects.all()
        serializer = ProgrammesSerializer(programmes, many=True)
        return Response(serializer.data)


class ProgrammesDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        programme = self.get_object(pk)
        if pk not in get_accessible_programme_ids(request.user):
            raise PermissionDenied("You do not have access to this programme.")
        serializer = ProgrammesSerializer(programme)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Programmes.objects.get(pk=pk)
        except Programmes.DoesNotExist:
            raise NotFound("Programme not found.")


class DepartmentProgrammesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        accessible_department_ids = get_accessible_department_ids(request.user)
        if department_id not in accessible_department_ids:
            raise PermissionDenied("You do not have access to this department's programmes")
        programmes = Programmes.objects.filter(department_id=department_id)
        serializer = ProgrammesSerializer(programmes, many=True)
        return Response(serializer.data)
