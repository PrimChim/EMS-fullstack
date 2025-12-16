from django.shortcuts import render
from .serializers import UserSerializer
from .models import Users
from rest_framework import viewsets, permissions
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]