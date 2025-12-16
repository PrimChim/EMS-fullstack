from .serializers import EventSerializer
from .models import Event
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    # Automatically assign host from the logged-in user
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_events(self, request):
        events = Event.objects.filter(host=request.user)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)