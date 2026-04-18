from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


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
        self.academic_supervisor = make_user("as@test.com", User.ACADEMIC_SUPERVISOR)
        self.student = make_user("student@test.com", User.STUDENT)

    def test_authenticated_can_list_user_by_pk(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "as@test.com")

    def test_unauthenticated_cannot_list_user_by_pk(self):
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_fetch_nonexistent_user_returns_404(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse("user-detail", kwargs={"pk": 99999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
