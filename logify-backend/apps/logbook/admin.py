from django.contrib import admin

from .models import SupervisorReviews, WeeklyLogs, WeeklyLogStatusHistory

# Register your models here.
admin.site.register(WeeklyLogs)
admin.site.register(SupervisorReviews)
admin.site.register(WeeklyLogStatusHistory)
