from rest_framework import permissions, viewsets

from .models import (
    EvaluationCriteria,
    EvaluationRubrics,
    Evaluations,
    EvaluationScores,
    FinalResults,
)
from .serializer import (
    EvaluationCriteriaSerializer,
    EvaluationRubricsSerializer,
    EvaluationScoresSerializer,
    EvaluationsSerializer,
    FinalResultsSerializer,
)


class IsAdminOrSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            "academic_supervisor",
            "internship_admin",
        ]


class EvaluationRubricsViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubrics.objects.all()
    serializer_class = EvaluationRubricsSerializer
    permission_classes = [IsAdminOrSupervisor]


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAdminOrSupervisor]


class EvaluationsViewSet(viewsets.ModelViewSet):
    queryset = Evaluations.objects.all()
    serializer_class = EvaluationsSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluationScoresViewSet(viewsets.ModelViewSet):
    queryset = EvaluationScores.objects.all()
    serializer_class = EvaluationScoresSerializer
    permission_classes = [permissions.IsAuthenticated]


class FinalResultsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FinalResults.objects.all()
    serializer_class = FinalResultsSerializer
    permission_classes = [permissions.IsAuthenticated]
