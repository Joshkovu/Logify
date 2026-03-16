from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import InternshipPlacementsViewSet

router = DefaultRouter()

router.register(r"placements", InternshipPlacementsViewSet, basename="placement")

urlpatterns = [path("", include(router.urls))]
