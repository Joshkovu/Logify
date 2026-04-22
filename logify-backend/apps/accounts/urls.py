from django.urls import path

from .views import (
    AcademicSupervisorListView,
    SupervisorApplicationListView,
    SupervisorApprovalView,
    UserDetailView,
)

urlpatterns = [
    path(
        "supervisor/applications/",
        SupervisorApplicationListView.as_view(),
        name="supervisor-applications",
    ),
    path(
        "supervisor/approve/<int:application_id>/",
        SupervisorApprovalView.as_view(),
        name="supervisor-approve",
    ),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path(
        "academic-supervisors/",
        AcademicSupervisorListView.as_view(),
        name="academic-supervisors",
    ),
]
