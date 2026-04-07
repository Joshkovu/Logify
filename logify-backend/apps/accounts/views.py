from apps.notifications.services import MailjetService
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore

from .models import SupervisorApplication, User
from .permissions import IsInternshipAdmin
from .serializers import StudentSignupSerializer, SupervisorSignupSerializer, UserDetailSerializer


class SupervisorSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SupervisorSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send notification
            mail_service = MailjetService()
            mail_service.send_supervisor_signup_notification(user.email)  # type: ignore

            return Response(
                {"message": "Application received. Your account is inactive until approved."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorApprovalView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def post(self, request, application_id):
        application = get_object_or_404(SupervisorApplication, id=application_id)
        action = request.data.get("action")

        if action == "approve":
            application.status = "approved"
            application.save()

            user = application.user
            user.is_active = True
            user.save()

            # Send notification
            mail_service = MailjetService()
            mail_service.send_supervisor_approval_notification(user.email)

            return Response({"message": "Supervisor approved and account activated."})

        elif action == "reject":
            application.status = "rejected"
            application.save()
            return Response({"message": "Supervisor application rejected."})

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class StudentSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Student account created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            # Custom logic if needed after successful login
            pass
        return response
