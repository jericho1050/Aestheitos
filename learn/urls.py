from django.urls import path
from . import views

app_name = "learn"
urlpatterns = [
    path("", views.index, name="index"),
    path("csrf/", views.csrf, name="csrf"),

    # API CALLS
    path("register/", views.register, name="register")
]