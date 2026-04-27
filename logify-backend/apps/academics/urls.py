from django.urls import path

from .views import (
    CollegeDepartmentsListView,
    CollegesDetailView,
    CollegesListView,
    DepartmentProgrammesListView,
    DepartmentsDetailView,
    DepartmentsListView,
    InstitutionCollegesListView,
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
    path("colleges/", CollegesListView.as_view(), name="colleges-list"),
    path("colleges/<int:pk>/", CollegesDetailView.as_view(), name="colleges-detail"),
    path(
        "institutions/<int:institution_id>/colleges/",
        InstitutionCollegesListView.as_view(),
        name="institution-colleges-list",
    ),
    path("departments/", DepartmentsListView.as_view(), name="departments-list"),
    path(
        "departments/<int:pk>/",
        DepartmentsDetailView.as_view(),
        name="departments-detail",
    ),
    path(
        "colleges/<int:college_id>/departments/",
        CollegeDepartmentsListView.as_view(),
        name="college-departments-list",
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
