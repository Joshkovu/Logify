# from django.test import TestCase
from apps.accounts.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import InternshipPlacements


# Create your tests here.
class PlacementAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
        )

        self.client.force_authentication(user=self.user)

        self.placement = InternshipPlacements.objects.create(
            intern=self.user,
            institution_id=1,
            programme_id=1,
            organization_is=1,
            start_date="01/01/2025",
            end_date="01/06/2025",
            internship_title="Backend Intern",
            department_at_company="Engineering",
        )

    def test_get_placements(self):
        response = self.client.get("/api/placements/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_placement(self):
        data = {
            "intern": self.user.id,
            "institution": 1,
            "programme": 1,
            "organization": 1,
            "start_date": "01/01/2025",
            "end_date": "01/06/2025",
            "internship_title": "Backend Intern",
            "department_at_company": "Engineering",
        }

        response = self.client.post("/api/placements/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_submit_placement(self):
        response = self.client.post(f"/api/placements/{self.placement.id}/submit/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.placement.refresh_from_db()

        self.assertEqual(self.placement.status, "submitted")

    def test_invalid_transition(self):
        response = self.client.post(f"/api/placements/{self.placement.id}/activate/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_assign_workplace_supervisor(self):
        supervisor = User.objects.create_user(
            email="supervisor@test.com",
            password="pass123",
        )

        response = self.client.post(
            f"/api/placements/{self.placement.id}/assign-workplace-supervisor/",
            {"supervisor_id": supervisor.id},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.placement.refresh_from_db()

        self.assertEqual(self.placement.workplace_supervisor, supervisor)
