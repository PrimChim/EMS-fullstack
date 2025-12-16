import uuid
from django.db import models
from events.models import Event

# Create your models here.
class Guest(models.Model):
    STATUS = [
        ('Y','Yes'),
        ('N','No'),
        ('M','Maybe')
    ]
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField()
    email = models.EmailField()
    rsvp_status = models.CharField(choices=STATUS)
    check_in_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} is guest of {self.event}"