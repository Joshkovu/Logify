from functools import wraps

from apps.accounts.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .serializer import WeeklyLogsForm


# Create your views here.
def role_required(allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.role not in allowed_roles:
                return JsonResponse({"error": "Unauthorized"}, status=403)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator


@login_required(login_url="/accounts/login/")
@role_required([User.STUDENT])
def create_weekly_log(request):
    # Logic to create a weekly log
    if request.method == "POST":
        form = WeeklyLogsForm(request.POST)
        if form.is_valid():
            weekly_log = form.save(commit=False)
            weekly_log.placement = request.user.internship_placements.first()
            weekly_log.status = "draft"
            weekly_log.save()
            return JsonResponse({"success": "Weekly log created successfully"})
        else:
            return JsonResponse({"error": "Invalid data", "details": form.errors}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
