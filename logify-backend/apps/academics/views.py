# from django.shortcuts import render
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Departments, Institutions, Programmes
from .serializer import (
    DepartmentsSerializer,
    InstitutionsSerializer,
    ProgrammesSerializer,
)


# Create your views here.
class InstitutionsListView(APIView):

    def get(self, request):
        institutions = Institutions.objects.all()
        serializer = InstitutionsSerializer(institutions, many=True)
        return Response(serializer.data)


class InstitutionsDetailView(APIView):

    def get(self, request, pk):
        institution = self.get_object(pk)
        serializer = InstitutionsSerializer(institution)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Institutions.objects.get(pk=pk)
        except Institutions.DoesNotExist:
            raise NotFound("Institution not found.")


class DepartmentsListView(APIView):

    def get(self, request):
        departments = Departments.objects.all()
        serializer = DepartmentsSerializer(departments, many=True)
        return Response(serializer.data)


class DepartmentsDetailView(APIView):

    def get(self, request, pk):
        department = self.get_object(pk)
        serializer = DepartmentsSerializer(department)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Departments.objects.get(pk=pk)
        except Departments.DoesNotExist:
            raise NotFound("Department not found.")


class InstitutionDepartmentsListView(APIView):
    def get(self, request, institution_id):
        departments = Departments.objects.filter(institution_id=institution_id)
        serializer = DepartmentsSerializer(departments, many=True)
        return Response(serializer.data)


class ProgrammesListView(APIView):

    def get(self, request):
        programmes = Programmes.objects.all()
        serializer = ProgrammesSerializer(programmes, many=True)
        return Response(serializer.data)


class ProgrammesDetailView(APIView):

    def get(self, request, pk):
        programme = self.get_object(pk)
        serializer = ProgrammesSerializer(programme)
        return Response(serializer.data)

    def get_object(self, pk):
        try:
            return Programmes.objects.get(pk=pk)
        except Programmes.DoesNotExist:
            raise NotFound("Programme not found.")


class DepartmentProgrammesListView(APIView):
    def get(self, request, department_id):
        programmes = Programmes.objects.filter(department_id=department_id)
        serializer = ProgrammesSerializer(programmes, many=True)
        return Response(serializer.data)
