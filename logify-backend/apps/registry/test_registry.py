from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import User
from apps.registry.models import StudentRegistry
from django.test import TestCase
from rest_framework.test import APITestCase

# Create your tests here.


class TestRegistryModels(TestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(name="Test Institution")
        self.department = Departments.objects.create(
            institution=self.institution, name="Test Department"
        )
        self.programme = Programmes.objects.create(
            name="Test Programme", department=self.department, level="BSc", duration_years=4
        )
        self.student_registry = StudentRegistry.objects.create(
            institution=self.institution,
            programme=self.programme,
            student_number=12345,
            webmail="example.james@mac.ac.ug",
            year_of_study=2,
            intake_year=2022,
            status="active",
            is_claimed=False,
        )

    def test_student_registry_creation(self):
        self.assertEqual(self.student_registry.webmail, "example.james@mac.ac.ug")


class TestRegistrationAPI(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(name="Test Institution")
        self.user = User.objects.create_user(
            email="student@mac.ac.ug",
            password="password",
            role=User.INTERNSHIP_ADMIN,
            first_name="Test",
            last_name="Student",
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Test Department"
        )
        self.programme = Programmes.objects.create(
            name="Test Programme", department=self.department, level="BSc", duration_years=4
        )
        self.student_registry = StudentRegistry.objects.create(
            institution=self.institution,
            programme=self.programme,
            student_number=12345,
            webmail="example.james@mac.ac.ug",
            year_of_study=2,
            intake_year=2022,
            status="active",
            is_claimed=False,
        )

    def test_get_student_registry(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/registry/students/")
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data), 1)  # type: ignore
        self.assertEqual(response.data[0]["webmail"], "example.james@mac.ac.ug")  # type: ignore
