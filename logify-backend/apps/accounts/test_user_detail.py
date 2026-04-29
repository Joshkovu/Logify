from apps.academics.models import Colleges, Departments, Institutions, Programmes
from apps.organizations.models import Organizations
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date

from .models import StaffProfiles, User


def make_user(email, role, **kwargs):
    return User.objects.create_user(
        email=email,
        password="password",
        first_name="Test",
        last_name="User",
        role=role,
        **kwargs,
    )


class TestUserDetailView(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(name="Institution A", email_domain="@a.test")
        self.college_a = Colleges.objects.create(institution=self.institution, name="College A")
        self.college_b = Colleges.objects.create(institution=self.institution, name="College B")
        self.department_a = Departments.objects.create(college=self.college_a, name="Dept A")
        self.department_b = Departments.objects.create(college=self.college_b, name="Dept B")
        self.programme_a = Programmes.objects.create(
            department=self.department_a,
            name="Programme A",
            level="BSc",
            duration_years=4,
        )
        self.programme_b = Programmes.objects.create(
            department=self.department_b,
            name="Programme B",
            level="BSc",
            duration_years=4,
        )

        self.academic_supervisor = make_user(
            "as@test.com", User.ACADEMIC_SUPERVISOR, institution_id=str(self.institution.id)
        )
        StaffProfiles.objects.create(
            user=self.academic_supervisor,
            staff_number="AS-001",
            department=self.department_b,
            title="Lecturer",
        )

        self.student = make_user(
            "student@test.com",
            User.STUDENT,
            institution_id=str(self.institution.id),
            programme_id=str(self.programme_a.id),
        )
        self.same_scope_student = make_user(
            "same.scope@student.com",
            User.STUDENT,
            institution_id=str(self.institution.id),
            programme_id=str(self.programme_a.id),
        )
        self.admin = make_user(
            "admin@test.com", User.INTERNSHIP_ADMIN, institution_id=str(self.institution.id)
        )
        StaffProfiles.objects.create(
            user=self.admin,
            staff_number="ADM-001",
            department=self.department_a,
            title="College Admin",
        )

    def test_non_admin_cannot_view_other_user_by_pk(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_academic_supervisor_can_view_assigned_student(self):
        organization = Organizations.objects.create(
            name="Org A",
            email="org@example.com",
            address="123 Main St",
        )
        InternshipPlacements.objects.create(
            intern=self.student,
            academic_supervisor=self.academic_supervisor,
            institution=self.institution,
            programme=self.programme_a,
            organization=organization,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 6, 1),
            work_mode="Remote",
            internship_title="Test Internship",
            department_at_company="Engineering",
        )

        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.student.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "student@test.com")

    def test_admin_can_view_user_in_same_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.same_scope_student.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "same.scope@student.com")

    def test_admin_cannot_view_user_in_other_college(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_user_by_pk(self):
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_fetch_nonexistent_user_returns_404(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("user-detail", kwargs={"pk": 99999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_delete_user_by_pk(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(
            reverse("user-detail", kwargs={"pk": self.same_scope_student.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.same_scope_student.pk).exists())

    def test_admin_cannot_delete_user_in_other_college(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_delete_user_by_pk(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.delete(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
