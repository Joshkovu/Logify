from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import User
from apps.logbook.models import WeeklyLogs
from apps.organizations.models import Organizations
from apps.placements.models import InternshipPlacements
from django.test import TestCase

# Create your tests here.


class TestLogbook(TestCase):
    def setUp(self):
        # Institution, Department, Programme
        institution = Institutions.objects.create(name="Test University", email_domain="test.edu")
        department = Departments.objects.create(institution=institution, name="Engineering")
        programme = Programmes.objects.create(
            department=department, name="Computer Science", level="BSc", duration_years=4
        )
        # Organization
        organization = Organizations.objects.create(
            name="TestOrg",
            industry="Tech",
            city="TestCity",
            address="123 Test St",
            contact_email="contact@testorg.com",
            contact_phone="1234567890",
        )
        # Supervisors
        academic_supervisor = User.objects.create_user(
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
        # Student
        self.student_user = User.objects.create_user(
            email="student1@example.com",
            password="password",
            role=User.STUDENT,
            first_name="Student",
            last_name="User",
        )
        # Placement for the student
        self.placement = InternshipPlacements.objects.create(
            intern=self.student_user,
            institution=institution,
            programme=programme,
            organization=organization,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=academic_supervisor,
            start_date="2024-01-01",
            end_date="2024-12-31",
            work_mode="onsite",
            internship_title="Software Intern",
            department_at_company="Engineering",
            status="active",
        )

    def test_create_weekly_log_with_correct_role(self):
        # Create required related objects
        placement_id = self.placement.id  # type: ignore
        # Use placement in an assertion
        self.assertEqual(self.placement.status, "active")
        # Log in the user
        self.client.force_login(self.student_user)
        # Attempt to create a weekly log
        log_response = self.client.post(
            "/logbook/create_weekly_log/",
            {
                "week_number": 1,
                "week_start_date": "2024-01-01",
                "week_end_date": "2024-01-07",
                "activities": "Worked on project X",
                "challenges": "Faced issue Y",
                "learnings": "Learned about Z",
                "placement": placement_id,
                "status": "draft",
            },
        )
        print(log_response.status_code)
        print(log_response.content)

        # Check if the log was created successfully
        self.assertIn("success", log_response.json())
        self.assertEqual(log_response.json()["success"], "Weekly log created successfully")

    def test_weekly_log_update_is_true_when_in_draft_status(self):
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=1,
            week_start_date="2024-01-01",
            week_end_date="2024-01-07",
            activities="Worked on project X",
            challenges="Faced issue Y",
            learnings="Learned about Z",
            status="draft",
        )
        log_id = weekly_log.id  # type: ignore
        # Log in the user
        self.client.force_login(self.student_user)
        # Attempt to update the weekly log
        update_response = self.client.put(
            f"/logbook/update_weekly_log/{log_id}/",
            {
                "activities": "Updated activities",
                "challenges": "Updated challenges",
                "learnings": "Updated learnings",
            },
            content_type="application/json",
        )
        print(update_response.status_code)
        print(update_response.content)
        self.assertEqual(update_response.status_code, 200)
        # Check if the log was updated successfully
        self.assertIn("success", update_response.json())
        self.assertEqual(update_response.json()["success"], "Weekly log updated successfully")
        self.assertEqual(update_response.json()["weekly_log"]["activities"], "Updated activities")
        self.assertEqual(update_response.json()["weekly_log"]["challenges"], "Updated challenges")
        self.assertEqual(update_response.json()["weekly_log"]["learnings"], "Updated learnings")
        self.assertEqual(update_response.json()["weekly_log"]["status"], "draft")

    def test_weekly_log_gets_approved_or_rejected_by_supervisor(self):
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=1,
            week_start_date="2024-01-01",
            week_end_date="2024-01-07",
            activities="Worked on project X",
            challenges="Faced issue Y",
            learnings="Learned about Z",
            status="draft",
        )
        log_id = weekly_log.id  # type: ignore
        # Log in the student and submit the weekly log
        self.client.force_login(self.student_user)
        submit_response = self.client.post(f"/logbook/submit_weekly_log/{log_id}/")
        # Approval from supervisor but the supervisor has to first be logged in for this to pass
        self.client.force_login(self.workplace_supervisor)
        approve_response = self.client.post(
            f"/logbook/approve_weekly_log/{log_id}/",
            {"comment": "Good work!"},
            content_type="application/json",
        )
        print(approve_response.status_code)
        print(approve_response.content)
        # Check if the log was approved successfully
        self.assertIn("success", approve_response.json())
        self.assertEqual(approve_response.json()["success"], "Weekly log approved successfully")
        # this code  updates state in memory such that we can reject it
        weekly_log.refresh_from_db()  # type: ignore
        weekly_log.status = "submitted"
        weekly_log.save()
        # Now reject the same log to check if rejection works but make sure the workplace supervisor is logged in for this to pass
        self.client.force_login(self.workplace_supervisor)
        reject_response = self.client.post(
            f"/logbook/reject_weekly_log/{log_id}/",
            {"comment": "Needs improvement"},
            content_type="application/json",
        )

        print(reject_response.status_code)
        print(reject_response.content)
        # Check if the log was rejected successfully
        self.assertIn("success", reject_response.json())
        self.assertEqual(reject_response.json()["success"], "Weekly log rejected successfully")
        print(submit_response.status_code)
        print(submit_response.content)
        # Check if the log was submitted successfully
        self.assertIn("success", submit_response.json())
