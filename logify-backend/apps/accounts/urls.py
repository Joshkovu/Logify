from django.urls import path

from .views import SupervisorApplicationListView, SupervisorApprovalView

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
]
