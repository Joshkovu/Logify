from django.urls import path

from .views import SupervisorApprovalView

urlpatterns = [
    path(
        "supervisor/approve/<int:application_id>/",
        SupervisorApprovalView.as_view(),
        name="supervisor-approve",
    ),
]
