from django.urls import path

from . import views

urlpatterns = [
    path("institutions/", views.InstitutionsListAPIView.as_view(), name="institutions"),
    path("institutions/<int:id>/", views.InstitutionsDetailAPIView.as_view(), name="institution_detail"),
    path("institutions/<int:id>/departments/", views.InstitutionDepartmentsListAPIView.as_view(), name="institution_departments"),
    path("departments/", views.DepartmentsListAPIView.as_view(), name="departments"),
    path("departments/<int:id>/", views.DepartmentsDetailAPIView.as_view(), name="department_detail"),
    path("departments/<int:id>/programmes/", views.DepartmentProgrammesListAPIView.as_view(), name="department_programmes"),
    path("programmes/", views.ProgrammesListAPIView.as_view(), name="programmes"),
    path("programmes/<int:id>/", views.ProgrammesDetailAPIView.as_view(), name="programme_detail"),
]
