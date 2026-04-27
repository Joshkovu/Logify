from django.urls import path

from .views import (
    SupervisorApplicationListView,
    SupervisorApprovalView,
    SupervisorListView,
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
    path("supervisors/", SupervisorListView.as_view(), name="supervisors-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
]
