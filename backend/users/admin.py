from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display=('id', 'first_name', 'last_name', 'username', 'email', 'password', 'is_superuser')
    search_fields='username', 'first_name', 'id',
    list_filter='username', 'is_superuser', 'id',