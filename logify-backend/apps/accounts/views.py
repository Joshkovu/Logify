from apps.notifications.services import MailjetService
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SupervisorApplication, User
from .serializers import SupervisorSignupSerializer


class IsInternshipAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.INTERNSHIP_ADMIN


class SupervisorSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SupervisorSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send notification
            mail_service = MailjetService()
            mail_service.send_supervisor_signup_notification(user.email)

            return Response(
                {"message": "Application received. Your account is inactive until approved."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorApprovalView(APIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]

    def post(self, request, application_id):
        application = get_object_or_404(SupervisorApplication, id=application_id)
        action = request.data.get("action")  # 'approve' or 'reject'

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
