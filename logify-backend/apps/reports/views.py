import csv

from apps.accounts.models import User
from apps.evaluations.models import FinalResults
from apps.logbook.models import SupervisorReviews, WeeklyLogs
from apps.placements.models import InternshipPlacements
from django.http import HttpResponse
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import InternshipReport
from .serializer import InternshipReportSerializer

# Create your views here.


class WeeklyLogsReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_accessible_placement(self, student_id, user):
        placements = InternshipPlacements.objects.filter(intern_id=student_id).order_by(
            "-end_date", "-created_at"
        )
        placement = placements.first()
        if placement is None:
            raise NotFound("No placement found for this student.")

        if user.is_superuser or user.role == User.INTERNSHIP_ADMIN or user.id == student_id:
            return placement
        if placement.academic_supervisor_id == user.id:
            return placement
        if placement.workplace_supervisor_id == user.id:
            return placement
        raise PermissionDenied("You do not have permission to view this report.")

    def generate_internship_report(self, student, report_type="summary"):
        placement = (
            InternshipPlacements.objects.filter(intern_id=student)
            .order_by("-end_date", "-created_at")
            .first()
        )
        if placement is None:
            raise NotFound("No placement found for the student.")

        logs = WeeklyLogs.objects.filter(placement=placement).order_by(
            "week_number", "week_start_date"
        )
        if not logs.exists():
            raise NotFound("No logs found for the student")

        internship_start = placement.start_date
        internship_end = placement.end_date
        first_log = logs.first()
        last_log = logs.last()
        reviews = SupervisorReviews.objects.filter(weekly_log__placement=placement).order_by(
            "reviewed_at"
        )
        status_counts = {
            "draft": logs.filter(status="draft").count(),
            "submitted": logs.filter(status="submitted").count(),
            "approved": logs.filter(status="approved").count(),
            "rejected": logs.filter(status="rejected").count(),
            "changes_requested": logs.filter(status="changes_requested").count(),
        }
        summary_stats = {
            "total_weeks": logs.count(),
            "first_week": first_log.week_number if first_log else None,
            "last_week": last_log.week_number if last_log else None,
            "approved_logs": status_counts["approved"],
            "pending_logs": status_counts["submitted"],
            "rejected_logs": status_counts["rejected"],
            "changes_requested_logs": status_counts["changes_requested"],
        }
        supervisor_comments = "\n\n".join(
            [
                f"Week {review.weekly_log.week_number} [{review.decision}]: {review.comment or 'No comment provided.'}"
                for review in reviews
            ]
        )
        logs_text = "\n\n".join(
            [
                (
                    f"Week {log.week_number}: ({log.week_start_date} to {log.week_end_date})\n"
                    f"Status: {log.status}\n"
                    f"Activities: {log.activities}\n"
                    f"Challenges: {log.challenges}\n"
                    f"Learnings: {log.learnings}"
                )
                for log in logs
            ]
        )
        placement_info = (
            f"Organization: {placement.organization.name}\n"
            f"Internship Title: {placement.internship_title}\n"
            f"Department: {placement.department_at_company}\n"
            f"Work Mode: {placement.work_mode}\n"
            f"Placement Status: {placement.status}\n"
            f"Academic Supervisor ID: {placement.academic_supervisor_id or 'Unassigned'}\n"
            f"Workplace Supervisor ID: {placement.workplace_supervisor_id or 'Unassigned'}"
        )

        report, _ = InternshipReport.objects.update_or_create(
            student_id=student,
            report_type=report_type,
            defaults={
                "internship_start": internship_start,
                "internship_end": internship_end,
                "logs": logs_text,
                "supervisor_comments": supervisor_comments,
                "placement_info": placement_info,
                "summary_stats": summary_stats,
                "evaluation_score": (
                    FinalResults.objects.filter(placement=placement)
                    .order_by("-computed_at")
                    .values_list("final_score", flat=True)
                    .first()
                ),
            },
        )
        return report

    def get(self, request, student_id):
        placement = self.get_accessible_placement(student_id, request.user)
        report_type = request.query_params.get("report_type") or (
            "final" if placement.status == "completed" else "summary"
        )
        valid_types = [choice[0] for choice in InternshipReport.REPORT_TYPE_CHOICES]
        if report_type not in valid_types:
            raise NotFound("Invalid report type.")

        export = request.query_params.get("export")
        report = self.generate_internship_report(student_id, report_type=report_type)
        serializer = InternshipReportSerializer(report)
        data = serializer.data
        data["student_id"] = report.student_id

        if export == "csv":
            csv_data = dict(data)
            csv_data["report_id"] = csv_data.pop("id", None)
            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = (
                f'attachment; filename="internship_report_{student_id}.csv"'
            )
            writer = csv.writer(response)
            writer.writerow(csv_data.keys())
            writer.writerow([str(v) for v in csv_data.values()])
            return response

        return Response(data)
