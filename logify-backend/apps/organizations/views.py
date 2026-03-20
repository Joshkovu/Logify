from rest_framework import generics
from .models import Organizations
from .serializers import OrganizationSerializer


class OrganizationListCreateView(generics.ListCreateAPIView):
    queryset = Organizations.objects.all().order_by("id")
    serializer_class = OrganizationSerializer


class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organizations.objects.all()
    serializer_class = OrganizationSerializer

# Create your views here.