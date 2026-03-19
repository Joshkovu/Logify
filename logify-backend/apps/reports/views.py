import csv

from apps.logbook.models import WeeklyLogs
from django.http import HttpResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView, Response

from .models import InternshipReport

# Create your views here.


class WeeklyLogsReportAPIView(APIView):
    def generate_internship_report(self, student, report_type="summary"):
        logs = WeeklyLogs.objects.filter(placement__intern_id=student).order_by("week_number")
        if not logs.exists():
            raise NotFound("No logs found for the student")
        internship_start = logs.first().week_start_date if logs.first() else None  # type: ignore
        internship_end = logs.last().week_end_date if logs.last() else None  # type: ignore
        first_week = logs.first().week_number if logs.first() else None  # type: ignore
        last_week = logs.last().week_number if logs.last() else None  # type: ignore
        summary_stats = {
            "total_weeks": logs.count(),
            "first_week": first_week,
            "last_week": last_week,
        }
        report = InternshipReport.objects.create(
            student_id=student,
            internship_start=internship_start,
            internship_end=internship_end,
            logs="\n\n".join(
                [
                    f"Week {log.week_number}:\nActivities: {log.activities}\nChallenges: {log.challenges}\nLearnings: {log.learnings}"
                    for log in logs
                ]
            ),
            report_type=report_type,
            summary_stats=summary_stats,
        )
        return report

    def get(self, request, student_id):
        report_type = request.query_params.get("report_type")
        export = request.query_params.get("export")
        query = InternshipReport.objects.filter(student_id=student_id)
        if report_type:
            query = query.filter(report_type=report_type)
        report = query.order_by("-created_at").first()
        if not report:
            report = self.generate_internship_report(
                student_id, report_type=report_type or "summary"
            )

        data = {
            "report_id": report.id,  # type: ignore
            "student_id": report.student.id,  # type: ignore
            "internship_start": report.internship_start,
            "internship_end": report.internship_end,
            "logs": report.logs,
            "supervisor_comments": report.supervisor_comments,
            "report_type": report.report_type,
            "evaluation_score": report.evaluation_score,
            "placement_info": report.placement_info,
            "summary_stats": report.summary_stats,
            "created_at": report.created_at,
            "updated_at": report.updated_at,
        }

        if export == "csv":
            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = (
                f'attachment; filename="internship_report_{student_id}.csv"'
            )
            writer = csv.writer(response)
            writer.writerow(data.keys())
            writer.writerow([str(v) for v in data.values()])
            return response

        return Response(data)
