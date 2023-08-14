from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json 
from django.core.paginator import Paginator
from django.template.defaulttags import register
import requests
from urllib.parse import unquote
import html

from .models import User,Questions,IncorrectAnswers,Score

# Create your views here.
@login_required(login_url="login")
def index(request):
    return render(request,"quiz/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "quiz/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "quiz/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "quiz/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "quiz/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "quiz/register.html")

def play(request):
    if request.method == 'POST':
        selected_mode = request.POST.get('modeValue')
    return render(request,"quiz/play.html",{
        "mode": selected_mode
    })

def saveQuestion(request) :
    if request.method == 'POST':
        data = request.body

        response = json.loads(data)
        try:
            q = Questions(category=response["category"],correct_answer=response["correct_answer"],question=response["question"],type=response["type"])
            i1 = IncorrectAnswers(question=q,answer=response["incorrect_answers"][0])
            i2 = IncorrectAnswers(question=q,answer=response["incorrect_answers"][1])
            i3 = IncorrectAnswers(question=q,answer=response["incorrect_answers"][2])
            q.save()
            i1.save()
            i2.save()
            i3.save()
            response_data = {
                    'status': 'success',
                    'message': 'Question saved successfully',
                    'pk': q.pk
                }
            return JsonResponse(response_data)

        except Exception as e:
            id = Questions.objects.get(category=response["category"],correct_answer=response["correct_answer"],question=response["question"],type=response["type"]).pk
            response_data = {
                'status': 'error',
                'message': str(e),
                'pk': id
            }
        return JsonResponse(response_data)

def getAnswer(request, id):    
    try:
        q = Questions.objects.get(pk=id)
        return JsonResponse({
            "correct_answer": q.correct_answer
        })
    except Questions.DoesNotExist:
        return JsonResponse({
            "error": "Question not found"
        })



def saveScore(request):
    result = None
    if request.method == "POST":
        id = request.user.id
        player = User.objects.get(pk=id)
        data = request.body
        response = json.loads(data)
        score = response["score"]
        try:
            s = Score.objects.get(user=player)
            if s.score > score:
                s.score = score
                s.save()
            result = "Saved after getting the Score object"
        except Score.DoesNotExist:
            s = Score(user=player,score=score)
            s.save()
            result = "Saved after creating the new object"

        return JsonResponse({
            "data": result
        })

def leaderboard(request):
    s = Score.objects.all().order_by("score")
    return render(request,"quiz/leaderboard.html",{
        "scores": s
    })


    
    

