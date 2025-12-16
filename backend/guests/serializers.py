from rest_framework import serializers
from .models import Guest

class GuestSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.name', read_only=True)
    class Meta:
        model = Guest
        fields = ['url', 'id', 'name', 'event_name', 'event', 'email', 'rsvp_status', 'check_in_time']