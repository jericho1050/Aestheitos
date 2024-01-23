from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from .models import *

# Create your views here.

def index(request):
    pass


# register account API
@csrf_exempt
def register(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Attempt to create new user
    try: 
        user = User.objects.create(first_name=first_name, last_name=last_name, username=username, email=email)
        user.set_password(password)
        user.save()
    except IntegrityError as e:
        print(e)
        return JsonResponse({"error": "Username already taken"}, status=400)
    

    return JsonResponse({"Success": "Account Created"}, status=200)


