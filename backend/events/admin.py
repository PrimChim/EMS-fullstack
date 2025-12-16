from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = 'name', 'host', 'location', 'start_time',
    list_filter = 'name', 'host__username', 'location', 'start_time',