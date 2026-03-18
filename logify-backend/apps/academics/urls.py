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
    path("academics/institutions/", InstitutionsListView.as_view(), name="institutions-list"),
    path(
        "academics/institutions/<int:pk>/",
        InstitutionsDetailView.as_view(),
        name="institutions-detail",
    ),
    path("academics/departments/", DepartmentsListView.as_view(), name="departments-list"),
    path(
        "academics/departments/<int:pk>/",
        DepartmentsDetailView.as_view(),
        name="departments-detail",
    ),
    path(
        "academics/institutions/<int:institution_id>/departments/",
        InstitutionDepartmentsListView.as_view(),
        name="institution-departments-list",
    ),
    path("academics/programmes/", ProgrammesListView.as_view(), name="programmes-list"),
    path(
        "academics/programmes/<int:pk>/", ProgrammesDetailView.as_view(), name="programmes-detail"
    ),
    path(
        "academics/departments/<int:department_id>/programmes/",
        DepartmentProgrammesListView.as_view(),
        name="department-programmes-list",
    ),
]
