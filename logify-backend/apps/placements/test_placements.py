from datetime import timedelta

from apps.academics.models import Departments
from apps.placements.models import (
    Institutions,
    InternshipPlacements,
    Organizations,
    PlacementStatusHistory,
    Programmes,
)
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .constants import TEST_EMAIL_DOMAIN, TEST_PASSWORD, TEST_PHONE

User = get_user_model()


class PlacementWorkflowTests(APITestCase):

    def setUp(self):
        self.intern = User.objects.create_user(
            email=f"intern@{TEST_EMAIL_DOMAIN}",
            password=f"{TEST_PASSWORD}",
            first_name="Sarah",
            last_name="Johnson",
            role=User.STUDENT,
        )

        self.academic_supervisor = User.objects.create_user(
            email=f"asupervisor@{TEST_EMAIL_DOMAIN}",
            password=f"{TEST_PASSWORD}",
            first_name="Emily",
            last_name="Roberts",
            role=User.ACADEMIC_SUPERVISOR,
        )

        self.workplace_supervisor = User.objects.create_user(
            email=f"wsupervisor@{TEST_EMAIL_DOMAIN}",
            password=f"{TEST_PASSWORD}",
            first_name="John",
            last_name="Doe",
            role=User.WORKPLACE_SUPERVISOR,
        )

        self.organization = Organizations.objects.create(
            name="TechCorp Solutions",
            industry="Software",
            city="Kampala",
            address="123 Innovation Way",
            contact_email=f"hr@{TEST_EMAIL_DOMAIN}",
            contact_phone=f"{TEST_PHONE}",
        )

        self.institution = Institutions.objects.create(
            name="Muk",
            email_domain=f"s@{TEST_EMAIL_DOMAIN}",
        )

        self.department = Departments.objects.create(
            institution=self.institution,
            name="Computing",
        )

        self.programme = Programmes.objects.create(
            department=self.department,
            name="CS",
            level="advanced",
            duration_years=3,
        )

        self.intern.institution_id = str(self.institution.id)
        self.intern.programme_id = str(self.programme.id)
        self.intern.save()

        self.placement = InternshipPlacements.objects.create(
            intern=self.intern,
            institution=self.institution,
            programme=self.programme,
            organization=self.organization,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=self.academic_supervisor,
            start_date=timezone.now().date(),
            end_date=(timezone.now() + timedelta(days=90)).date(),
            work_mode="mode",
            internship_title="Software Engineering Intern",
            department_at_company="SE",
            status="draft",
            submitted_at=timezone.now(),
            approved_at=timezone.now(),
        )

        self.detail_url = reverse("placement-detail", kwargs={"pk": self.placement.pk})
        self.submit_url = reverse("placement-submit", kwargs={"pk": self.placement.pk})
        self.approve_url = reverse("placement-approve", kwargs={"pk": self.placement.pk})

    def test_submit_placement_success(self):
        """Test that a student can submit a draft."""
        self.client.force_authenticate(user=self.intern)

        response = self.client.post(self.submit_url, {"comment": "Submitting for review"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.placement.refresh_from_db()
        self.assertEqual(self.placement.status, "submitted")
        self.assertTrue(PlacementStatusHistory.objects.filter(to_status="submitted").exists())

    def test_intern_cannot_approve_own_placement(self):
        """Test security: Students cannot approve placements."""
        self.placement.status = "submitted"
        self.placement.save()

        self.client.force_authenticate(user=self.intern)
        response = self.client.post(self.approve_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_edit_lockdown_on_approved_status(self):
        """Test that validation blocks editing approved placements."""
        self.placement.status = "approved"
        self.placement.save()

        self.client.force_authenticate(user=self.intern)

        data = {"internship_title": "New Title"}
        response = self.client.patch(self.detail_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_other_student_cannot_view_unassigned_placement(self):
        other_student = User.objects.create_user(
            email=f"other-student@{TEST_EMAIL_DOMAIN}",
            password=f"{TEST_PASSWORD}",
            first_name="Other",
            last_name="Student",
            role=User.STUDENT,
        )
        self.client.force_authenticate(user=other_student)

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_can_create_placement_with_supervisors_matched_by_email(self):
        self.client.force_authenticate(user=self.intern)

        response = self.client.post(
            reverse("placement-list-create"),
            {
                "organization": self.organization.id,
                "internship_title": "Platform Engineering Intern",
                "department_at_company": "Engineering",
                "work_mode": "onsite",
                "start_date": timezone.now().date(),
                "end_date": (timezone.now() + timedelta(days=60)).date(),
                "workplace_supervisor_email": self.workplace_supervisor.email,
                "academic_supervisor_email": self.academic_supervisor.email,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_placement = InternshipPlacements.objects.get(id=response.data["id"])
        self.assertEqual(created_placement.intern, self.intern)
        self.assertEqual(created_placement.workplace_supervisor, self.workplace_supervisor)
        self.assertEqual(created_placement.academic_supervisor, self.academic_supervisor)

    def test_student_can_create_placement_with_new_organization_details(self):
        self.client.force_authenticate(user=self.intern)

        response = self.client.post(
            reverse("placement-list-create"),
            {
                "organization_details": {
                    "name": "Startup Labs",
                    "industry": "Research",
                    "city": "Entebbe",
                    "address": "42 Science Avenue",
                    "contact_email": "contact@startuplabs.example",
                    "contact_phone": "+256700000000",
                },
                "internship_title": "Innovation Intern",
                "department_at_company": "R&D",
                "work_mode": "remote",
                "start_date": timezone.now().date(),
                "end_date": (timezone.now() + timedelta(days=60)).date(),
                "workplace_supervisor_email": self.workplace_supervisor.email,
                "academic_supervisor_email": self.academic_supervisor.email,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_placement = InternshipPlacements.objects.get(id=response.data["id"])
        self.assertEqual(created_placement.intern, self.intern)
        self.assertEqual(created_placement.organization.name, "Startup Labs")
        self.assertEqual(
            created_placement.organization.contact_email, "contact@startuplabs.example"
        )
        self.assertEqual(created_placement.workplace_supervisor, self.workplace_supervisor)
        self.assertEqual(created_placement.academic_supervisor, self.academic_supervisor)

    def test_student_cannot_create_placement_when_supervisor_email_does_not_exist(self):
        self.client.force_authenticate(user=self.intern)
        initial_count = InternshipPlacements.objects.count()

        response = self.client.post(
            reverse("placement-list-create"),
            {
                "organization": self.organization.id,
                "internship_title": "Platform Engineering Intern",
                "department_at_company": "Engineering",
                "work_mode": "onsite",
                "start_date": timezone.now().date(),
                "end_date": (timezone.now() + timedelta(days=60)).date(),
                "workplace_supervisor_email": "missing-workplace@example.com",
                "academic_supervisor_email": self.academic_supervisor.email,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["workplace_supervisor_email"][0], "Workplace supervisor does not exist."
        )
        self.assertEqual(InternshipPlacements.objects.count(), initial_count)
