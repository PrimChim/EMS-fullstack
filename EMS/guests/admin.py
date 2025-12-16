from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = 'id', 'event', 'name', 'email', 'rsvp_status', 'check_in_time',
    list_filter = 'name', 'rsvp_status', 'event__name'