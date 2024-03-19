from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser
from rest_framework.exceptions import AuthenticationFailed
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Avg


# Create your models here.
class User(AbstractUser):
    profile_pic = models.ImageField(
        upload_to="images/", height_field=None, width_field=None, null=True, blank=True
    )
    is_instructor = models.BooleanField(default=False)

    def __str__(self):
        return f"( id: {self.pk} ) {self.username}"


class UserProgress(models.Model):
    """
    Represents the progress of a user in a course.
    """

    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="user_progress"
    )
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="course_progress"
    )
    weeks_completed = models.IntegerField(default=0, blank=True, null=True)


class CourseRating(models.Model):
    """
    Represents a course's rating
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_ratings")
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="course_rating")
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])



class Course(models.Model):
    """
    Represents a course in the learning platform.
    """

    STATUS_CHOICES = [
        ("P", "Pending"),
        ("A", "Approved"),
        ("R", "Rejected"),
    ]

    DIFFICULTY_CHOICES = [
        ("BG", "Beginner"),
        ("IN", "Intermediate"),
        ("AD", "Advanced"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to="images/", null=True, blank=True)
    difficulty = models.CharField(max_length=2, choices=DIFFICULTY_CHOICES)
    course_created = models.DateTimeField(auto_now_add=True)
    course_updated = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="creator"
    )
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="P")

    def __str__(self):
        return f"( id: {self.id}) Course: {self.title}. By {self.created_by.username}"

    def delete_with_auth_user(self, user):
        if self.created_by != user:
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


    def course_rating_average(self):
        return self.course_rating.aggregate(Avg('rating'))['rating__avg']



class CourseContent(models.Model):
    """
    Represents a course's overview content
    """

    lecture = models.URLField()
    overview = models.TextField()
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="course_content"
    )
    weeks = models.IntegerField()

    def __str__(self):
        return f"( pk: { self.pk } ) Course: {self.course.title}"
    
    
    
class Section(models.Model): 
    """
    Represents a section item
    """

    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="sections")
    title = models.CharField(max_length=200)

    def delete_with_auth_user(self, user):
        if self.course.created_by != user:
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()
        


class SectionItem(models.Model):
    """
    Represents a section's items
    """

    section = models.ForeignKey("Section", on_delete=models.CASCADE, related_name="contents")
    lecture = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=200)

    def delete_with_auth_user(self, user):
        from .helpers import is_valid_ownership

        if not is_valid_ownership(user, self.section.course.id):
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


class CourseComments(models.Model):
    """
    Represents a comment on a course.
    """

    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="comments"
    )
    comment_by = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="comment_comments"
    )
    comment = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )

    def __str__(self):
        return f" ( pk: { self.pk } ) Date: {self.comment_date}. Comment By: {self.comment_by}"

    def delete_with_auth_user(self, user):
        if self.comment_by != user:
            raise AuthenticationFailed("Not alowed to delete comment")
        self.delete()


class Workouts(models.Model):
    """
    Represent Workouts in a course or in a section
    """

    INTENSITY_CHOICES = [("L", "Low"), ("M", "Medium"), ("H", "High")]
    EXCERTION_CHOICES = [(i, str(i)) for i in range(1, 11)]


    section_item = models.ForeignKey(
        "SectionItem", on_delete=models.CASCADE, related_name="workouts"
    )
    exercise = models.CharField(max_length=100)
    demo = models.URLField()
    intensity = models.CharField(
        max_length=1, choices=INTENSITY_CHOICES, blank=True, null=True
    )
    rest_time = models.IntegerField(blank=True, null=True)
    sets = models.IntegerField(blank=True, null=True)
    reps = models.IntegerField(blank=True, null=True)
    excertion = models.IntegerField(choices=EXCERTION_CHOICES, blank=True, null=True)

    def __str__(self):
        return (
            f"( pk: { self.pk } ) Course: {self.section_item.section.course.title} Workout: {self.exercise}"
        )

    def delete_with_auth_user(self, user):
        from .helpers import is_valid_ownership
        if not is_valid_ownership(user, self.section_item.section.course.id):
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


class CorrectExerciseForm(models.Model):
    demo = models.URLField()
    workout = models.ForeignKey(
        "Workouts", on_delete=models.CASCADE, related_name="correct_exercise_form"
    )
    description = models.CharField(max_length=100)

    def __str__(self):
        return f"( pk: { self.pk } )Course: {self.workout.section_item.section.course.title}. Workout: {self.workout.exercise}"

    def delete_with_auth_user(self, user):
        from .helpers import is_valid_ownership

        if not is_valid_ownership(user, self.workout.section_item.section.course.id):
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


class WrongExerciseForm(models.Model):
    demo = models.URLField()
    workout = models.ForeignKey(
        "Workouts", on_delete=models.CASCADE, related_name="wrong_exercise_form"
    )
    description = models.CharField(max_length=100)

    def __str__(self):
        return f"( pk: { self.pk } ) Course: {self.workout.section_item.section.course.title} Workout: {self.workout.exercise}"

    def delete_with_auth_user(self, user):
        from .helpers import is_valid_ownership

        if not is_valid_ownership(user, self.workout.section_item.section.course.id):
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


class Enrollment(models.Model):
    """
    Bridge for a user to enroll a course
    """

    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="enrollee")
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="enrolled"
    )
    date_enrolled = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"( pk: { self.pk } ) {self.user.username} is enrolled to {self.course}"

    def delete_with_auth_user(self, user):
        if self.user != user:
            raise AuthenticationFailed("Not allowed to unenroll")
        self.delete()


class Blog(models.Model):
    """
    Represents a mini blog
    """

    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="author")
    content = models.TextField()
    title = models.CharField(max_length=200)
    blog_created = models.DateTimeField(auto_now_add=True)
    blog_updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f" ( pk: { self.pk } ) Title: {self.title}. By {self.author}"

    def delete_with_auth_user(self, user):
        if self.author != user:
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()


class BlogComments(models.Model):
    blog = models.ForeignKey("Blog", on_delete=models.CASCADE, related_name="blog")
    comment = models.TextField()
    comment_date = models.DateField(auto_now_add=True)
    comment_by = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="commented_by"
    )
    parent_comment = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="blog_parent_comments",
    )

    def __str__(self):
        return f"( pk: { self.pk } ) comment_by: { self.comment_by}"

    def delete_with_auth_user(self, user):
        if self.comment_by != user:
            raise AuthenticationFailed("Not allowed to delete")
        self.delete()
