from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import PomodoroSession
from .serializers import PomodoroSessionSerializer


class PomodoroSessionViewSet(viewsets.ModelViewSet):
    queryset = PomodoroSession.objects.all()
    serializer_class = PomodoroSessionSerializer


# 🔥 Endpoint para estatísticas de ciclos
@api_view(['GET'])
def user_stats(request, user_id):
    sessions = PomodoroSession.objects.filter(user_id=user_id, completed=True)

    focus_sessions = sessions.filter(session_type='focus').count()
    full_cycles = focus_sessions // 4  # A cada 4 ciclos de foco, conta 1 completo

    return Response({
        'total_focus_sessions': focus_sessions,
        'total_full_cycles': full_cycles
    })
