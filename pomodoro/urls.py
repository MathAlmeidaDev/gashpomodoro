from django.urls import path, include
from rest_framework import routers
from .views import PomodoroSessionViewSet, user_stats

router = routers.DefaultRouter()
router.register(r'sessions', PomodoroSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/user_stats/<int:user_id>/', user_stats, name='user-stats'),
]
