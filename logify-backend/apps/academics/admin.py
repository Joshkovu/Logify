# from django.contrib import admin
from django.contrib import admin

from .models import Departments, Institutions, Programmes

# Register your models here.
admin.site.register(Institutions)
admin.site.register(Departments)
admin.site.register(Programmes)
