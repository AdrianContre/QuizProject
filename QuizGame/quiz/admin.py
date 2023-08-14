from django.contrib import admin
from .models import User,Questions,IncorrectAnswers,Score
# Register your models here.
admin.site.register(User)
admin.site.register(Questions)
admin.site.register(IncorrectAnswers)
admin.site.register(Score)