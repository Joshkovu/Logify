from apps.registry.views import StudentAuthViewSet
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView  # type: ignore

from .views import (
    AdminSignupView,
    ChangePasswordView,
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    SupervisorSignupView,
)

urlpatterns = [
    path(
        "student/signup/",
        StudentAuthViewSet.as_view({"post": "signup"}),
        name="student-signup",
    ),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("admin/signup/", AdminSignupView.as_view(), name="admin-signup"),
    path("supervisor/signup/", SupervisorSignupView.as_view(), name="supervisor-signup"),
]
