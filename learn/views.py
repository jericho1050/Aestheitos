from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import generics
from drf_spectacular.utils import extend_schema

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

# REFERENCE FOR MY documentation tool 
# https://drf-spectacular.readthedocs.io/en/latest/readme.html#license

# API calls (Class based functions)


class RegisterView(APIView):
    """Creates a newly Account"""
    @extend_schema(responses=UserSerializer)
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


class UserProgressList(generics.ListAPIView):
    """
    List all user's course progress.
    """
    # I decided for this class to be ListApiView and move the post/create to be at
    # UserProgress Detail because it's harder to implement POST here; we have to retrieve users's lists  of each course's progress
    # and create progress for each instance so our URL path here wouldn't align with our interest

    serializer_class = UserProgressSerializer
    queryset = UserProgress.objects.all()

    def get_queryset(self):
        user = user_authentication(self.request)
        return UserProgress.objects.filter(user=user)


class UserProgressDetail(
    CourseLookupMixin, UpdateAPIMixin, generics.RetrieveUpdateAPIView
):
    """
    Retrieve and update a user's progress instance
    """

    serializer_class = UserProgressSerializer
    queryset = UserProgress.objects.all()

    # added POST method (see explanation in UserProgressList)
    # create a new user's progress for a course
    def post(self, request, pk):
        user = user_authentication(request)
        serializer = UserProgressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save_with_auth_user(user, pk)
        return Response(serializer.data)


class CourseList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all courses, or create a new course.
    """

    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class CourseDetail(
    UpdateAPIMixin, DeleteAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update or delete a course instance
    """

    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseContentDetail(
    CourseLookupMixin, UpdateAPIMixin, generics.RetrieveUpdateAPIView
):
    """
    Create, retrieve or update a course's content instance
    """

    # Since the docs for generics have no GET, POST, and PUT for a Concrete View Class, we added a POST method for this class.

    queryset = CourseContent.objects.all()
    serializer_class = CourseContentSerializer

    def post(self, request, *args, **kwargs):

        course = get_object_or_404(Course, id=self.kwargs["pk"])
        user = user_authentication(request)
        if not is_valid_ownership(user, course.id):
            raise AuthenticationFailed("Not allowed to create")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data)


class WorkoutList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    Lists all workouts or create a new workout for a course instance.
    """

    queryset = Workouts.objects.all()
    serializer_class = WorkoutsSerializer

    def get_queryset(self):
        return Workouts.objects.filter(course=self.kwargs["pk"])


class WorkoutDetail(
    DeleteAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update or delete a workout instance
    """

    queryset = Workouts.objects.all()
    serializer_class = WorkoutsSerializer


class CourseCommentList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    Lists all comments or create a new comment for a course instance
    """

    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer

    def get_queryset(self):
        return CourseComments.objects.filter(course=self.kwargs["pk"])


class CourseCommentDetail(
    DeleteAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update or delete a comment instance
    """

    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer


class CorrectExerciseFormList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all correct exercises demos or create a new correct exercise demo for a workout instance
    """

    queryset = CorrectExerciseForm.objects.all()
    serializer_class = CorrectExerciseFormSerializer

    def get_queryset(self):
        return CorrectExerciseForm.objects.filter(workout=self.kwargs["pk"])


class CorrectExerciseFormDetail(
    DeleteAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update, delete a correct exercise form instance
    """

    queryset = CorrectExerciseForm.objects.all()
    serializer_class = CorrectExerciseFormSerializer


class WrongExerciseFormList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all wrong exercise demos or create a new wrong exercise demo for a workout instance
    """

    queryset = WrongExerciseForm.objects.all()
    serializer_class = WrongExerciseFormSerializer

    def get_queryset(self):
        return WrongExerciseForm.objects.filter(workout=self.kwargs["pk"])


class WrongExerciseFormDetail(
    DeleteAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update, delete a wrong exercise form instance
    """

    queryset = WrongExerciseForm.objects.all()
    serializer_class = WrongExerciseFormSerializer


class EnrollmentList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all course's enrollee or create a new enrollment instance
    """

    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        return Enrollment.objects.filter(course=self.kwargs["pk"])


class EnrollmentUserList(generics.ListAPIView):
    """
    List all a user's enrollment
    """

    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        user = user_authentication(self.request)
        return Enrollment.objects.filter(user=user)


class UnnrollmentView(DeleteAPIMixin, generics.DestroyAPIView):
    """
    Delete a enrollment instance (Unenrollment)
    """

    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class BlogList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all blog or create a new blog
    """

    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


class BlogDetail(UpdateAPIMixin, DeleteAPIMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update and delete a blog instance
    """

    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


class BlogCommentList(CreateAPIMixin, generics.ListCreateAPIView):
    """
    List all comments or create a new commnet for a blog instance
    """

    queryset = BlogComments.objects.all()
    serializer_class = BlogCommentsSerializer

    def get_queryset(self):
        return BlogComments.objects.filter(blog=self.kwargs["pk"])


class BlogCommentDetail(
    DeleteAPIMixin, UpdateAPIMixin, generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update and delete a comment instance
    """

    queryset = BlogComments.objects.all()
    serializer_class = BlogCommentsSerializer


class CourseRatingView(CreateAPIMixin, generics.CreateAPIView):
    """
    Create a new course's rating
    """

    queryset = CourseRating.objects.all()
    serializer_class = CourseRatingSerializer


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
