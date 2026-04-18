# from django.shortcuts import render

# Create your views here.
import hashlib
from datetime import timedelta

import pyotp
from apps.accounts.models import User
from apps.accounts.permissions import IsInternshipAdmin
from apps.registry.models import StudentRegistry
from apps.registry.serializer import StudentRegistrySerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
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

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def signup(self, request):
        webmail = request.data.get("webmail", "").strip().lower()
        institution_id = request.data.get("institution_id")
        student_number = request.data.get("student_number")
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()
        password = request.data.get("password", "")

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

        # Send OTP
        mail_service = MailjetService()
        mail_service.send_otp(webmail, otp)

        return Response({"message": "OTP sent to your webmail.", "attempt_id": attempt.id})

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def verify_otp(self, request):
        attempt_id = request.data.get("attempt_id")
        otp = request.data.get("otp", "").strip()

        if not attempt_id or not otp:
            return Response(
                {"error": "Attempt ID and OTP are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attempt = get_object_or_404(RegistrationAttempts, id=attempt_id)

        if attempt.expires_at < timezone.now():
            attempt.status = "expired"
            attempt.save()
            return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

        otp_hash = hashlib.sha256(otp.encode()).hexdigest()
        if attempt.otp_hash != otp_hash:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        student = StudentRegistry.objects.get(
            webmail=attempt.webmail,
            institution=attempt.institution,
            student_number=attempt.student_number,
        )

        User = get_user_model()
        try:
            with transaction.atomic():
                # Lock registry row to prevent concurrent claims.
                student = (
                    StudentRegistry.objects.select_for_update()
                    .filter(
                        webmail=webmail,
                        institution_id=institution_id,
                        student_number=student_number,
                        status="active",
                    )
                    .first()
                )

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

                if User.objects.filter(email=webmail).exists():
                    return Response(
                        {"error": "An account with this webmail already exists."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = User.objects.create_user(
                    email=student.webmail,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    role=User.STUDENT,
                    institution_id=str(student.institution.id),
                    programme_id=str(student.programme.id),
                    student_registry_id=str(student.id),
                    student_number=student.student_number,
                    is_active=True,
                )

                student.is_claimed = True
                student.claimed_at = timezone.now()
                student.save(update_fields=["is_claimed", "claimed_at"])
        except IntegrityError:
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
            programme_id=str(student.programme.id) if student.programme else None,
            student_registry_id=str(student.id),
            student_number=student.student_number,
            is_active=True,
        )
        user.password = attempt.password_hash
        user.save()

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
