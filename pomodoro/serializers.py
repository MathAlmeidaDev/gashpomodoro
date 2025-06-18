from rest_framework import serializers
from .models import PomodoroSession

class PomodoroSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PomodoroSession
        fields = ['id', 'user', 'session_type', 'duration', 'completed', 'created_at']
