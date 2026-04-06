from apps.accounts.permissions import IsInternshipAdmin
from rest_framework import generics, permissions

from .models import Organizations
from .serializers import OrganizationSerializer


class OrganizationListCreateView(generics.ListCreateAPIView):
    queryset = Organizations.objects.all().order_by("id")
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsInternshipAdmin()]
        return [permissions.IsAuthenticated()]


class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organizations.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsInternshipAdmin()]


# Create your views here.
