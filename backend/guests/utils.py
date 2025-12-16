import qrcode
import json
from io import BytesIO
from django.core.files.base import ContentFile

from django.core.mail import EmailMessage
from django.conf import settings

def generate_guest_qr(guest):
    data = {
        "guest_id": str(guest.id),
        "event_id": guest.event_id,
        "email": guest.email,
        "name": guest.name,
    }

    qr = qrcode.make(json.dumps(data))

    buffer = BytesIO()
    qr.save(buffer, format="PNG")

    return ContentFile(buffer.getvalue(), name=f"guest_{guest.id}.png")

def send_guest_qr_email(guest, qr_file):
    subject = f"Your QR Code for {guest.event.name}"
    body = f"""
Hi {guest.name},

You are registered for {guest.event.name}.

Please bring the attached QR code to the event for check-in.

Thank you!
"""

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[guest.email],
    )

    email.attach(qr_file.name, qr_file.read(), "image/png")
    email.send(fail_silently=False)
