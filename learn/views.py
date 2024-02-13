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


class CourseDetail(DeleteAPIMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a course instance
    """

    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def perform_update(self, serializer):
        user = authenticate_request(self.request)

        if 'status' in serializer.validated_data and not user.is_staff:
            raise AuthenticationFailed("Only staff can change the status")
        
        if self.get_object().created_by != user:
            raise AuthenticationFailed("Not allowed to modify")
        serializer.save()


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
        user = user_authentication(self.request)
        course = get_object_or_404(Course, id=self.kwargs["pk"])
        serializer.save(course=course, comment_by=user)


class CourseCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment instance
    """

    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer

    def perform_update(self, serializer):
        user = user_authentication(self.request)
        comment = get_object_or_404(CourseComments, id=self.kwargs["pk"])
        if comment.comment_by != user:
            raise AuthenticationFailed("Not allowed to modify comment")
        serializer.save()

    def perform_destroy(self, instance):
        user = user_authentication(self.request)
        comment = get_object_or_404(CourseComments, id=self.kwargs["pk"])
        if comment.comment_by != user:
            raise AuthenticationFailed("Not allowed to delete comment")
        instance.delete()

class CorrectExerciseFormList(CreateExerciseDemoAPIMixin, generics.ListCreateAPIView):
    """
    List all correct exercises demos or create a new correct exercise demo for a workout instance
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
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to modify demo")
        serializer.save()

    def perform_destroy(self, instance):
        user = authenticate_request(self.request)
        workout = get_object_or_404(CorrectExerciseForm, id=self.kwargs["pk"]).workout
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to delete demo")    
        instance.delete()    

class WrongExerciseFormList(CreateExerciseDemoAPIMixin, generics.ListCreateAPIView):
    """
    List all wrong exercise demos or create a new wrong exercise demo for a workout instance
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
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to modify demo")
        serializer.save()

    def perform_destroy(self, instance):
        user = authenticate_request(self.request)
        workout = get_object_or_404(WrongExerciseForm, id=self.kwargs["pk"]).workout
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to delete demo")    
        instance.delete()    


class EnrollmentList(generics.ListCreateAPIView):
    """
    List all course's enrollee or create a new enrollment instance
    """

    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    
    def get_queryset(self):
        return Enrollment.objects.filter(course=self.kwargs["pk"])
    
    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())
    #     count = queryset.count()
    #     return Response({'count': count})

    def perform_create(self, serializer):
        user = authenticate_request(self.request)
        if is_valid_ownership(user, self.kwargs['pk']):
            raise AuthenticationFailed("The Creator of the course is not allowed to enroll in their own")
        course = get_object_or_404(Course, id=self.kwargs['pk'])
        serializer.save(user=user, course=course)

class EnrollmentUserList(generics.ListAPIView):
    """
    List all user's enrollment
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        user = user_authentication(self.request)
        return Enrollment.objects.filter(user=user)

class UnnrollmentView(generics.DestroyAPIView):
    """
    Delete a enrollment instance (Unenrollment)
    """
    
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


    def perform_destroy(self, instance):
        user = user_authentication(self.request)
        if instance.user != user:
            raise AuthenticationFailed("Not allowed to Unenroll")
        instance.delete()

    

    # return user instace's enrolled courses
    # def get_queryset(self):
    #     user = user_authentication(self.request)
    #     return Enrollment.objects.filter(user=user)


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
