from django.db import models

# Create your models here.


#  text id
#     text name
#     text short_name
#     text email_domain
#     boolean is_active
#     integer created_at
class Institutions(models.Model):
    name = models.CharField(max_length=255)
    email_domain = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# text id
#     text institution_id
#     text name
#     integer created_at


class Departments(models.Model):
    institution = models.ForeignKey(Institutions, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# programmes {
#     text id
#     text department_id
#     text name
#     text level
#     integer duration_years
#     integer created_at
# }


class Programmes(models.Model):
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=255)
    duration_years = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
