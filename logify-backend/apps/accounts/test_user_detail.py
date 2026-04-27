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
        self.academic_supervisor = make_user(
            "as@test.com", User.ACADEMIC_SUPERVISOR, institution_id="2"
        )
        self.student = make_user("student@test.com", User.STUDENT, institution_id="1")
        self.same_scope_student = make_user(
            "same.scope@student.com", User.STUDENT, institution_id="1"
        )
        self.admin = make_user("admin@test.com", User.INTERNSHIP_ADMIN, institution_id="1")

    def test_non_admin_cannot_view_other_user_by_pk(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.academic_supervisor.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_view_user_in_same_institution(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("user-detail", kwargs={"pk": self.same_scope_student.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "same.scope@student.com")

    def test_admin_cannot_view_user_in_other_institution(self):
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

    def test_admin_cannot_delete_user_in_other_institution(self):
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
