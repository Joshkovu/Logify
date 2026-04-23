from apps.accounts.models import User
from apps.accounts.permissions import IsInternshipAdmin
from apps.accounts.serializers import UserDetailSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class StudentRegistryViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role=User.STUDENT)
    serializer_class = UserDetailSerializer

    def get_patch_permissions(self):
        if self.action in ["retrieve", "partial_update"]:
            return [IsAuthenticated()]
        return [IsInternshipAdmin()]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role == User.STUDENT:
            if str(obj.id) != str(self.request.user.id):
                raise PermissionDenied("You can only access your own record.")
        return obj


class StudentAuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def signup(self, request):
        webmail = request.data.get("webmail", "").strip().lower()
        institution_id = request.data.get("institution_id")
        student_number = request.data.get("student_number")
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()
        programme_id = request.data.get("programme_id") or None
        year_of_study = request.data.get("year_of_study")
        intake_year = request.data.get("intake_year")
        password = request.data.get("password", "")

        if year_of_study in [None, ""]:
            year_of_study = None
        else:
            try:
                year_of_study = int(year_of_study)
            except (TypeError, ValueError):
                return Response(
                    {"error": "Year of study must be a number."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if intake_year in [None, ""]:
            intake_year = None
        else:
            try:
                intake_year = int(intake_year)
            except (TypeError, ValueError):
                return Response(
                    {"error": "Intake year must be a number."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if not webmail or not institution_id or not student_number:
            return Response(
                {"error": "Institution, student number, and webmail are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not first_name or not last_name:
            return Response(
                {"error": "First name and last name are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not password:
            return Response(
                {"error": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User = get_user_model()

        try:
            with transaction.atomic():
                if User.objects.filter(email=webmail).exists():
                    return Response(
                        {"error": "An account with this webmail already exists."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = User.objects.create_user(
                    email=webmail,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    role=User.STUDENT,
                    institution_id=str(institution_id),
                    programme_id=str(programme_id) if programme_id else None,
                    student_number=student_number,
                    year_of_study=year_of_study,
                    intake_year=intake_year,
                    is_active=True,
                )
        except Exception:
            return Response(
                {"error": "An error occurred during signup."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Signup successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class ImportStudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsInternshipAdmin]

    def create(self, request):
        # Logic for importing students from a file directly as Users
        return Response()


class ExportStudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsInternshipAdmin]

    def list(self, request):
        # Logic for exporting students to a file
        return Response()
