import hashlib
from datetime import timedelta

import pytest  # type: ignore
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import SupervisorApplication
from apps.registry.models import RegistrationAttempts, StudentRegistry

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def setup_data(db):
    institution = Institutions.objects.create(name="Test University")
    department = Departments.objects.create(institution=institution, name="Engineering")
    programme = Programmes.objects.create(
        name="Computer Science", department=department, level="BSc", duration_years=4
    )
    student_registry = StudentRegistry.objects.create(
        institution=institution,
        programme=programme,
        student_number=2024001,
        webmail="test.student@univ.ac.ug",
        year_of_study=3,
        intake_year=2024,
        status="active",
    )
    return {
        "institution": institution,
        "programme": programme,
        "student_registry": student_registry,
    }


@pytest.mark.django_db
class TestStudentAuth:
    def test_request_otp(self, api_client, setup_data):
        response = api_client.post(
            "/api/v1/auth/student/request-otp/",
            {
                "webmail": "test.student@univ.ac.ug",
                "institution_id": setup_data["institution"].id,
                "student_number": 2024001,
            },
        )

        assert response.status_code == status.HTTP_200_OK
        assert "attempt_id" in response.data
        assert RegistrationAttempts.objects.count() == 1

    def test_verify_otp_and_issue_token(self, api_client, setup_data):
        otp = "123456"
        attempt = RegistrationAttempts.objects.create(
            institution=setup_data["institution"],
            webmail="test.student@univ.ac.ug",
            student_number=2024001,
            status="pending",
            otp_hash=hashlib.sha256(otp.encode()).hexdigest(),
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        response = api_client.post(
            "/api/v1/auth/student/verify-otp/",
            {"attempt_id": attempt.id, "otp": otp},
        )

        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == "test.student@univ.ac.ug"

        user = User.objects.get(email="test.student@univ.ac.ug")
        assert user.role == User.STUDENT


@pytest.mark.django_db
class TestSupervisorAuth:
    def test_supervisor_signup_and_approval(self, api_client):
        response = api_client.post(
            "/api/v1/auth/supervisor/signup/",
            {
                "email": "supervisor@test.com",
                "password": "securepassword123",
                "first_name": "John",
                "last_name": "Doe",
                "role": User.ACADEMIC_SUPERVISOR,
                "phone": "0700000000",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED

        user = User.objects.get(email="supervisor@test.com")
        assert not user.is_active
        assert SupervisorApplication.objects.filter(user=user, status="pending").exists()

        response = api_client.post(
            "/api/v1/auth/login/",
            {"email": "supervisor@test.com", "password": "securepassword123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        admin = User.objects.create_superuser(
            email="admin@test.com",
            password="adminpassword",
        )
        api_client.force_authenticate(user=admin)
        app = SupervisorApplication.objects.get(user=user)

        response = api_client.post(
            f"/api/v1/accounts/supervisor/approve/{app.id}/",
            {"action": "approve"},
        )
        assert response.status_code == status.HTTP_200_OK

        user.refresh_from_db()
        assert user.is_active

        api_client.force_authenticate(user=None)
        response = api_client.post(
            "/api/v1/auth/login/",
            {"email": "supervisor@test.com", "password": "securepassword123"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data


@pytest.mark.django_db
class TestAuthMe:
    def test_get_me(self, api_client):
        user = User.objects.create_user(
            email="me@test.com",
            first_name="Me",
            last_name="Too",
            role=User.INTERNSHIP_ADMIN,
        )
        api_client.force_authenticate(user=user)

        response = api_client.get("/api/v1/auth/me/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == "me@test.com"
        assert response.data["role"] == User.INTERNSHIP_ADMIN
