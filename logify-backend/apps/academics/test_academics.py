# from django.test import TestCase
from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import User
from apps.organizations.models import Organizations
from apps.placements.models import InternshipPlacements
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


# Create your tests here.
def make_user(email, role, **kwargs):
    return User.objects.create_user(
        email=email,
        password="password",
        first_name="Test",
        last_name="User",
        role=role,
        **kwargs,
    )


def make_placement(
    intern, institution, programme, workplace_supervisor=None, academic_supervisor=None, **kwargs
):
    organization = make_organization()
    return InternshipPlacements.objects.create(
        intern=intern,
        institution=institution,
        programme=programme,
        organization=organization,
        workplace_supervisor=workplace_supervisor,
        academic_supervisor=academic_supervisor,
        start_date="2026-01-01",
        end_date="2026-06-01",
        work_mode="on-site",
        internship_title="Test Internship",
        department_at_company="Engineering",
        **kwargs,
    )


def make_organization():
    return Organizations.objects.create(
        name="Org A",
        industry="Technology",
        city="Kampala",
        address="123 Test Street",
        contact_email="org@test.com",
        contact_phone="0000000000",
    )


class TestInstitutionsListView(APITestCase):
    def setUp(self):
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        Institutions.objects.create(name="University A", email_domain="@unia.com")
        Institutions.objects.create(name="University B", email_domain="@unib.com")

    def test_admin_can_list_institutions(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_admin_sees_empty_list(self):
        Institutions.objects.all().delete()
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.data, [])

    def test_student_cannot_list_institutions(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_cannot_list_institutions(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_cannot_list_institutions(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_institutions(self):
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestInstitutionsDetailView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.other_institution = Institutions.objects.create(
            name="University B", email_domain="@unib.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.programme = Programmes.objects.create(
            department=self.department, name="Programme A", level="Level A", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.placement = make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=self.academic_supervisor,
        )

    def test_admin_can_view_any_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "University A")

    def test_student_can_view_own_institution(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_view_other_institution(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("institutions-detail", args=[self.other_institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_can_view_assigned_institution(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workplace_supervisor_cannot_view_unassigned_institution(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("institutions-detail", args=[self.other_institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_can_view_assigned_institution(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_cannot_view_unassigned_institution(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("institutions-detail", args=[self.other_institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_404_for_nonexistent(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("institutions-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_cannot_view_institution(self):
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestDepartmentsListView(APITestCase):
    def setUp(self):
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        Departments.objects.create(institution=self.institution, name="Department A")
        Departments.objects.create(institution=self.institution, name="Department B")
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)

    def test_admin_can_list_departments(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_admin_sees_empty_list(self):
        Departments.objects.all().delete()
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.data, [])

    def test_student_cannot_list_departments(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_cannot_list_departments(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_cannot_list_departments(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_departments(self):
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestDepartmentsDetailView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.other_institution = Institutions.objects.create(
            name="University B", email_domain="@unib.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.other_department = Departments.objects.create(
            institution=self.other_institution, name="Department B"
        )
        self.programme = Programmes.objects.create(
            department=self.department, name="Programme A", level="Level A", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.placement = make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=self.academic_supervisor,
        )

    def test_admin_can_view_any_department(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_can_view_own_department(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_can_view_assigned_department(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_cannot_view_unassigned_department(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("departments-detail", args=[self.other_department.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_view_other_department(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("departments-detail", args=[self.other_department.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_can_view_assigned_department(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workplace_supervisor_cannot_view_unassigned_department(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("departments-detail", args=[self.other_department.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_404_for_nonexistent(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("departments-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_cannot_view_department(self):
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestInstitutionDepartmentsListView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.other_institution = Institutions.objects.create(
            name="University B", email_domain="@unib.com"
        )
        self.department_a = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.department_b = Departments.objects.create(
            institution=self.institution, name="Department B"
        )
        Departments.objects.create(institution=self.other_institution, name="Department C")
        self.programme = Programmes.objects.create(
            department=self.department_a, name="Programme A", level="Level A", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        self.placement = make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
        )

    def test_admin_can_list_institution_departments(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_student_can_list_own_institution_departments(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_list_other_institution_departments(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.other_institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_can_list_assigned_institution_departments(self):
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            workplace_supervisor=self.workplace_supervisor,
        )
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workplace_supervisor_cannot_list_unassigned_institution_departments(self):
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.other_institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_can_list_assigned_institution_departments(self):
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            academic_supervisor=self.academic_supervisor,
        )
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_cannot_list_unassigned_institution_departments(self):
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(
            reverse("institution-departments-list", args=[self.other_institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_institution_departments(self):
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institution.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestProgrammesListView(APITestCase):
    def setUp(self):
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        Programmes.objects.create(
            department=self.department, name="Programme A", level="Level A", duration_years=3
        )
        Programmes.objects.create(
            department=self.department, name="Programme B", level="Level B", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)

    def test_admin_can_list_programmes(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_admin_sees_empty_list(self):
        Programmes.objects.all().delete()
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.data, [])

    def test_student_cannot_list_programmes(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_cannot_list_programmes(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_cannot_list_programmes(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_programmes(self):
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestProgrammesDetailView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.programme = Programmes.objects.create(
            department=self.department, name="Programme A", level="Level A", duration_years=3
        )
        self.other_programme = Programmes.objects.create(
            department=self.department, name="Programme B", level="Level B", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.workplace_supervisor = make_user("ws@test.com", User.WORKPLACE_SUPERVISOR)
        self.placement = make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            academic_supervisor=self.academic_supervisor,
            workplace_supervisor=self.workplace_supervisor,
        )

    def test_admin_can_view_any_programme(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Programme A")

    def test_student_can_view_own_programme(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_view_other_programme(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("programmes-detail", args=[self.other_programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_can_view_assigned_programme(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_cannot_view_unassigned_programme(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("programmes-detail", args=[self.other_programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_workplace_supervisor_cannot_view_programme(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_returns_404_for_nonexistent(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("programmes-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_cannot_view_programme(self):
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestDepartmentProgrammesListView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.other_institution = Institutions.objects.create(
            name="University B", email_domain="@unib.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.other_department = Departments.objects.create(
            institution=self.other_institution, name="Department B"
        )
        self.programme_a = Programmes.objects.create(
            department=self.department, name="Programme A", level="Level A", duration_years=3
        )
        Programmes.objects.create(
            department=self.department, name="Programme B", level="Level B", duration_years=3
        )
        Programmes.objects.create(
            department=self.other_department, name="Programme C", level="Level C", duration_years=3
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN)
        self.student = make_user("student@test.com", User.STUDENT)
        self.placement = make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme_a,
        )

    def test_admin_can_list_department_programmes(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse("department-programmes-list", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_student_can_list_own_department_programmes(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("department-programmes-list", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_list_other_department_programmes(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("department-programmes-list", args=[self.other_department.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_can_list_assigned_department_programmes(self):
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        make_placement(
            intern=self.student,
            institution=self.institution,
            programme=self.programme_a,
            academic_supervisor=self.academic_supervisor,
        )
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(reverse("department-programmes-list", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_academic_supervisor_cannot_list_unassigned_department_programmes(self):
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(
            reverse("department-programmes-list", args=[self.other_department.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_department_programmes(self):
        response = self.client.get(reverse("department-programmes-list", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
