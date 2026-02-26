from django.db import models

# Create your models here.
# organizations {
#     text id
#     text name
#     text industry
#     text country
#     text city
#     text address
#     text contact_email
#     text contact_phone
#     integer created_at
# }


class Organizations(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name
