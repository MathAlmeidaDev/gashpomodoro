from django.db import models
from django.contrib.auth.models import User

class PomodoroSession(models.Model):
    SESSION_TYPES = (
        ('focus', 'Foco'),
        ('short_break', 'Pausa Curta'),
        ('long_break', 'Pausa Longa'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='focus')
    duration = models.IntegerField()  # em minutos
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.session_type} - {"Concluído" if self.completed else "Incompleto"}'
