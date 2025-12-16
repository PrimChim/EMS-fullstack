from django.db import models
from users.models import Users

# Create your models here.
class Event(models.Model):
    host = models.ForeignKey(Users, on_delete=models.CASCADE)
    name = models.CharField()
    location = models.CharField()
    start_time = models.DateTimeField()
    description = models.TextField()
    cover_image = models.CharField()
    
    def __str__(self):
        return self.name