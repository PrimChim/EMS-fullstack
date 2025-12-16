from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    host_username = serializers.CharField(source='host.username', read_only=True)
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['url', 'id', 'name', 'location', 'host_username', 'date', 'time', 'start_time', 'description', 'cover_image']
        
    def get_date(self, obj):
        # Returns date part as YYYY-MM-DD
        return obj.start_time.date()

    def get_time(self, obj):
        # Returns time part as HH:MM:SS
        return obj.start_time.time()