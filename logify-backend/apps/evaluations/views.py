from apps.accounts.access import get_user_college_id, get_user_institution_id
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
from django.db import models
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


class IsFinalResultsWriteAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return IsAcademicSupervisor().has_permission(
            request, view
        ) or IsInternshipAdmin().has_permission(request, view)


def get_admin_college_placement_filter(user):
    institution_id = get_user_institution_id(user)
    admin_college_id = get_user_college_id(user)
    if institution_id is None or admin_college_id is None:
        return None

    return {
        "placement__institution_id": institution_id,
        "college_id": admin_college_id,
    }


class EvaluationRubricsViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubrics.objects.all()
    serializer_class = EvaluationRubricsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = EvaluationRubrics.objects.all()
        institution_id = self.request.query_params.get("institution")
        programme_id = self.request.query_params.get("programme")
        if institution_id:
            queryset = queryset.filter(
                models.Q(institution_id=institution_id) | models.Q(institution__isnull=True)
            )
        if programme_id:
            queryset = queryset.filter(
                models.Q(programme_id=programme_id) | models.Q(programme__isnull=True)
            )
        return queryset


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.select_related("rubric").all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsEvaluationWriteAllowed]

    def get_queryset(self):
        queryset = self.queryset
        rubric_id = self.request.query_params.get("rubric")
        if rubric_id:
            queryset = queryset.filter(rubric_id=rubric_id)
        return queryset


class EvaluationsViewSet(viewsets.ModelViewSet):
    queryset = Evaluations.objects.none()
    serializer_class = EvaluationsSerializer
    permission_classes = [IsEvaluationWriteAllowed]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return Evaluations.objects.all()
            if user.role == User.STUDENT:  # type: ignore
                return Evaluations.objects.filter(placement__intern=user)
            elif user.role == User.ACADEMIC_SUPERVISOR:  # type: ignore
                college_id = get_user_college_id(user)
                if college_id is None:
                    return Evaluations.objects.none()
                return Evaluations.objects.filter(
                    placement__academic_supervisor=user,
                    college_id=college_id,
                )
            elif user.role == User.WORKPLACE_SUPERVISOR:  # type: ignore
                return Evaluations.objects.filter(placement__workplace_supervisor=user)
            elif user.role == User.INTERNSHIP_ADMIN:  # type: ignore
                placement_filter = get_admin_college_placement_filter(user)
                if placement_filter is None:
                    return Evaluations.objects.none()
                return Evaluations.objects.filter(**placement_filter)
        return Evaluations.objects.none()


class EvaluationScoresViewSet(viewsets.ModelViewSet):
    queryset = EvaluationScores.objects.select_related("evaluation", "criterion").all()
    serializer_class = EvaluationScoresSerializer
    permission_classes = [IsEvaluationWriteAllowed]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        if not user or not user.is_authenticated:
            return EvaluationScores.objects.none()
        if user.is_superuser:
            queryset = EvaluationScores.objects.all()
        elif user.role == User.STUDENT:
            queryset = queryset.filter(evaluation__placement__intern=user)
        elif user.role == User.ACADEMIC_SUPERVISOR:
            college_id = get_user_college_id(user)
            if college_id is None:
                return EvaluationScores.objects.none()
            queryset = queryset.filter(
                evaluation__placement__academic_supervisor=user,
                evaluation__college_id=college_id,
            )
        elif user.role == User.WORKPLACE_SUPERVISOR:
            queryset = queryset.filter(evaluation__placement__workplace_supervisor=user)
        elif user.role == User.INTERNSHIP_ADMIN:
            placement_filter = get_admin_college_placement_filter(user)
            if placement_filter is None:
                return EvaluationScores.objects.none()
            score_filter = {f"evaluation__{key}": value for key, value in placement_filter.items()}
            queryset = queryset.filter(**score_filter)
        else:
            return EvaluationScores.objects.none()

        evaluation_id = self.request.query_params.get("evaluation")
        if evaluation_id:
            queryset = queryset.filter(evaluation_id=evaluation_id)
        return queryset


class FinalResultsViewSet(viewsets.ModelViewSet):
    queryset = FinalResults.objects.none()
    serializer_class = FinalResultsSerializer
    permission_classes = [IsFinalResultsWriteAllowed]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return FinalResults.objects.none()
        if user.is_superuser:
            return FinalResults.objects.all()
        user_role = getattr(user, "role", None)
        if user_role == User.STUDENT:
            return FinalResults.objects.filter(placement__intern=user)
        elif user_role == User.ACADEMIC_SUPERVISOR:
            college_id = get_user_college_id(user)
            if college_id is None:
                return FinalResults.objects.none()
            return FinalResults.objects.filter(
                placement__academic_supervisor=user,
                college_id=college_id,
            )
        elif user_role == User.WORKPLACE_SUPERVISOR:
            return FinalResults.objects.filter(placement__workplace_supervisor=user)
        elif user_role == User.INTERNSHIP_ADMIN:
            placement_filter = get_admin_college_placement_filter(user)
            if placement_filter is None:
                return FinalResults.objects.none()
            return FinalResults.objects.filter(**placement_filter)
        return FinalResults.objects.none()
