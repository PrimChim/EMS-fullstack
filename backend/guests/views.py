from .serializers import GuestSerializer
from .models import Guest
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .utils import generate_guest_qr, send_guest_qr_email
# Create your views here.

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        guest = serializer.save()
        qr_file = generate_guest_qr(guest)
        send_guest_qr_email(guest, qr_file)
        
    @action(detail=False, methods=["get"], url_path="by-event/(?P<event_id>[^/.]+)")
    def by_event(self, request, event_id=None):
        guests = Guest.objects.filter(event_id=event_id)
        serializer = self.get_serializer(guests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="check-in")
    def check_in(self, request):
        guest_id = request.data.get("guest_id")
        event_id = request.data.get("event_id")
        email = request.data.get("email")

        if not guest_id or not event_id or not email:
            return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            guest = Guest.objects.get(
                id=guest_id,
                event_id=event_id,
                email=email
            )
        except Guest.DoesNotExist:
            return Response({"error": "Invalid QR code"}, status=status.HTTP_404_NOT_FOUND)

        if guest.check_in_time:
            return Response({"message": "Guest already checked in"}, status=status.HTTP_200_OK)

        guest.check_in_time = timezone.now()
        guest.save()

        return Response(
            {
                "message": "Check-in successful",
                "guest": GuestSerializer(
                    guest,
                    context={"request": request}
                ).data
            },
            status=status.HTTP_200_OK
        )
