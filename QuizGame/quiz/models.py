from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


# Create your models here.
class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='quiz_users',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='quiz_users',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Questions(models.Model):
    category = models.CharField(max_length=64)
    correct_answer = models.CharField(max_length=64)
    question = models.CharField(max_length=200)
    type = models.CharField(max_length=64)

    def __str__(self):
        return f"Question {self.question} with correct answer: {self.correct_answer}"

class IncorrectAnswers(models.Model):
    question = models.ForeignKey(Questions,on_delete=models.CASCADE)
    answer = models.CharField(max_length=64)

class Score(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"User {self.user.username} has scored {self.score} points"


