from apps.academics.models import Departments, Institutions, Programmes
from apps.accounts.models import User
from apps.logbook.models import SupervisorReviews, WeeklyLogs, WeeklyLogStatusHistory
from apps.organizations.models import Organizations
from apps.placements.models import InternshipPlacements
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

# Create your tests here.


class TestLogbook(APITestCase):
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
        self.client.force_authenticate(user=self.student_user)
        # Attempt to create a weekly log
        log_response = self.client.post(
            "/api/v1/logbook/create_weekly_log/",
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
        self.client.force_authenticate(user=self.student_user)
        # Attempt to update the weekly log
        update_response = self.client.put(
            f"/api/v1/logbook/update_weekly_log/{log_id}/",
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
        self.client.force_authenticate(user=self.student_user)
        submit_response = self.client.post(f"/api/v1/logbook/submit_weekly_log/{log_id}/")
        # Approval from supervisor but the supervisor has to first be logged in for this to pass
        self.client.force_authenticate(user=self.workplace_supervisor)
        approve_response = self.client.post(
            f"/api/v1/logbook/approve_weekly_log/{log_id}/",
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
            f"/api/v1/logbook/reject_weekly_log/{log_id}/",
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

    def test_student_can_get_supervisor_reviews(self):
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=1,
            week_start_date="2024-01-01",
            week_end_date="2024-01-07",
            activities="Worked on project X",
            challenges="Faced issue Y",
            learnings="Learned about Z",
            status="approved",
        )
        log_id = weekly_log.id

        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse("weekly_log_reviews", kwargs={"log_id": log_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("reviews", response.json())
        self.assertEqual(response.json()["success"], "Reviews retrieved successfully")

    def test_submit_and_approve_create_status_history(self):
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=2,
            week_start_date="2024-01-08",
            week_end_date="2024-01-14",
            activities="Worked on project Y",
            challenges="Faced issue Z",
            learnings="Learned about APIs",
            status="draft",
        )

        self.client.force_authenticate(user=self.student_user)
        submit_response = self.client.post(
            reverse("submit_weekly_log", kwargs={"log_id": weekly_log.id})
        )
        self.assertEqual(submit_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            WeeklyLogStatusHistory.objects.filter(
                weekly_log=weekly_log, to_status="submitted"
            ).exists()
        )

        self.client.force_authenticate(user=self.workplace_supervisor)
        approve_response = self.client.post(
            reverse("approve_weekly_log", kwargs={"log_id": weekly_log.id}),
            {"comment": "Looks good"},
            content_type="application/json",
        )
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            WeeklyLogStatusHistory.objects.filter(
                weekly_log=weekly_log, to_status="approved"
            ).exists()
        )
        self.assertTrue(
            SupervisorReviews.objects.filter(weekly_log=weekly_log, decision="approved").exists()
        )

    def test_student_cannot_view_other_students_reviews(self):
        other_student = User.objects.create_user(
            email="student2@example.com",
            password="password",
            role=User.STUDENT,
            first_name="Another",
            last_name="Student",
        )
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=3,
            week_start_date="2024-01-15",
            week_end_date="2024-01-21",
            activities="Worked on project Z",
            challenges="None",
            learnings="Learned testing",
            status="approved",
        )

        self.client.force_authenticate(user=other_student)
        response = self.client.get(reverse("weekly_log_reviews", kwargs={"log_id": weekly_log.id}))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_reviews_for_nonexisten_log_returns_404(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse("weekly_log_reviews", kwargs={"log_id": 99999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_cannot_get_reviews(self):
        response = self.client.get(reverse("weekly_log_reviews", kwargs={"log_id": 99999}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("apps.logbook.views.send_logify_email")
    def test_submit_weekly_log_sends_notification_to_supervisor(self, mock_send_email):
        """Test that submitting a weekly log sends notification to workplace supervisor"""
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=4,
            week_start_date="2024-01-22",
            week_end_date="2024-01-28",
            activities="Worked on project A",
            challenges="Faced issue B",
            learnings="Learned about C",
            status="draft",
        )

        self.client.force_authenticate(user=self.student_user)
        response = self.client.post(
            reverse("submit_weekly_log", kwargs={"log_id": weekly_log.id})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify send_logify_email was called
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args

        # Verify correct recipient (supervisor email)
        self.assertEqual(call_args[1]["recipient_list"][0], self.workplace_supervisor.email)
        # Verify correct template
        self.assertEqual(call_args[1]["template_name"], "notifications/logbook_submitted.html")
        # Verify context contains necessary fields
        context = call_args[1]["context"]
        self.assertIn("student_name", context)
        self.assertIn("supervisor_name", context)
        self.assertIn("week_range", context)
        self.assertIn("submission_date", context)
        self.assertIn("dashboard_url", context)
        self.assertEqual(context["student_name"], f"{self.student_user.first_name} {self.student_user.last_name}")
        self.assertEqual(context["supervisor_name"], f"{self.workplace_supervisor.first_name} {self.workplace_supervisor.last_name}")

    @patch("apps.logbook.views.send_logify_email")
    def test_approve_weekly_log_sends_notification_to_student(self, mock_send_email):
        """Test that approving a weekly log sends notification to student"""
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=5,
            week_start_date="2024-01-29",
            week_end_date="2024-02-04",
            activities="Worked on project X",
            challenges="Faced issue Y",
            learnings="Learned about Z",
            status="submitted",
        )

        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.post(
            reverse("approve_weekly_log", kwargs={"log_id": weekly_log.id}),
            {"comment": "Excellent work!"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify send_logify_email was called
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args

        # Verify correct recipient (student email)
        self.assertEqual(call_args[1]["recipient_list"][0], self.student_user.email)
        # Verify correct template
        self.assertEqual(call_args[1]["template_name"], "notifications/logbook_approved.html")
        # Verify context contains necessary fields
        context = call_args[1]["context"]
        self.assertIn("student_name", context)
        self.assertIn("supervisor_name", context)
        self.assertIn("week_range", context)
        self.assertIn("dashboard_url", context)
        self.assertEqual(context["student_name"], f"{self.student_user.first_name} {self.student_user.last_name}")

    @patch("apps.logbook.views.send_logify_email")
    def test_reject_weekly_log_sends_notification_to_student(self, mock_send_email):
        """Test that rejecting a weekly log sends notification to student"""
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=6,
            week_start_date="2024-02-05",
            week_end_date="2024-02-11",
            activities="Worked on project P",
            challenges="Faced issue Q",
            learnings="Learned about R",
            status="submitted",
        )

        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.post(
            reverse("reject_weekly_log", kwargs={"log_id": weekly_log.id}),
            {"comment": "Please provide more details on challenges faced."},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify send_logify_email was called
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args

        # Verify correct recipient (student email)
        self.assertEqual(call_args[1]["recipient_list"][0], self.student_user.email)
        # Verify correct template
        self.assertEqual(call_args[1]["template_name"], "notifications/logbook_rejected.html")
        # Verify context contains necessary fields
        context = call_args[1]["context"]
        self.assertIn("student_name", context)
        self.assertIn("week_range", context)
        self.assertIn("reason", context)
        self.assertIn("dashboard_url", context)
        self.assertEqual(context["reason"], "Please provide more details on challenges faced.")

    @patch("apps.logbook.views.send_logify_email")
    def test_request_changes_sends_notification_to_student(self, mock_send_email):
        """Test that requesting changes sends notification to student"""
        weekly_log = WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=7,
            week_start_date="2024-02-12",
            week_end_date="2024-02-18",
            activities="Worked on project M",
            challenges="Faced issue N",
            learnings="Learned about O",
            status="submitted",
        )

        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.post(
            reverse("request_changes_weekly_log", kwargs={"log_id": weekly_log.id}),
            {"comment": "Please review the feedback provided and make the necessary adjustments."},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify send_logify_email was called
        mock_send_email.assert_called_once()
        call_args = mock_send_email.call_args

        # Verify correct recipient (student email)
        self.assertEqual(call_args[1]["recipient_list"][0], self.student_user.email)
        # Verify correct template
        self.assertEqual(call_args[1]["template_name"], "notifications/logbook_changes_requested.html")
        # Verify context contains necessary fields
        context = call_args[1]["context"]
        self.assertIn("student_name", context)
        self.assertIn("supervisor_name", context)
        self.assertIn("week_range", context)
        self.assertIn("comment", context)
        self.assertIn("dashboard_url", context)
        self.assertEqual(context["comment"], "Please review the feedback provided and make the necessary adjustments.")
