# from django.shortcuts import render

# Create your views here.
from apps.accounts.models import User
from apps.accounts.permissions import IsInternshipAdmin
from apps.registry.models import StudentRegistry
from apps.registry.serializer import StudentRegistrySerializer
from django.contrib.auth import get_user_model
<<<<<<< HEAD
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
=======
from django.core.exceptions import PermissionDenied
from django.db import transaction
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class StudentRegistryViewSet(viewsets.ModelViewSet):
    queryset = StudentRegistry.objects.all()
    serializer_class = StudentRegistrySerializer

    def get_patch_permissions(self):
        if self.action in ["retrieve", "partial_update"]:
            return [IsAuthenticated()]
        return [IsInternshipAdmin()]

    def get_object(self):
        obj = super().get_object()
        if self.request.user.role == User.STUDENT:
            if str(obj.id) != self.request.user.student_registry_id:
                raise PermissionDenied("You can only access your own registry record.")
            return obj


class StudentAuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

<<<<<<< HEAD
    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return RegistrationAttempts.objects.none()
        return RegistrationAttempts.objects.filter(webmail=user.email)  # type: ignore

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def request_otp(self, request):
=======
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def signup(self, request):
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39
        webmail = request.data.get("webmail", "").strip().lower()
        institution_id = request.data.get("institution_id")
        student_number = request.data.get("student_number")
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()
<<<<<<< HEAD
        password = request.data.get("password", "")
=======
        programme_id = request.data.get("programme_id") or None
        year_of_study = request.data.get("year_of_study")
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
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39

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
        # Check if student exists in registry
        student = StudentRegistry.objects.filter(
            webmail=webmail,
            institution_id=institution_id,
            student_number=student_number,
            status__iexact="active",
        ).first()

        if not student:
            return Response(
                {"error": "Student not found or inactive in registry."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if student.first_name.strip().lower() != first_name.lower():
            return Response(
                {"error": "First name does not match registry records."},
                status=status.HTTP_400_BAD_REQUEST,
            )
<<<<<<< HEAD

        if student.last_name.strip().lower() != last_name.lower():
            return Response(
                {"error": "Last name does not match registry records."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if student.is_claimed:
            return Response(
                {"error": "This student account has already been claimed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate OTP
        totp = pyotp.TOTP(pyotp.random_base32(), interval=600)  # 10 minutes
        otp = totp.now()
        otp_hash = hashlib.sha256(otp.encode()).hexdigest()

        # Save attempt
        attempt = RegistrationAttempts.objects.create(
            institution_id=institution_id,
            webmail=webmail,
            student_number=student_number,
            first_name=first_name,
            last_name=last_name,
            password_hash=make_password(password),
            status="pending",
            otp_hash=otp_hash,
            expires_at=timezone.now() + timedelta(minutes=10),
        )
=======

        if student.last_name.strip().lower() != last_name.lower():
            return Response(
                {"error": "Last name does not match registry records."},
                status=status.HTTP_400_BAD_REQUEST,
            )
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39

        if programme_id and student.programme_id and str(student.programme_id) != str(programme_id):
            return Response(
                {"error": "Programme does not match registry records."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            year_of_study is not None
            and student.year_of_study is not None
            and student.year_of_study != year_of_study
        ):
            return Response(
                {"error": "Year of study does not match registry records."},
                status=status.HTTP_400_BAD_REQUEST,
            )

<<<<<<< HEAD
    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def verify_otp(self, request):
        attempt_id = request.data.get("attempt_id")
        otp = request.data.get("otp", "").strip()

        if not attempt_id or not otp:
            return Response(
                {"error": "Attempt ID and OTP are required."},
=======
        if student.is_claimed:
            return Response(
                {"error": "This student account has already been claimed."},
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user account
        User = get_user_model()
        try:
            with transaction.atomic():
                # Lock registry row to prevent concurrent claims
                student = (
                    StudentRegistry.objects.select_for_update()
                    .filter(
                        webmail=webmail,
                        institution_id=institution_id,
                        student_number=student_number,
                        status__iexact="active",
                    )
                    .first()
                )

                if not student:
                    return Response(
                        {"error": "Student not found or inactive in registry."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                if student.is_claimed:
                    return Response(
                        {"error": "This student account has already been claimed."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

<<<<<<< HEAD
        student = StudentRegistry.objects.get(
            webmail=attempt.webmail,
            institution=attempt.institution,
            student_number=attempt.student_number,
        )

        User = get_user_model()
        existing_user = User.objects.filter(email=student.webmail).first()
        if existing_user:
            return Response(
                {"error": "An account with this webmail already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attempt.status = "verified"
        attempt.save()

        # Mark student as claimed
        student.is_claimed = True
        student.claimed_at = timezone.now()
        student.save()

        # Create User for Student

        user = User.objects.create(
            email=student.webmail,
            first_name=attempt.first_name,
            last_name=attempt.last_name,
            role=User.STUDENT,
            institution_id=str(student.institution.id),
            programme_id=str(student.programme.id),
            student_registry_id=str(student.id),
            student_number=student.student_number,
            is_active=True,
        )
        user.password = attempt.password_hash
        user.save()
=======
                if User.objects.filter(email=webmail).exists():
                    return Response(
                        {"error": "An account with this webmail already exists."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                registry_updated = False
                if programme_id and not student.programme_id:
                    student.programme_id = programme_id
                    registry_updated = True

                if year_of_study is not None and student.year_of_study is None:
                    student.year_of_study = year_of_study
                    registry_updated = True

                if registry_updated:
                    student.save(
                        update_fields=[
                            field
                            for field in ["programme_id", "year_of_study"]
                            if getattr(student, field) is not None
                        ]
                    )

                user = User.objects.create_user(
                    email=webmail,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    role=User.STUDENT,
                    institution_id=str(student.institution.id),
                    programme_id=str(student.programme.id) if student.programme else None,
                    student_registry_id=str(student.id),
                    student_number=student.student_number,
                    is_active=True,
                )

                student.is_claimed = True
                student.claimed_at = timezone.now()
                student.save(update_fields=["is_claimed", "claimed_at"])
        except Exception:
            return Response(
                {"error": "An account with this webmail already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
>>>>>>> 0657105d0cd97afad7b89a4ad48542f58ba79b39

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
        # Logic for importing students from a file
        return Response()


class ExportStudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsInternshipAdmin]

    def list(self, request):
        # Logic for exporting students to a file
        return Response()
