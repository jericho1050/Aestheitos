from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponseRedirect, Http404, HttpResponse


# Create your views here.

def index(request):
    return HttpResponse("what's up ywa!")

