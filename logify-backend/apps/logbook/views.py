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
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if weekly_log.status != "draft":
            return Response(
                {"error": "Only draft logs can be updated"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        updated_weekly_log = serializer.save()
        return Response(
            {
                "success": "Weekly log updated successfully",
                "weekly_log": WeeklyLogsSerializer(updated_weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )


class SubmitWeeklyLogAPIView(APIView):
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


class ApproveWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsWorkplaceSupervisor]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(
                placement__workplace_supervisor=request.user, id=log_id
            )
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


class RejectWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsWorkplaceSupervisor]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(
                placement__workplace_supervisor=request.user, id=log_id
            )
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


class RequestChangesWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsWorkplaceSupervisor]

    def post(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(
                placement__workplace_supervisor=request.user, id=log_id
            )
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if weekly_log.status != "submitted":
            return Response(
                {"error": "Only submitted logs can be marked for changes"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        weekly_log.status = "changes_requested"
        weekly_log.save()

        comment = request.data.get("comment", "Please make the necessary changes.")
        SupervisorReviews.objects.create(
            weekly_log=weekly_log,
            supervisor=request.user,
            decision="changes_requested",
            comment=comment,
        )

        return Response(
            {
                "success": "Changes requested for the weekly log successfully",
                "weekly_log": WeeklyLogsSerializer(weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )


class GetWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == User.STUDENT and weekly_log.placement.intern != request.user:
            return Response(
                {"error": "You do not have permission to view this log"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            request.user.role == User.WORKPLACE_SUPERVISOR
            and weekly_log.placement.workplace_supervisor != request.user
        ):
            return Response(
                {"error": "You do not have permission to view this log"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            request.user.role == User.ACADEMIC_SUPERVISOR
            and weekly_log.placement.academic_supervisor != request.user
        ):
            return Response(
                {"error": "You do not have permission to view this log"},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "success": "Weekly log retrieved successfully",
                "weekly_log": WeeklyLogsSerializer(weekly_log).data,
            },
            status=status.HTTP_200_OK,
        )


class GetWeeklyLogsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == User.STUDENT:
            weekly_logs = WeeklyLogs.objects.filter(placement__intern=request.user)
        elif request.user.role == User.WORKPLACE_SUPERVISOR:
            weekly_logs = WeeklyLogs.objects.filter(placement__workplace_supervisor=request.user)
        elif request.user.role == User.ACADEMIC_SUPERVISOR:
            weekly_logs = WeeklyLogs.objects.filter(placement__academic_supervisor=request.user)
        else:
            return Response(
                {"error": "You do not have permission to view these logs"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = WeeklyLogsSerializer(weekly_logs, many=True)
        return Response(
            {"success": "Weekly logs retrieved successfully", "weekly_logs": serializer.data},
            status=status.HTTP_200_OK,
        )


class DeleteWeeklyLogAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def delete(self, request, log_id):
        try:
            weekly_log = WeeklyLogs.objects.get(id=log_id, placement__intern=request.user)
        except WeeklyLogs.DoesNotExist:
            return Response({"error": "Weekly log not found"}, status=status.HTTP_404_NOT_FOUND)

        if weekly_log.status != "draft":
            return Response(
                {"error": "Only draft logs can be deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        weekly_log.delete()
        return Response({"success": "Weekly log deleted successfully"}, status=status.HTTP_200_OK)
