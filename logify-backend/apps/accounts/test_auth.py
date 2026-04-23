import pytest  # type: ignore
from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import StaffProfiles, SupervisorApplication
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

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
    return {
        "institution": institution,
        "programme": programme,
    }


@pytest.mark.django_db
class TestStudentAuth:
    def test_student_signup_creates_user_and_issues_tokens(self, api_client, setup_data):
        response = api_client.post(
            "/api/v1/auth/student/signup/",
            {
                "webmail": "test.student@univ.ac.ug",
                "institution_id": setup_data["institution"].id,
                "student_number": 2024001,
                "first_name": "First",
                "last_name": "Name",
                "password": "securepassword123",
            },
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == "test.student@univ.ac.ug"
        assert response.data["user"]["first_name"] == "First"
        assert response.data["user"]["last_name"] == "Name"

        user = User.objects.get(email="test.student@univ.ac.ug")
        assert user.role == User.STUDENT  # type: ignore
        assert user.first_name == "First"
        assert user.last_name == "Name"
        assert user.student_number == 2024001

    def test_student_can_login_after_signup(self, api_client, setup_data):
        signup_response = api_client.post(
            "/api/v1/auth/student/signup/",
            {
                "webmail": "test.student@univ.ac.ug",
                "institution_id": setup_data["institution"].id,
                "student_number": 2024001,
                "first_name": "First",
                "last_name": "Name",
                "password": "securepassword123",
            },
        )
        assert signup_response.status_code == status.HTTP_201_CREATED

        login_response = api_client.post(
            "/api/v1/auth/login/",
            {
                "email": "test.student@univ.ac.ug",
                "password": "securepassword123",
            },
        )
        assert login_response.status_code == status.HTTP_200_OK
        assert "access" in login_response.data
        assert "refresh" in login_response.data

    def test_student_signup_saves_programme_and_year_of_study(self, api_client, setup_data):
        response = api_client.post(
            "/api/v1/auth/student/signup/",
            {
                "webmail": "update.programme@univ.ac.ug",
                "institution_id": setup_data["institution"].id,
                "student_number": 2024002,
                "first_name": "Update",
                "last_name": "Programme",
                "programme_id": setup_data["programme"].id,
                "year_of_study": 1,
                "password": "securepassword123",
            },
        )

        assert response.status_code == status.HTTP_201_CREATED
        user = User.objects.get(email="update.programme@univ.ac.ug")

        assert user.programme_id == str(setup_data["programme"].id)
        assert user.year_of_study == 1


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
                "role": User.ACADEMIC_SUPERVISOR,  # type: ignore
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

        admin = User.objects.create_user(
            email="admin@test.com",
            password="adminpassword",
            role=User.INTERNSHIP_ADMIN,  # type: ignore
            first_name="Internship",
            last_name="Admin",
        )
        api_client.force_authenticate(user=admin)
        app = SupervisorApplication.objects.get(user=user)

        response = api_client.post(
            f"/api/v1/accounts/supervisor/approve/{app.id}/",  # pyright: ignore[reportAttributeAccessIssue]
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

    def test_admin_can_list_supervisor_applications(self, api_client):
        pending_user = User.objects.create_user(
            email="pending.supervisor@test.com",
            password="securepassword123",
            role=User.WORKPLACE_SUPERVISOR,  # type: ignore
            first_name="Pending",
            last_name="Supervisor",
            is_active=False,
        )
        SupervisorApplication.objects.create(user=pending_user, status="pending")

        approved_user = User.objects.create_user(
            email="approved.supervisor@test.com",
            password="securepassword123",
            role=User.ACADEMIC_SUPERVISOR,  # type: ignore
            first_name="Approved",
            last_name="Supervisor",
            is_active=True,
        )
        SupervisorApplication.objects.create(user=approved_user, status="approved")

        admin = User.objects.create_user(
            email="admin.list@test.com",
            password="adminpassword",
            role=User.INTERNSHIP_ADMIN,  # type: ignore
            first_name="Internship",
            last_name="Admin",
        )
        api_client.force_authenticate(user=admin)

        response = api_client.get("/api/v1/accounts/supervisor/applications/")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        assert response.data[0]["email"] == "approved.supervisor@test.com"
        assert response.data[1]["email"] == "pending.supervisor@test.com"

        pending_response = api_client.get(
            "/api/v1/accounts/supervisor/applications/?status=pending"
        )

        assert pending_response.status_code == status.HTTP_200_OK
        assert len(pending_response.data) == 1
        assert pending_response.data[0]["status"] == "pending"


@pytest.mark.django_db
class TestAdminAuth:
    def test_admin_signup_and_login(self, api_client):
        signup_response = api_client.post(
            "/api/v1/auth/admin/signup/",
            {
                "email": "admin.signup@test.com",
                "password": "securepassword123",
                "first_name": "Internship",
                "last_name": "Admin",
                "phone": "0700000000",
            },
        )

        assert signup_response.status_code == status.HTTP_201_CREATED

        user = User.objects.get(email="admin.signup@test.com")
        assert user.role == User.INTERNSHIP_ADMIN  # type: ignore
        assert user.is_active
        assert user.is_staff

        login_response = api_client.post(
            "/api/v1/auth/login/",
            {"email": "admin.signup@test.com", "password": "securepassword123"},
        )

        assert login_response.status_code == status.HTTP_200_OK
        assert "access" in login_response.data
        assert "refresh" in login_response.data


@pytest.mark.django_db
class TestAuthMe:
    def test_get_me(self, api_client):
        user = User.objects.create_user(
            email="me@test.com",
            first_name="Me",
            last_name="Too",
            role=User.INTERNSHIP_ADMIN,  # type: ignore
        )
        api_client.force_authenticate(user=user)

        response = api_client.get("/api/v1/auth/me/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == "me@test.com"
        assert response.data["role"] == User.INTERNSHIP_ADMIN  # type: ignore

    def test_patch_me_updates_user_profile(self, api_client):
        user = User.objects.create_user(
            email="profile@test.com",
            first_name="Old",
            last_name="Name",
            phone="0700000000",
            role=User.ACADEMIC_SUPERVISOR,  # type: ignore
            password="securepassword123",
        )
        department = Departments.objects.create(
            institution=Institutions.objects.create(name="Makerere"),
            name="Computer Science",
        )
        StaffProfiles.objects.create(
            user=user,
            staff_number="AS-1",
            department=department,
            title="Lecturer",
        )
        api_client.force_authenticate(user=user)

        response = api_client.patch(
            "/api/v1/auth/me/",
            {
                "first_name": "Updated",
                "last_name": "Supervisor",
                "phone": "0700111222",
                "title": "Senior Lecturer",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.first_name == "Updated"
        assert user.last_name == "Supervisor"
        assert user.phone == "0700111222"
        assert user.staffprofiles.title == "Senior Lecturer"

    def test_change_password_requires_current_password_and_updates_login(self, api_client):
        user = User.objects.create_user(
            email="password@test.com",
            first_name="Password",
            last_name="Owner",
            role=User.STUDENT,  # type: ignore
            password="oldpassword123",
        )
        api_client.force_authenticate(user=user)

        response = api_client.post(
            "/api/v1/auth/change-password/",
            {
                "current_password": "oldpassword123",
                "new_password": "newpassword123",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

        api_client.force_authenticate(user=None)
        failed_login = api_client.post(
            "/api/v1/auth/login/",
            {"email": "password@test.com", "password": "oldpassword123"},
        )
        assert failed_login.status_code == status.HTTP_401_UNAUTHORIZED

        login_response = api_client.post(
            "/api/v1/auth/login/",
            {"email": "password@test.com", "password": "newpassword123"},
        )
        assert login_response.status_code == status.HTTP_200_OK
