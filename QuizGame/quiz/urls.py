from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login",views.login_view,name="login"),
    path("register",views.register_view,name="register"),
    path("logout",views.logout_view,name="logout"),
    path("play",views.play,name="play"),
    path("saveQuestion", views.saveQuestion,name="saveQuestion"),
    path("get/<int:id>",views.getAnswer,name="getAnswer"),
    path("saveScore",views.saveScore,name="saveScore"),
]