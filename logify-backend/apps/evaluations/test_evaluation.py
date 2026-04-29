from datetime import date

from apps.academics.models import Colleges, Departments, Institutions, Programmes
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
from django.urls import reverse
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
        self.college = Colleges.objects.create(institution=self.institution, name="Engineering")
        self.department = Departments.objects.create(college=self.college, name="Engineering")
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
            end_date=date(2024, 1, 14),
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
        self.college = Colleges.objects.create(institution=self.institution, name="Engineering")
        self.department = Departments.objects.create(college=self.college, name="Engineering")
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

    def test_create_evaluation_uses_authenticated_user_as_evaluator(self):
        response = self.client.post(
            "/api/v1/evaluations/evaluations/",
            {
                "placement": self.placement.id,  # type: ignore
                "rubric": self.rubric.id,  # type: ignore
                "evaluator": 999999,
                "evaluator_type": "student",
                "total_score": 90.0,
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["evaluator"], self.user.id)  # type: ignore
        self.assertEqual(response.data["evaluator_type"], self.user.role)  # type: ignore


class TestEvaluationCriteriaViewSet(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.student = User.objects.create_user(
            email="student@example.com",
            password="testpassword",
            first_name="Student",
            last_name="User",
            role="student",
        )
        self.institution = Institutions.objects.create(
            name="Test University", email_domain="test.edu"
        )
        self.college = Colleges.objects.create(institution=self.institution, name="Engineering")
        self.department = Departments.objects.create(college=self.college, name="Engineering")
        self.programme = Programmes.objects.create(
            department=self.department, name="Computer Science", level="BSc", duration_years=4
        )

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

    def test_student_can_list_criteria(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get("/api/v1/evaluations/criteria/")
        self.assertEqual(response.status_code, 200)

    def test_student_cannot_create_criteria(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.post(
            "/api/v1/evaluations/criteria/",
            {
                "rubric": self.rubric.id,
                "name": "New Criterion",
                "Description": "New description",
                "mac_score": 100,
                "weight_percent": 10.0,
                "evaluator_type": "academic_supervisor",
            },
        )
        self.assertEqual(response.status_code, 403)


class TestEvaluationScoresViewSet(APITestCase):
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
        self.college = Colleges.objects.create(institution=self.institution, name="Engineering")
        self.department = Departments.objects.create(college=self.college, name="Engineering")
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

    def test_student_can_list_scores(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get("/api/v1/evaluations/scores/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # type: ignore

    def test_student_cannot_create_score(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.post(
            "/api/v1/evaluations/scores/",
            {
                "evaluation": self.evaluation.id,
                "criterion": self.criteria.id,
                "score": 8,
                "comment": "Comment",
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_scores_can_be_filtered_by_evaluation(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(f"/api/v1/evaluations/scores/?evaluation={self.evaluation.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # type: ignore

    def test_score_updates_recalculate_evaluation_total(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.patch(
            f"/api/v1/evaluations/scores/{self.score.id}/",
            {"score": 10},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.evaluation.refresh_from_db()
        self.assertEqual(self.evaluation.total_score, 50.0)


class TestFinalResultsViewSet(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.student = User.objects.create_user(
            email="student-final@example.com",
            password="testpassword",
            first_name="Student",
            last_name="User",
            role="student",
        )
        self.academic_supervisor = User.objects.create_user(
            email="academic-final@example.com",
            password="testpassword",
            first_name="Academic",
            last_name="Supervisor",
            role="academic_supervisor",
        )
        self.workplace_supervisor = User.objects.create_user(
            email="workplace-final@example.com",
            password="testpassword",
            first_name="Workplace",
            last_name="Supervisor",
            role="workplace_supervisor",
        )

        self.institution = Institutions.objects.create(
            name="Final Test University", email_domain="final.test.edu"
        )
        self.college = Colleges.objects.create(institution=self.institution, name="Engineering")
        self.department = Departments.objects.create(college=self.college, name="Engineering")
        self.programme = Programmes.objects.create(
            department=self.department, name="Computer Science", level="BSc", duration_years=4
        )
        self.organization = Organizations.objects.create(
            name="Final Test Org",
            industry="Tech",
            city="Test City",
            address="123 Test St",
            contact_email="org@example.com",
            contact_phone="1234567890",
        )
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
            status="completed",
        )
        self.rubric = EvaluationRubrics.objects.create(
            institution=self.institution,
            programme=self.programme,
            name="Final Rubric",
            is_current=True,
        )
        self.criteria = EvaluationCriteria.objects.create(
            rubric=self.rubric,
            name="Technical Delivery",
            description="Technical work quality",
            max_score=10,
            weight_percent=100.0,
            evaluator_type="academic_supervisor",
        )
        self.evaluation = Evaluations.objects.create(
            placement=self.placement,
            rubric=self.rubric,
            evaluator=self.academic_supervisor,
            evaluator_type="academic_supervisor",
            status="reviewed",
            total_score=0,
        )
        self.score = EvaluationScores.objects.create(
            evaluation=self.evaluation,
            criterion=self.criteria,
            score=8,
            comment="Strong performance.",
        )
        from apps.logbook.models import WeeklyLogs

        WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=1,
            week_start_date=date(2024, 1, 1),
            week_end_date=date(2024, 1, 7),
            activities="Week one work",
            challenges="None",
            learnings="APIs",
            status="approved",
        )
        WeeklyLogs.objects.create(
            placement=self.placement,
            week_number=2,
            week_start_date=date(2024, 1, 8),
            week_end_date=date(2024, 1, 14),
            activities="Week two work",
            challenges="Minor blockers",
            learnings="Testing",
            status="submitted",
        )

    def test_academic_supervisor_can_create_computed_final_result(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.post(
            reverse("results-list"),
            {
                "placement": self.placement.id,
                "rubric": self.rubric.id,
                "workplace_feedback": "Consistent contribution across the internship.",
                "remarks": "Ready for final academic sign-off.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["academic_score"], 80.0)  # type: ignore
        self.assertEqual(response.data["logbook_score"], 50.0)  # type: ignore
        self.assertEqual(response.data["final_score"], 71.0)  # type: ignore
        self.assertEqual(response.data["final_grade"], "B")  # type: ignore

    def test_logbook_score_counts_missing_expected_weeks(self):
        self.client.force_authenticate(user=self.academic_supervisor)
        self.placement.end_date = date(2024, 1, 28)
        self.placement.save(update_fields=["end_date"])

        response = self.client.post(
            reverse("results-list"),
            {
                "placement": self.placement.id,
                "rubric": self.rubric.id,
                "remarks": "Score should include missing logbook weeks.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["academic_score"], 80.0)  # type: ignore
        self.assertEqual(response.data["logbook_score"], 25.0)  # type: ignore
        self.assertEqual(response.data["final_score"], 63.5)  # type: ignore
        self.assertEqual(response.data["final_grade"], "C")  # type: ignore

    def test_workplace_supervisor_cannot_create_final_result(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        response = self.client.post(
            reverse("results-list"),
            {
                "placement": self.placement.id,
                "rubric": self.rubric.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)
