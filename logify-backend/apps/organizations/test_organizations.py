# from django.urls import reverse
from apps.organizations.models import Organizations
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class TestOrganizationAPI(APITestCase):
    def setUp(self):
        self.organization = Organizations.objects.create(
            name="Acme Corp",
            industry="Technology",
            city="Kampala",
            address="Plot 10, Kampala Road",
            contact_email="info@acme.com",
            contact_phone="+256700000000",
        )
        self.list_url = reverse("organization-list-create")
        self.detail_url = reverse("organization-detail", args=[self.organization.id])  # type: ignore

    def test_get_organizations_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # type: ignore
        self.assertEqual(response.data[0]["name"], "Acme Corp")  # type: ignore

    def test_create_organization(self):
        payload = {
            "name": "Beta Ltd",
            "industry": "Finance",
            "city": "Entebbe",
            "address": "12 Main Street",
            "contact_email": "hello@beta.com",
            "contact_phone": "+256711111111",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organizations.objects.count(), 2)

    def test_get_single_organization(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.organization.id)  # type: ignore

    def test_patch_organization(self):
        payload = {"city": "Jinja"}

        response = self.client.patch(self.detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.organization.refresh_from_db()
        self.assertEqual(self.organization.city, "Jinja")

    def test_delete_organization(self):
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Organizations.objects.filter(id=self.organization.id).exists())  # type: ignore
