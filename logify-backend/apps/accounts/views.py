from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore

from .models import SupervisorApplication, User
from .permissions import IsInternshipAdmin
from .serializers import (
    AdminSignupSerializer,
    SupervisorApplicationSerializer,
    SupervisorSignupSerializer,
    UserDetailSerializer,
)


class AdminSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Internship admin account created successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SupervisorSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

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

            return Response({"message": "Supervisor approved and account activated."})

        elif action == "reject":
            application.status = "rejected"
            application.save()
            return Response({"message": "Supervisor application rejected."})

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class SupervisorApplicationListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInternshipAdmin]
    serializer_class = SupervisorApplicationSerializer

    def get_queryset(self):
        queryset = SupervisorApplication.objects.select_related(
            "user", "user__staffprofiles", "user__staffprofiles__department"
        ).order_by("-created_at")

        status_filter = self.request.query_params.get("status")  # type: ignore
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


class MeView(APIView):
    permission_classes = [IsAuthenticated]

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


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound("User not found.")

    def delete(self, request, pk):
        if request.user.role != User.INTERNSHIP_ADMIN and not request.user.is_superuser:
            return Response(
                {"error": "Only internship administrators can delete users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
