from django.urls import path
from .views import SupervisorSignupView, SupervisorApprovalView

urlpatterns = [
    path("supervisor/signup/", SupervisorSignupView.as_view(), name="supervisor-signup"),
    path(
        "supervisor/approve/<int:application_id>/",
        SupervisorApprovalView.as_view(),
        name="supervisor-approve",
    ),
]
