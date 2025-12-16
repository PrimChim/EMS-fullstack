from .models import Users
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ['url', 'username', 'first_name', 'last_name', 'email']