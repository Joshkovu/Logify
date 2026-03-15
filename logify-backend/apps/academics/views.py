from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Departments, Institutions, Programmes
from .serializer import DepartmentsSerializer, InstitutionsSerializer, ProgrammesSerializer


class InstitutionsListAPIView(ListAPIView):
    queryset = Institutions.objects.all()
    serializer_class = InstitutionsSerializer


class InstitutionsDetailAPIView(RetrieveAPIView):
    queryset = Institutions.objects.all()
    serializer_class = InstitutionsSerializer
    lookup_field = "id"


class DepartmentsListAPIView(ListAPIView):
    queryset = Departments.objects.all()
    serializer_class = DepartmentsSerializer


class DepartmentsDetailAPIView(RetrieveAPIView):
    queryset = Departments.objects.all()
    serializer_class = DepartmentsSerializer
    lookup_field = "id"


class InstitutionDepartmentsListAPIView(ListAPIView):
    serializer_class = DepartmentsSerializer

    def get_queryset(self):
        institution_id = self.kwargs["id"]
        return Departments.objects.filter(institution_id=institution_id)


class ProgrammesListAPIView(ListAPIView):
    queryset = Programmes.objects.all()
    serializer_class = ProgrammesSerializer


class ProgrammesDetailAPIView(RetrieveAPIView):
    queryset = Programmes.objects.all()
    serializer_class = ProgrammesSerializer
    lookup_field = "id"


class DepartmentProgrammesListAPIView(ListAPIView):
    serializer_class = ProgrammesSerializer

    def get_queryset(self):
        department_id = self.kwargs["id"]
        return Programmes.objects.filter(department_id=department_id)
