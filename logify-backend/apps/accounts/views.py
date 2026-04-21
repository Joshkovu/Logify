import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


def _user_data(user):
    return {
        "email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON payload."}, status=400)

    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return JsonResponse(
            {"detail": "Email and password are required."},
            status=400,
        )

    user = authenticate(request, username=email, password=password)
    if user is None or not user.is_active:
        return JsonResponse(
            {"detail": "Invalid email or password."},
            status=401,
        )

    login(request, user)
    return JsonResponse(_user_data(user), status=200)


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Logged out successfully."}, status=200)


@require_http_methods(["GET"])
def current_user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated."}, status=401)
    return JsonResponse(_user_data(request.user), status=200)
