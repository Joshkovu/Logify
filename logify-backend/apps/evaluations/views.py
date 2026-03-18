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
    EvaluationScoresSerializer,
    EvaluationsSerializer,
    FinalResultsSerializer,
)
from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets

User = get_user_model()


class IsAdminOrSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.ACADEMIC_SUPERVISOR,  # type: ignore
            User.WORKPLACE_SUPERVISOR,  # type: ignore
        ]


class IsEvaluationWriteAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in [
            "academic_supervisor",
            "workplace_supervisor",
            "internship_admin",
        ]


class EvaluationRubricsViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubrics.objects.all()
    serializer_class = EvaluationRubricsSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAdminOrSupervisor]


class EvaluationsViewSet(viewsets.ModelViewSet):
    queryset = Evaluations.objects.none()
    serializer_class = EvaluationsSerializer
    permission_classes = [IsEvaluationWriteAllowed]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == "student":  # type: ignore
                return Evaluations.objects.filter(placement__student=user)
            elif user.role == "academic_supervisor":  # type: ignore
                return Evaluations.objects.filter(placement__academic_supervisor=user)
            elif user.role == "workplace_supervisor":  # type: ignore
                return Evaluations.objects.filter(placement__workplace_supervisor=user)
            elif user.role == "internship_admin":  # type: ignore
                return Evaluations.objects.all()
        return Evaluations.objects.none()


class EvaluationScoresViewSet(viewsets.ModelViewSet):
    queryset = EvaluationScores.objects.all()
    serializer_class = EvaluationScoresSerializer
    permission_classes = [IsAdminOrSupervisor]


class FinalResultsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FinalResults.objects.none()
    serializer_class = FinalResultsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return FinalResults.objects.none()
        user_role = getattr(user, "role", None)
        if user_role == "student":  # type: ignore
            return FinalResults.objects.filter(placement__student=user)
        elif user_role == "academic_supervisor":  # type: ignore
            return FinalResults.objects.filter(placement__academic_supervisor=user)
        elif user_role == "workplace_supervisor":  # type: ignore
            return FinalResults.objects.filter(placement__workplace_supervisor=user)
        elif user_role == "internship_admin":  # type: ignore
            return FinalResults.objects.all()
        return FinalResults.objects.none()
