from apps.accounts.models import User
from django.test import TestCase

# Create your tests here.


class TestLogbook(TestCase):
    def test_create_weekly_log_with_correct_role(self):
        # Create required related objects
        from apps.academics.models import Departments, Institutions, Programmes
        from apps.organizations.models import Organizations
        from apps.placements.models import InternshipPlacements

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
        workplace_supervisor = User.objects.create_user(
            email="workplace@test.edu",
            password="password",
            role=User.WORKPLACE_SUPERVISOR,
            first_name="Workplace",
            last_name="Supervisor",
        )
        # Student
        student_user = User.objects.create_user(
            email="student1@example.com",
            password="password",
            role=User.STUDENT,
            first_name="Student",
            last_name="User",
        )
        # Placement for the student
        placement = InternshipPlacements.objects.create(
            intern=student_user,
            institution=institution,
            programme=programme,
            organization=organization,
            workplace_supervisor=workplace_supervisor,
            academic_supervisor=academic_supervisor,
            start_date="2024-01-01",
            end_date="2024-12-31",
            work_mode="onsite",
            internship_title="Software Intern",
            department_at_company="Engineering",
            status="active",
        )
        placement_id = placement.id  # type: ignore
        # Use placement in an assertion
        self.assertEqual(placement.status, "active")
        # Log in the user
        self.client.force_login(student_user)
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
