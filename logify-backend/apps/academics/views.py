# from django.shortcuts import render
from apps.accounts.models import User

# Create your views here.
from apps.placements.models import InternshipPlacements
from rest_framework import status
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            institutions = Institutions.objects.all()
            serializer = InstitutionsSerializer(institutions, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "Only Internship Admins can view all institutions."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def post(self, request):
        if (
            request.user.role == User.INTERNSHIP_ADMIN
            or request.user.is_superuser
            or request.user.role == User.STUDENT
        ):
            serializer = InstitutionsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                {"error": "Institution data is invalid.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Students and Internship Admins can create an institution."},
            status=status.HTTP_403_FORBIDDEN,
        )


class InstitutionsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        institution = self.get_object(pk)
        if pk not in get_accessible_institution_ids(request.user):
            raise PermissionDenied("You do not have access to this institution")
        serializer = InstitutionsSerializer(institution)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            institution = self.get_object(pk)
            serializer = InstitutionsSerializer(institution, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Institution update data is invalid.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update institutions."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def patch(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            institution = self.get_object(pk)
            serializer = InstitutionsSerializer(institution, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Institution update data is invalid.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update institutions."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def delete(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            institution = self.get_object(pk)
            institution.delete()
            return Response(
                {"message": "Institution deleted successfully"}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Only Internship Admins can delete institutions."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def get_object(self, pk):
        try:
            return Institutions.objects.get(pk=pk)
        except Institutions.DoesNotExist:
            raise NotFound("Institution not found.")


class DepartmentsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            departments = Departments.objects.all()
            serializer = DepartmentsSerializer(departments, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "Only Internship Admins can view all departments"},
            status=status.HTTP_403_FORBIDDEN,
        )

    def post(self, request):
        if (
            request.user.role == User.INTERNSHIP_ADMIN
            or request.user.is_superuser
            or request.user.role == User.STUDENT
        ):
            serializer = DepartmentsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                {"error": "Department data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Students and Internship Admins can create departments."},
            status=status.HTTP_403_FORBIDDEN,
        )


class DepartmentsDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        department = self.get_object(pk)
        if pk not in get_accessible_department_ids(request.user):
            raise PermissionDenied("You do not have access to this department.")
        serializer = DepartmentsSerializer(department)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            department = self.get_object(pk)
            serializer = DepartmentsSerializer(department, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Department update data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update departments."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def patch(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            department = self.get_object(pk)
            serializer = DepartmentsSerializer(department, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Department update data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update departments."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def delete(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            department = self.get_object(pk)
            department.delete()
            return Response(
                {"message": "Department deleted successfully"}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Only Internship Admins can delete departments."},
            status=status.HTTP_403_FORBIDDEN,
        )

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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            programmes = Programmes.objects.all()
            serializer = ProgrammesSerializer(programmes, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "Only Internship Admins can view all programmes."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def post(self, request):
        if (
            request.user.role == User.INTERNSHIP_ADMIN
            or request.user.is_superuser
            or request.user.role == User.STUDENT
        ):
            serializer = ProgrammesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                {"error": "Programme data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Students and Internship Admins can create programmes."},
            status=status.HTTP_403_FORBIDDEN,
        )


class ProgrammesDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        programme = self.get_object(pk)
        if pk not in get_accessible_programme_ids(request.user):
            raise PermissionDenied("You do not have access to this programme.")
        serializer = ProgrammesSerializer(programme)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            programme = self.get_object(pk)
            serializer = ProgrammesSerializer(programme, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Programme update data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update programmes."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def patch(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            programme = self.get_object(pk)
            serializer = ProgrammesSerializer(programme, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Programme update data is invalid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Only Internship Admins can update programmes."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def delete(self, request, pk):
        if request.user.role == User.INTERNSHIP_ADMIN or request.user.is_superuser:
            programme = self.get_object(pk)
            programme.delete()
            return Response(
                {"message": "Programme deleted successfully"}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Only Internship Admins can delete programmes."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def get_object(self, pk):
        try:
            return Programmes.objects.get(pk=pk)
        except Programmes.DoesNotExist:
            raise NotFound("Programme not found.")


class DepartmentProgrammesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, department_id):
        programmes = Programmes.objects.filter(department_id=department_id)
        accessible_programme_ids = get_accessible_programme_ids(request.user)
        programmes = programmes.filter(id__in=accessible_programme_ids)
        if not programmes.exists():
            raise PermissionDenied("You do not have access to this department's programmes")
        serializer = ProgrammesSerializer(programmes, many=True)
        return Response(serializer.data)
