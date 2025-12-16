from django.contrib import admin
from django.urls import path, include

from rest_framework import routers

from users.views import UserViewSet
from events.views import EventViewSet
from guests.views import GuestViewSet

from auth.views import LogoutView
# from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'guests', GuestViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path("auth/logout/", LogoutView.as_view()),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
