from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.urls import reverse
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .serializers import *
from .models import *
import jwt, datetime




# REFERENCE FOR Django API Authentication using JWT Tokens
# https://www.youtube.com/watch?v=PUzgZrS_piQ&list=LL&index=3&t=968s&ab_channel=ScalableScripts



 # API calls (Class based functions)

class RegisterView(APIView):

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class LoginView(APIView):
    
    
    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]

        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed("User not found!")
        
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")
        
        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm="HS256")
        
        response = Response()

        response.set_cookie(key="jwt", value=token, httponly=True)

        response.data = {
            "jwt": token
        }
        return response


# debugging/tesitng  purposes only
class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get("jwt")
        

        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        
        try: 
            payload = jwt.decode(token, key='secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class LogoutView(APIView):

    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }

        return response




# NOT USED BELOW

# def index(request):
#     pass

# def csrf(request):
#     return JsonResponse({'csrfToken': get_token(request)})

# # register account API
# @ensure_csrf_cookie
# def register(request):

#     if request.method != 'POST':
#         return JsonResponse({"error": "POST request required."}, status=400)
    
#     data = json.loads(request.body)
#     first_name = data.get("firstName")
#     last_name = data.get("lastName")
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")

#     # Attempt to create new user
#     try: 
#         user = User.objects.create(first_name=first_name, last_name=last_name, username=username, email=email)
#         user.set_password(password)
#         user.save()
#     except IntegrityError as e:
#         print(e)
#         return JsonResponse({"error": "Username already taken"}, status=400)
    

#     return JsonResponse({"Success": "Account Created"}, status=200)

# class UserView(APIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class UserProgressView(APIView):
#     queryset = UserProgress.objects.all()
#     serializer_class = UserProgressSerializer

# class CourseView(APIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class CourseContentView(APIView):
#     queryset = CourseContent.objects.all()
#     serializer_class = CourseContentSerializer

# class CourseCommentsView(APIView):
#     queryset = CourseComments.objects.all()
#     serializer_class = CourseCommentsSerializer

# class EnrollmentView(APIView):
#     queryset = Enrollment.objects.all()
#     serializer_class = EnrollmentSerializer

# class WorkoutsView(APIView):
#     queryset = Workouts.objects.all()
#     serializer_class = WorkoutsSerializer

# class CorrectExerciseFormView(APIView):
#     queryset = CorrectExerciseForm.objects.all()
#     serializer_class = CorrectExerciseFormSerializer

# class WrongExerciseFormView(APIView):
#     queryset = WrongExerciseForm.objects.all()
#     serializer_class = WrongExerciseFormSerializer

# class BlogView(APIView):
#     queryset = Blog.objects.all()
#     serializer_class = BlogSerializer

# class BlogCommentsView(APIView):
#     queryset = BlogComments.objects.all()
#     serializer_class = BlogCommentsSerializer


