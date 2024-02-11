from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import generics

# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *
from .models import *
import jwt, datetime
from .helpers import *


# REFERENCE FOR Django API Authentication using JWT Tokens
# https://www.youtube.com/watch?v=PUzgZrS_piQ&list=LL&index=3&t=968s&ab_channel=ScalableScripts

# REFERENCE FOR DRF Class Based functions etc
# https://www.django-rest-framework.org/tutorial/3-class-based-views/
# https://www.django-rest-framework.org/tutorial/3-class-based-views/#using-generic-class-based-views
# https://www.django-rest-framework.org/api-guide/generic-views/#generic-views

# API calls (Class based functions)


class RegisterView(APIView):
    """Creates a newly Account"""

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    """Log in and User validation then returns a JWT"""

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
            "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=1),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")

        response = Response()

        response.set_cookie(key="jwt", value=token, httponly=True)

        response.data = {"jwt": token}
        return response


class LogoutView(APIView):

    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "success"}

        return response
    

class CourseList(generics.ListCreateAPIView):
    """
    List all courses, or create a new course.
    """

    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def perform_create(self, serializer):
        user = authenticate_request(self.request)
        serializer.save(created_by=user)


class CourseDetail(UpdateAPIMixin, DeleteAPIMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a course instance
    """

    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseContentDetail(SnippetLookupMixin, CreateAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateAPIView):
    """
    Create, retrieve or update a course's content instance
    """

    # Since the docs for generics have no GET, POST, and PUT for a Concrete View Class, we added a POST method for this class.

    queryset = CourseContent.objects.all()
    serializer_class = CourseContentSerializer


class WorkoutList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    Lists all workouts or create a new workout for a course instance.
    """

    queryset = Workouts.objects.all()
    serializer_class = WorkoutsSerializer

    def get_queryset(self):
        return Workouts.objects.filter(course=self.kwargs["pk"])

    
class WorkoutDetail(UpdateAPIMixin, DeleteAPIMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a workout instance 
    """

    queryset = Workouts.objects.all()
    serializer_class = WorkoutsSerializer

class CourseCommentList(generics.ListCreateAPIView):
    """
    Lists all comments or create a new comment for a course instance
    """

    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer

    def get_queryset(self):
        return CourseComments.objects.filter(course=self.kwargs["pk"])
    
    def perform_create(self, serializer):
        user = is_user_authenticated(self.request)
        course = get_object_or_404(Course, id=self.kwargs["pk"])
        serializer.save(course=course, comment_by=user)


class CourseCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment instance
    """

    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer

    def perform_update(self, serializer):
        user = is_user_authenticated(self.request)
        comment = get_object_or_404(CourseComments, id=self.kwargs["pk"])
        if comment.comment_by != user:
            raise AuthenticationFailed("Not allowed to modify comment")
        serializer.save()

    def perform_destroy(self, instance):
        user = is_user_authenticated(self.request)
        comment = get_object_or_404(CourseComments, id=self.kwargs["pk"])
        if comment.comment_by != user:
            raise AuthenticationFailed("Not allowed to delete comment")
        instance.delete()

class CorrectExerciseFormList(CreateExerciseDemoAPIMixin, generics.ListCreateAPIView):
    """
    List all correct exercises demo or create a new correct exercise demo for a workout instance
    """
    
    queryset = CorrectExerciseForm.objects.all()
    serializer_class = CorrectExerciseFormSerializer

    def get_queryset(self):
        return CorrectExerciseForm.objects.filter(workout=self.kwargs["pk"])


class CorrectExerciseFormDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, delete a correct exercise form instance
    """

    queryset = CorrectExerciseForm.objects.all()
    serializer_class = CorrectExerciseFormSerializer

    def perform_update(self, serializer):
        user = authenticate_request(self.request)
        workout = get_object_or_404(CorrectExerciseForm, id=self.kwargs["pk"]).workout
        if not valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to modify demo")
        serializer.save()

    def perform_destroy(self, instance):
        user = authenticate_request(self.request)
        workout = get_object_or_404(CorrectExerciseForm, id=self.kwargs["pk"]).workout
        if not valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to delete demo")    
        instance.delete()    

class WrongExerciseFormList(CreateExerciseDemoAPIMixin, generics.ListCreateAPIView):
    """
    List all wrong exercise demo or create a new wrong exercise demo for a workout instance
    """

    queryset = WrongExerciseForm.objects.all()
    serializer_class = WrongExerciseFormSerializer

    def get_queryset(self):
        return WrongExerciseForm.objects.filter(workout=self.kwargs["pk"])
    
class WrongExerciseFormDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, delete a wrong exercise form instance
    """

    queryset = WrongExerciseForm.objects.all()
    serializer_class = WrongExerciseFormSerializer

    def perform_update(self, serializer):
        user = authenticate_request(self.request)
        workout = get_object_or_404(WrongExerciseForm, id=self.kwargs["pk"]).workout
        if not valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to modify demo")
        serializer.save()

    def perform_destroy(self, instance):
        user = authenticate_request(self.request)
        workout = get_object_or_404(WrongExerciseForm, id=self.kwargs["pk"]).workout
        if not valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to delete demo")    
        instance.delete()    


    
        




    



class WrongExerciseFormView(APIView):
    """The don'ts or an exercise's wrong form"""

    def get(self, request, workout_id):
        """GET request returns the wrong exercise of that workout"""

        # retrieve the workout object or instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found"}, status=404)

        exercise = WrongExerciseForm.objects.filter(workout=workout)

        # serializing model instance (i.e convert model instance into JSON)
        serializer = WrongExerciseFormSerializer(exercise, many=True)
        return Response(serializer.data)

    def post(self, request, workout_id):
        """POST request creates a demo and description of the wrong exercise"""

        user = authenticate_request(request)

        # retrieve the workout instance or object
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found!"}, status=404)

        exercise = request.data

        # authorize only the insturctor (creator of the workout demo)
        if user == workout.course.created_by:
            raise AuthenticationFailed("POST request not allowed to this workout")

        # deserializing fresh data (i.e convert data into model instance)
        serializer = WrongExerciseFormSerializer(data=exercise)
        serializer.is_valid(raise_exception=True)
        serializer.save(workout=workout)
        return Response(serializer.data)

    def put(self, request, workout_id):
        """PUT request updates the demo or description of the wrong exercise"""

        user = authenticate_request(request)

        update = request.data

        queryset = WrongExerciseForm.objects.filter(workout=workout_id)

        # retrieving the requested existing exercise object
        existing_exercise = None
        for obj in queryset:
            if update["id"] == obj.id:
                existing_exercise = obj
                break
        if existing_exercise is None:
            return Response({"error": "Exercuse not found!"}, status=404)

        # retrieve the workout object or instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found"}, status=404)

        # authorize only the insturctor (creator of the workout demo)
        if user != workout.course.created_by:
            raise AuthenticationFailed("POST request not allowed to this workout")

        # deserializing fresh data (i.e convert data into model instance)
        serializer = WrongExerciseFormSerializer(existing_exercise, data=update)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)




# debugging/tesitng purposes only for jwt token
class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, key="secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


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
