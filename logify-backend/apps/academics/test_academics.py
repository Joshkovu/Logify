# from django.test import TestCase
from apps.academics.models import Departments, Institutions, Programmes
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


# Create your tests here.
class InstitutionsListViewTest(APITestCase):
    def setUp(self):
        Institutions.objects.create(name="University A", email_domain="@unia.com")
        Institutions.objects.create(name="University B", email_domain="@unib.com")

    def test_returns_200(self):
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_all_institutions(self):
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(len(response.data), 2)

    def test_returns_empty_list(self):
        Institutions.objects.all().delete()
        response = self.client.get(reverse("institutions-list"))
        self.assertEqual(response.data, [])


class InstitutionsDetailViewTest(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )

    def test_returns_200(self):
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_correct_institution(self):
        response = self.client.get(reverse("institutions-detail", args=[self.institution.pk]))
        self.assertEqual(response.data["name"], "University A")

    def test_returns_404_for_nonexistent(self):
        response = self.client.get(reverse("institutions-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DepartmentsListViewTest(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        Departments.objects.create(institution=self.institution, name="Department A")
        Departments.objects.create(institution=self.institution, name="Department B")

    def test_returns_200(self):
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_all_departments(self):
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(len(response.data), 2)

    def test_returns_empty_list(self):
        Departments.objects.all().delete()
        response = self.client.get(reverse("departments-list"))
        self.assertEqual(response.data, [])


class DeparmentsDetailViewTest(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Department A"
        )

    def test_returns_200(self):
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_correct_department(self):
        response = self.client.get(reverse("departments-detail", args=[self.department.pk]))
        self.assertEqual(response.data["name"], "Department A")

    def test_returns_404_for_nonexistent(self):
        response = self.client.get(reverse("departments-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class InstitutionDepartmentsListViewTest(APITestCase):
    def setUp(self):
        self.institutionA = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.institutionB = Institutions.objects.create(
            name="University B", email_domain="@unib.com"
        )
        Departments.objects.create(institution=self.institutionA, name="Department A")
        Departments.objects.create(institution=self.institutionA, name="Department B")
        Departments.objects.create(institution=self.institutionB, name="Department C")

    def test_returns_200_for_institution_a(self):
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institutionA.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_200_for_institution_b(self):
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institutionB.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_only_institution_a_departments(self):
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institutionA.pk])
        )
        self.assertEqual(len(response.data), 2)

    def test_returns_only_institution_b_departments(self):
        response = self.client.get(
            reverse("institution-departments-list", args=[self.institutionB.pk])
        )
        self.assertEqual(len(response.data), 1)

    def test_returns_empty_list_when_no_departments(self):
        empty_institution = Institutions.objects.create(
            name="University C", email_domain="@unic.com"
        )
        response = self.client.get(
            reverse("institution-departments-list", args=[empty_institution.pk])
        )
        self.assertEqual(response.data, [])


class ProgrammesListViewTest(APITestCase):
    def setUp(self):
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

    def test_returns_200(self):
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_all_programmes(self):
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(len(response.data), 2)

    def test_returns_empty_list(self):
        Programmes.objects.all().delete()
        response = self.client.get(reverse("programmes-list"))
        self.assertEqual(response.data, [])


class ProgrammesDetailViewTest(APITestCase):
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

    def test_returns_200(self):
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_correct_programme(self):
        response = self.client.get(reverse("programmes-detail", args=[self.programme.pk]))
        self.assertEqual(response.data["name"], "Programme A")

    def test_returns_404_for_nonexistent(self):
        response = self.client.get(reverse("programmes-detail", args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DepartmentProgrammesListViewTest(APITestCase):
    def setUp(self):
        self.institution = Institutions.objects.create(
            name="University A", email_domain="@unia.com"
        )
        self.departmentA = Departments.objects.create(
            institution=self.institution, name="Department A"
        )
        self.departmentB = Departments.objects.create(
            institution=self.institution, name="Department B"
        )
        Programmes.objects.create(
            department=self.departmentA, name="Programme A", level="Level A", duration_years=3
        )
        Programmes.objects.create(
            department=self.departmentA, name="Programme B", level="Level B", duration_years=3
        )
        Programmes.objects.create(
            department=self.departmentB, name="Programme C", level="Level C", duration_years=3
        )

    def test_returns_200_for_department_a(self):
        response = self.client.get(
            reverse("department-programmes-list", args=[self.departmentA.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_200_for_department_b(self):
        response = self.client.get(
            reverse("department-programmes-list", args=[self.departmentB.pk])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_only_department_a_programmes(self):
        response = self.client.get(
            reverse("department-programmes-list", args=[self.departmentA.pk])
        )
        self.assertEqual(len(response.data), 2)

    def test_returns_only_department_b_programmes(self):
        response = self.client.get(
            reverse("department-programmes-list", args=[self.departmentB.pk])
        )
        self.assertEqual(len(response.data), 1)

    def test_returns_empty_list_when_no_departments(self):
        empty_department = Departments.objects.create(
            institution=self.institution, name="Department C"
        )
        response = self.client.get(
            reverse("department-programmes-list", args=[empty_department.pk])
        )
        self.assertEqual(response.data, [])
