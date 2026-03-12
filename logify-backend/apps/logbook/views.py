from apps.accounts.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SupervisorReviews, WeeklyLogs
from .serializer import WeeklyLogsSerializer


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == User.STUDENT


class IsWorkplaceSupervisor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, "role", None) == User.WORKPLACE_SUPERVISOR
        )


# Create your views here.


class CreateWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = WeeklyLogsSerializer(data=request.data)
        if serializer.is_valid():
            weekly_log = serializer.save(
                placement=request.user.internship_placements.first(), status="draft"
            )
            return Response(
                {
                    "success": "Weekly log created successfully",
                    "weekly_log": WeeklyLogsSerializer(weekly_log).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"error": "Invalid data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UpdateWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def put(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id, placement__intern=request.user)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeeklyLogsSerializer(weekly_log, data=request.data, partial=True)
        if serializer.is_valid() and weekly_log.status == "draft":
            updated_weekly_log = serializer.save()
            return Response(
                {
                    "success": "Weekly log updated successfully",
                    "weekly_log": WeeklyLogsSerializer(updated_weekly_log).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class SubmitWeeklyLogsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id, placement__intern=request.user)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if weekly_log.status != "draft":
            return Response(
                {"error": "Only draft logs can be submitted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        weekly_log.status = "submitted"
        weekly_log.submitted_at = timezone.now()
        weekly_log.save()

        return Response(
            {
                "success": "Weekly log submitted successfully",
                "weekly_log": WeeklyLogsSerializer(weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )


class ApproveWeeklyLogsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsWorkplaceSupervisor]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if weekly_log.status != "submitted":
            return Response(
                {"error": "Only submitted logs can be approved"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        weekly_log.status = "approved"
        weekly_log.save()

        comment = request.data.get("comment", "Good work!")
        SupervisorReviews.objects.create(
            weekly_log=weekly_log, supervisor=request.user, decision="approved", comment=comment
        )

        return Response(
            {
                "success": "Weekly log approved successfully",
                "weekly_log": WeeklyLogsSerializer(weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )


class RejectWeeklyLogsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsWorkplaceSupervisor]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if weekly_log.status != "submitted":
            return Response(
                {"error": "Only submitted logs can be rejected"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        weekly_log.status = "rejected"
        weekly_log.save()

        comment = request.data.get("comment", "Needs improvement.")
        SupervisorReviews.objects.create(
            weekly_log=weekly_log, supervisor=request.user, decision="rejected", comment=comment
        )

        return Response(
            {
                "success": "Weekly log rejected successfully",
                "weekly_log": WeeklyLogsSerializer(weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )
