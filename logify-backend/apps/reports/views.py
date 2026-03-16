from apps.logbook.models import WeeklyLogs
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView, Response

from .models import InternshipReport

# Create your views here.


class WeeklyLogsReportAPIView(APIView):
    def generate_internship_report(self, student):
        logs = WeeklyLogs.objects.filter(placement__intern_id=student).order_by("week_number")
        if not logs.exists():
            raise NotFound("No logs found for the student")
        report = InternshipReport.objects.create(
            student_id=student,
            internship_start=logs.first().week_start_date,  # type: ignore
            internship_end=logs.last().week_end_date,  # type: ignore
            logs="\n\n".join(
                [
                    f"Week {log.week_number}:\nActivities: {log.activities}\nChallenges: {log.challenges}\nLearnings: {log.learnings}"
                    for log in logs
                ]
            ),
        )
        return report

    def get(self, request, student_id):
        report = (
            InternshipReport.objects.filter(student_id=student_id).order_by("-created_at").first()
        )
        if not report:
            report = self.generate_internship_report(student_id)
        return Response(
            {
                "report_id": report.id,  # type: ignore
                "student_id": report.student.id,  # type: ignore
                "internship_start": report.internship_start,
                "internship_end": report.internship_end,
                "logs": report.logs,
                "supervisor_comments": report.supervisor_comments,
                "created_at": report.created_at,
                "updated_at": report.updated_at,
            }
        )
