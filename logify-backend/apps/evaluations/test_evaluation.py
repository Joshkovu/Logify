from datetime import date

from apps.academics.models import Departments, Institutions, Programmes
from apps.evaluations.models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)
from apps.evaluations.serializer import (
    EvaluationCriteriaSerializer,
    EvaluationRubricsSerializer,
    EvaluationsSerializer,
)
from apps.organizations.models import Organizations
from apps.placements.models import InternshipPlacements
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APITestCase


class TestEvaluation(TestCase):
    def setUp(self):
        User = get_user_model()
        # Create Users
        self.student = User.objects.create_user(
            email="student@example.com",
            password="testpassword",
            first_name="Student",
            last_name="User",
            role="student",
        )  # type: ignore
        self.academic_supervisor = User.objects.create_user(
            email="academic@example.com",
            password="testpassword",
            first_name="Academic",
            last_name="Supervisor",
            role="academic_supervisor",
        )  # type: ignore
        self.workplace_supervisor = User.objects.create_user(
            email="workplace@example.com",
            password="testpassword",
            first_name="Workplace",
            last_name="Supervisor",
            role="workplace_supervisor",
        )  # type: ignore

        # Create Academics
        self.institution = Institutions.objects.create(
            name="Test University", email_domain="test.edu"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Engineering"
        )
        self.programme = Programmes.objects.create(
            department=self.department, name="Computer Science", level="BSc", duration_years=4
        )

        # Create Organization
        self.organization = Organizations.objects.create(
            name="Test Org",
            industry="Tech",
            city="Test City",
            address="123 Test St",
            contact_email="org@example.com",
            contact_phone="1234567890",
        )

        # Create Placement
        self.placement = InternshipPlacements.objects.create(
            intern=self.student,
            institution=self.institution,
            programme=self.programme,
            organization=self.organization,
            workplace_supervisor=self.workplace_supervisor,
            academic_supervisor=self.academic_supervisor,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            work_mode="On-site",
            internship_title="Software Engineering Intern",
            department_at_company="IT",
            status="active",
        )

        # Create Rubric
        self.rubric = EvaluationRubrics.objects.create(
            institution=self.institution,
            programme=self.programme,
            name="Test Rubric",
            is_current=True,
        )
        self.criteria = EvaluationCriteria.objects.create(
            rubric=self.rubric,
            name="Test Criteria",
            description="This is a test criteria.",
            max_score=10,
            weight_percent=50.0,
            evaluator_type="academic_supervisor",
        )
        self.evaluation = Evaluations.objects.create(
            placement=self.placement,
            rubric=self.rubric,
            evaluator=self.academic_supervisor,
            total_score=85.0,
        )
        self.score = EvaluationScores.objects.create(
            evaluation=self.evaluation,
            criterion=self.criteria,
            score=8,
            comment="Good performance.",
        )
        self.final_result = FinalResults.objects.create(
            placement=self.placement,
            final_score=80.0,
            final_grade="A",
            logbook_score=40.0,
            academic_score=40.0,
        )

    def test_evaluation_rubrics_serializer(self):
        serializer = EvaluationRubricsSerializer(instance=self.rubric)
        data = serializer.data
        self.assertEqual(data["name"], "Test Rubric")  # type: ignore
        self.assertEqual(data["institution"], self.institution.id)  # type: ignore
        self.assertEqual(data["programme"], self.programme.id)  # type: ignore

    def test_evaluation_criteria_serializer(self):
        serializer = EvaluationCriteriaSerializer(instance=self.criteria)
        data = serializer.data
        self.assertEqual(data["name"], "Test Criteria")  # type: ignore
        self.assertEqual(data["description"], "This is a test criteria.")  # type: ignore
        self.assertEqual(data["max_score"], 10)  # type: ignore
        self.assertEqual(data["weight_percent"], 50.0)  # type: ignore
        self.assertEqual(data["evaluator_type"], "academic_supervisor")  # type: ignore

    def test_evaluations_serializer(self):
        serializer = EvaluationsSerializer(instance=self.evaluation)
        data = serializer.data
        self.assertEqual(data["placement"], self.placement.id)  # type: ignore
        self.assertEqual(data["rubric"], self.rubric.id)  # type: ignore
        self.assertEqual(data["evaluator"], self.academic_supervisor.id)  # type: ignore
        self.assertEqual(data["total_score"], 85.0)  # type: ignore


class TestEvaluationViewSet(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="Test",
            last_name="User",
            role="academic_supervisor",
        )  # type: ignore
        self.client.force_authenticate(user=self.user)  # type: ignore

        self.institution = Institutions.objects.create(
            name="Test University", email_domain="test.edu"
        )
        self.department = Departments.objects.create(
            institution=self.institution, name="Engineering"
        )
        self.programme = Programmes.objects.create(
            department=self.department, name="Computer Science", level="BSc", duration_years=4
        )
        self.organization = Organizations.objects.create(
            name="Test Org",
            industry="Tech",
            city="Test City",
            address="123 Test St",
            contact_email="org@example.com",
            contact_phone="1234567890",
        )
        self.rubric = EvaluationRubrics.objects.create(
            institution=self.institution,
            programme=self.programme,
            name="Test Rubric",
            is_current=True,
        )
        self.placement = InternshipPlacements.objects.create(
            intern=self.user,
            institution=self.institution,
            programme=self.programme,
            organization=self.organization,
            workplace_supervisor=self.user,
            academic_supervisor=self.user,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            work_mode="On-site",
            internship_title="Software Engineering Intern",
            department_at_company="IT",
            status="active",
        )
        self.evaluation = Evaluations.objects.create(
            placement=self.placement, rubric=self.rubric, evaluator=self.user, total_score=85.0
        )

    def test_list_evaluations(self):
        response = self.client.get("/api/v1/evaluations/evaluations/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # type: ignore

    def test_retrieve_evaluation(self):
        response = self.client.get(f"/api/v1/evaluations/evaluations/{self.evaluation.id}/")  # type: ignore
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.evaluation.id)  # type: ignore

    def test_create_evaluation(self):
        response = self.client.post(
            "/api/v1/evaluations/evaluations/",
            {
                "placement": self.placement.id,  # type: ignore
                "rubric": self.rubric.id,  # type: ignore
                "evaluator": self.user.id,
                "total_score": 90.0,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total_score"], 90.0)  # type: ignore

    def test_update_evaluation(self):
        response = self.client.put(
            f"/api/v1/evaluations/evaluations/{self.evaluation.id}/",  # type: ignore
            {
                "placement": self.placement.id,  # type: ignore
                "rubric": self.rubric.id,  # type: ignore
                "evaluator": self.user.id,
                "total_score": 95.0,
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_score"], 95.0)  # type: ignore

    def test_delete_evaluation(self):
        response = self.client.delete(f"/api/v1/evaluations/evaluations/{self.evaluation.id}/")  # type: ignore
        self.assertEqual(response.status_code, 204)
