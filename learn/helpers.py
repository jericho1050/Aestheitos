import jwt, datetime
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from .models import User, Course
from .serializers import *


def instructor_authentication(request):
    """
    Validating token for authentication purposes.

    Checking if user is an instructor and logged in

    return user instance
    """

    token = request.COOKIES.get("jwt")

    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, key="secret", algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()

    # check if user is an instructor
    if not user.is_instructor:
        raise AuthenticationFailed(
            "Unauthenticated! non-instructors not allowed to POST/PUT/DELETE"
        )

    return user


def user_authentication(request):
    """
    Validating token for authentication purposes.
    we're only checking here if user is logged in

    return user instance
    """

    token = request.COOKIES.get("jwt")

    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, key="secret", algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()

    return user


def is_valid_ownership(user, course_id):
    """
    we check if this course belongs to the instructor(creator of the course)
    """

    # retrieve the course object or instance
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    if user != course.created_by:
        return False

    return True

class CreateAPIMixin():
    """
    A pre-defined process for a POST request method.
    This is used to provide a generic view, an additional method (POST) or override exisitng post method (Polymorphism).
    """

    def post(self, request, *args, **kwargs):       

        course = get_object_or_404(Course, id=self.kwargs['pk'])
        user = instructor_authentication(request)
        if not is_valid_ownership(user, course.id):
            raise AuthenticationFailed("Not allowed to create")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data)
    
class UpdateAPIMixin(UpdateModelMixin):
    """
    Apply this mixin for instances that reference to Course instance and requires authentication before updating (i.e CourseContentDetail and WorkoutDetail)
    Override exisitng update method (Polymorphism), 
    and to reduce repetitive task (we practice the DRY principle here).
    """
    
    def perform_update(self, serializer):
        user = instructor_authentication(self.request)
        if self.get_object().course.created_by != user:
            raise AuthenticationFailed("Not allowed to modify")
        serializer.save()

class DeleteAPIMixin(DestroyModelMixin):
    """
    Ovveride existing delete method (Polymorphism),
    and to reduce repetitive task (we practice the DRY principle here).
    Apply this mixin for instances that requires authentication before deleting (i.e CourseDetail and WorkoutDetail)
    """

    def perform_destroy(self, instance):
        user = instructor_authentication(self.request)
        if instance.created_by != user:
            raise AuthenticationFailed("Not allowed to delete!")
        instance.delete()

class SnippetLookupMixin():
    """
    Apply this mixin to a view that depends on the course_id for retrieving the snippet instance or object.
    """

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, course=self.kwargs["pk"])
        return obj
    
class CreateExerciseDemoAPIMixin(CreateModelMixin):
    """
    Apply this mixin to CorrectExerciseFormList and WrongExerciseFormList View. 
    This is to override the create method and reduce reptitive code (we practice the DRY principle here).
    """

    def perform_create(self, serializer):
        user = instructor_authentication(self.request)
        workout = get_object_or_404(Workouts, id=self.kwargs["pk"])
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to create demo")
        serializer.save(workout=workout)

class UpdateBlogAPIMixin(UpdateModelMixin):
    """
    Apply this mixin for blog instances that require authentication before updating (i.e., BlogDetail).

    Override exisitng update method (Polymorphism), 
    and to make our class's code cleaner
    """
    
    def perform_update(self, serializer):
        user = instructor_authentication(self.request)
        if self.get_object().author != user:
            raise AuthenticationFailed("Not allowed to modify")
        serializer.save()

class DeleteBlogAPIMixin(DestroyModelMixin):
    """
    Apply this mixin for blog instances that require authentication before deleting (i.e., BlogDetail).

    Ovveride existing delete method (Polymorphism),
    and to make our class's code cleaner
    """

    def perform_destroy(self, instance):
        user = instructor_authentication(self.request)
        if instance.author != user:
            raise AuthenticationFailed("Not allowed to delete!")
        instance.delete()