from apps.accounts.models import User
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializer import WeeklyLogsSerializer


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == User.STUDENT


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
