from apps.registry.views import RegistrationAttemptsViewSet
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView  # type: ignore

from .views import CustomTokenObtainPairView, LogoutView, MeView, SupervisorSignupView

urlpatterns = [
    path(
        "student/request-otp/",
        RegistrationAttemptsViewSet.as_view({"post": "request_otp"}),
        name="student-request-otp",
    ),
    path(
        "student/verify-otp/",
        RegistrationAttemptsViewSet.as_view({"post": "verify_otp"}),
        name="student-verify-otp",
    ),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("supervisor/signup/", SupervisorSignupView.as_view(), name="supervisor-signup"),
]
