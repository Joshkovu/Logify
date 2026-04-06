from datetime import date

from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import User
from apps.logbook.models import WeeklyLogs
from apps.organizations.models import Organizations
from apps.placements.models import InternshipPlacements
from apps.reports.models import InternshipReport
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.


class TestInternshipReportModels(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="teststudent@example.com",
            password="password",
            role=User.STUDENT,
            first_name="Test",
            last_name="Student",
        )
        self.report = InternshipReport.objects.create(
            student=self.user,
            internship_start=date(2024, 1, 1),
            internship_end=date(2024, 3, 31),
            logs="Sample logs",
            supervisor_comments="Good progress",
            report_type="final",
            evaluation_score=85.5,
            placement_info="Placed at TestOrg",
            summary_stats={"total_weeks": 12, "first_week": 1, "last_week": 12},
        )

    def test_invalid_report_type(self):
        report = InternshipReport(
            student=self.user,
            internship_start=date(2024, 1, 1),
            internship_end=date(2024, 3, 31),
            logs="Sample logs",
            supervisor_comments="Good progress",
            report_type="invalid_type",
        )
        with self.assertRaises(Exception):
            report.full_clean()

    def test_negative_evaluation_score(self):

        report = InternshipReport(
            student=self.user,
            internship_start=date(2024, 1, 1),
            internship_end=date(2024, 3, 31),
            logs="Sample logs",
            supervisor_comments="Good progress",
            evaluation_score=-10,
        )
        with self.assertRaises(Exception):
            report.full_clean()

    def test_internship_report_creation(self):
        self.assertEqual(self.report.student, self.user)
        self.assertEqual(self.report.internship_start.strftime("%Y-%m-%d"), "2024-01-01")
        self.assertEqual(self.report.internship_end.strftime("%Y-%m-%d"), "2024-03-31")
        self.assertEqual(self.report.logs, "Sample logs")
        self.assertEqual(self.report.supervisor_comments, "Good progress")


class TestInternshipReportAPI(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="teststudent2@example.com",
            password="password",
            role=User.STUDENT,
            first_name="Test",
            last_name="Student",
        )
        self.academic_supervisor = User.objects.create_user(
            email="academic@test.edu",
            password="password",
            role=User.ACADEMIC_SUPERVISOR,
            first_name="Academic",
            last_name="Supervisor",
        )
        self.workplace_supervisor = User.objects.create_user(
            email="workplace@test.edu",
            password="password",
            role=User.WORKPLACE_SUPERVISOR,
            first_name="Workplace",
            last_name="Supervisor",
        )
        institution = Institutions.objects.create(name="Test University", email_domain="test.edu")
        department = Departments.objects.create(institution=institution, name="Engineering")
        programme = Programmes.objects.create(
            department=department, name="Computer Science", level="BSc", duration_years=4
        )
        organization = Organizations.objects.create(
            name="TestOrg",
            industry="Tech",
            city="TestCity",
            address="123 Test St",
            contact_email="contact@testorg.com",
            contact_phone="1234567890",
        )
        self.placement = InternshipPlacements.objects.create(
            intern=self.user,
            institution=institution,
            programme=programme,
            organization=organization,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=self.academic_supervisor,
            start_date="2024-01-01",
            end_date="2024-12-31",
            work_mode="onsite",
            internship_title="Software Intern",
            department_at_company="Engineering",
            status="active",
        )
        self.weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=1,
            week_start_date=date(2024, 1, 1),
            week_end_date=date(2024, 1, 7),
            activities="Worked on project X",
            challenges="Faced issue Y",
            learnings="Learned about Z",
            status="submitted",
        )

    def test_report_type_filtering(self):

        InternshipReport.objects.create(
            student=self.user,
            internship_start=date(2024, 1, 1),
            internship_end=date(2024, 3, 31),
            logs="Sample logs",
            supervisor_comments="Good progress",
            report_type="mid-term",
        )
        InternshipReport.objects.create(
            student=self.user,
            internship_start=date(2024, 4, 1),
            internship_end=date(2024, 6, 30),
            logs="Sample logs",
            supervisor_comments="Excellent",
            report_type="final",
        )
        url = reverse("weekly_logs_report", kwargs={"student_id": self.user.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url + "?report_type=final")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["report_type"], "final")  # type: ignore

    def test_csv_export(self):
        url = reverse("weekly_logs_report", kwargs={"student_id": self.user.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url + "?export=csv")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.get("Content-Type"), "text/csv")
        self.assertIn("report_id", response.content.decode())

    def testCreateReport(self):
        url = reverse("weekly_logs_report", kwargs={"student_id": self.user.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["student_id"], self.user.id)  # type: ignore
        self.assertEqual(
            (
                response.data["internship_start"].strftime("%Y-%m-%d")  # type: ignore
                if hasattr(response.data["internship_start"], "strftime")  # type: ignore
                else response.data["internship_start"]  # type: ignore
            ),
            "2024-01-01",
        )
        self.assertIn("Week 1:", response.data["logs"])  # type: ignore
