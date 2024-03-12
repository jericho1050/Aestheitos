from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from django.shortcuts import get_object_or_404
import inspect
from .models import *
from .helpers import is_valid_ownership

#  In Django, a serializer is a way to convert complex data types, like Django models, into Python native datatypes that can then be easily rendered into JSON, XML, or other content types. This process is called serialization.


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserProgressSerializer(ModelSerializer):
    class Meta:
        model = UserProgress
        fields = "__all__"
        read_only_fields = ["user", "course"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:

            if user != self.instance.user:
                raise AuthenticationFailed("Not allowed to modify")
            self.save()
            return

        course = get_object_or_404(Course, id=pk)
        enrolled = Enrollment.objects.filter(user=user, course=course)
        progress = UserProgress.objects.filter(user=user, course=pk)

        if not enrolled:
            raise AuthenticationFailed("Not allowed to create")
        if progress:
            raise AuthenticationFailed("already created one")

        self.save(user=user, course=course)


class CourseRatingSerializer(ModelSerializer):
    class Meta:
        model = CourseRating
        fields = "__all__"
        read_only_fields = ["user", "course"]

    def save_with_auth_user(self, user, pk, update=False):
        course = get_object_or_404(Course, id=pk)
        is_enrolled = Enrollment.objects.filter(user=user, course=course).exists()
        is_rated = CourseRating.objects.filter(user=user, course=course).exists()
        if not is_enrolled:
            raise AuthenticationFailed("not allowed to create")
        
        if is_rated:
            raise AuthenticationFailed("not allowed to create")
            

        self.save(user=user, course=course)


class CourseSerializer(ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ["created_by"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:

            if "status" in self.validated_data and not user.is_staff:
                raise AuthenticationFailed("Only staff can change the status")

            if not user.is_superuser and self.instance.created_by != user:
                raise AuthenticationFailed("Not allowed to modify")

            self.save()
            return
        self.save(created_by=user)

    def get_average_rating(self, obj) -> float:
        return obj.course_rating_average()


class CourseContentSerializer(ModelSerializer):
    class Meta:
        model = CourseContent
        fields = "__all__"
        read_only_fields = ["course"]

    def save_with_auth_user(self, user, pk, update=False):

        if self.instance.course.created_by != user:
            raise AuthenticationFailed("Not allowed to modify")
        self.save()


class CourseCommentsSerializer(ModelSerializer):
    class Meta:
        model = CourseComments
        fields = "__all__"
        read_only_fields = ["course", "comment_by"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:

            if self.instance.comment_by != user:
                raise AuthenticationFailed("Not allowed to modify comment")
            self.save()
            return

        course = get_object_or_404(Course, id=pk)
        self.save(course=course, comment_by=user)


class EnrollmentSerializer(ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"
        read_only_fields = ["user", "course"]

    def save_with_auth_user(self, user, pk):
        course = get_object_or_404(Course, id=pk)
        is_enrolled = Enrollment.objects.filter(user=user, course=course).exists()
        if is_valid_ownership(user, course.id):
            raise AuthenticationFailed("Not allowed to enroll in their own course")

        if is_enrolled:
            raise AuthenticationFailed("already enrolled")

        self.save(user=user, course=course)


class WorkoutsSerializer(ModelSerializer):
    class Meta:
        model = Workouts
        fields = "__all__"
        read_only_fields = ["course"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:
            if self.instance.course.created_by != user:
                raise AuthenticationFailed("Not allowed to modify")
            self.save()
            return

        course = get_object_or_404(Course, id=pk)
        if course.created_by != user:
            raise AuthenticationFailed("Not allowed to create")
        self.save(course=course)


class CorrectExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = CorrectExerciseForm
        fields = "__all__"
        read_only_fields = ["workout"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:
            if not is_valid_ownership(user, self.instance.workout.course.id):
                raise AuthenticationFailed("Not allowed to modify")
            self.save()
            return

        workout = get_object_or_404(Workouts, id=pk)
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to create")
        self.save(workout=workout)


class WrongExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = WrongExerciseForm
        fields = "__all__"
        read_only_fields = ["workout"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:
            if not is_valid_ownership(user, self.instance.workout.course.id):
                raise AuthenticationFailed("Not allowed to modify")
            self.save()
            return

        workout = get_object_or_404(Workouts, id=pk)
        if not is_valid_ownership(user, workout.course.id):
            raise AuthenticationFailed("Not allowed to create")
        self.save(workout=workout)


class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ["author"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:
            if self.instance.author != user:
                raise AuthenticationFailed("Not allowed to modify")
            self.save()
            return

        self.save(author=user)


class BlogCommentsSerializer(ModelSerializer):
    class Meta:
        model = BlogComments
        fields = "__all__"
        read_only_fields = ["blog", "comment_by"]

    def save_with_auth_user(self, user, pk, update=False):

        if update:
            if self.instance.comment_by != user:
                raise AuthenticationFailed("Not allowed to modify")
            self.save()

        blog = get_object_or_404(Blog, id=pk)
        self.save(blog=blog, comment_by=user)
