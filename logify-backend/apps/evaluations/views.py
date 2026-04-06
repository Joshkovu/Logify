from apps.accounts.models import User
from apps.accounts.permissions import (
    IsAcademicSupervisor,
    IsInternshipAdmin,
    IsWorkplaceSupervisor,
)
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
from rest_framework import permissions, viewsets


class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            IsAcademicSupervisor().has_permission(request, view)
            or IsWorkplaceSupervisor().has_permission(request, view)
            or IsInternshipAdmin().has_permission(request, view)
        )


class IsEvaluationWriteAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return IsSupervisorOrAdmin().has_permission(request, view)


class EvaluationRubricsViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubrics.objects.all()
    serializer_class = EvaluationRubricsSerializer
    permission_classes = [permissions.IsAuthenticated]


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsSupervisorOrAdmin]


class EvaluationsViewSet(viewsets.ModelViewSet):
    queryset = Evaluations.objects.none()
    serializer_class = EvaluationsSerializer
    permission_classes = [IsEvaluationWriteAllowed]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == User.STUDENT:  # type: ignore
                return Evaluations.objects.filter(placement__intern=user)
            elif user.role == User.ACADEMIC_SUPERVISOR:  # type: ignore
                return Evaluations.objects.filter(placement__academic_supervisor=user)
            elif user.role == User.WORKPLACE_SUPERVISOR:  # type: ignore
                return Evaluations.objects.filter(placement__workplace_supervisor=user)
            elif user.role == User.INTERNSHIP_ADMIN:  # type: ignore
                return Evaluations.objects.all()
        return Evaluations.objects.none()


class EvaluationScoresViewSet(viewsets.ModelViewSet):
    queryset = EvaluationScores.objects.all()
    serializer_class = EvaluationScoresSerializer
    permission_classes = [IsSupervisorOrAdmin]


class FinalResultsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FinalResults.objects.none()
    serializer_class = FinalResultsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return FinalResults.objects.none()
        user_role = getattr(user, "role", None)
        if user_role == User.STUDENT:
            return FinalResults.objects.filter(placement__intern=user)
        elif user_role == User.ACADEMIC_SUPERVISOR:
            return FinalResults.objects.filter(placement__academic_supervisor=user)
        elif user_role == User.WORKPLACE_SUPERVISOR:
            return FinalResults.objects.filter(placement__workplace_supervisor=user)
        elif user_role == User.INTERNSHIP_ADMIN:
            return FinalResults.objects.all()
        return FinalResults.objects.none()
