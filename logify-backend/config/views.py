from django.http import JsonResponse


def api_root(request):
    """
    Root API endpoint that lists available API endpoints.
    """
    base_url = request.build_absolute_uri('/api/v1/')
    return JsonResponse({
        "message": "Welcome to Logify API",
        "version": "v1",
        "endpoints": {
            "logbook": f"{base_url}logbook/",
            "placements": f"{base_url}placements/",
            "reports": f"{base_url}reports/",
            "evaluations": f"{base_url}evaluations/",
            "registry": f"{base_url}registry/",
            "organizations": f"{base_url}organizations/",
            "academics": f"{base_url}academics/",
        }
    })