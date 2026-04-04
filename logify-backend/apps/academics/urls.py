from django.urls import path

from .views import (
    DepartmentProgrammesListView,
    DepartmentsDetailView,
    DepartmentsListView,
    InstitutionDepartmentsListView,
    InstitutionsDetailView,
    InstitutionsListView,
    ProgrammesDetailView,
    ProgrammesListView,
)

urlpatterns = [
    path("institutions/", InstitutionsListView.as_view(), name="institutions-list"),
    path(
        "institutions/<int:pk>/",
        InstitutionsDetailView.as_view(),
        name="institutions-detail",
    ),
    path("departments/", DepartmentsListView.as_view(), name="departments-list"),
    path(
        "departments/<int:pk>/",
        DepartmentsDetailView.as_view(),
        name="departments-detail",
    ),
    path(
        "institutions/<int:institution_id>/departments/",
        InstitutionDepartmentsListView.as_view(),
        name="institution-departments-list",
    ),
    path("programmes/", ProgrammesListView.as_view(), name="programmes-list"),
    path("programmes/<int:pk>/", ProgrammesDetailView.as_view(), name="programmes-detail"),
    path(
        "departments/<int:department_id>/programmes/",
        DepartmentProgrammesListView.as_view(),
        name="department-programmes-list",
    ),
]
