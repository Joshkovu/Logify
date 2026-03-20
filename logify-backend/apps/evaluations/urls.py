from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    EvaluationCriteriaViewSet,
    EvaluationRubricsViewSet,
    EvaluationScoresViewSet,
    EvaluationsViewSet,
    FinalResultsViewSet,
)

router = DefaultRouter()
router.register(r"rubrics", EvaluationRubricsViewSet, basename="rubrics")
router.register(r"criteria", EvaluationCriteriaViewSet, basename="criteria")
router.register(r"evaluations", EvaluationsViewSet, basename="evaluations")
router.register(r"scores", EvaluationScoresViewSet, basename="scores")
router.register(r"results", FinalResultsViewSet, basename="results")

urlpatterns = [
    path("", include(router.urls)),
]
