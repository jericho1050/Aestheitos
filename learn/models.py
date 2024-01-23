from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    profile_pic = models.ImageField(upload_to='images/', height_field=None, width_field=None, null=True, blank=True)
    is_instructor = models.BooleanField(default=False)

class UserProgress(models.Model):
    """ Represents the progress of a user in a course. """
    progress = models.ForeignKey('User', on_delete=models.CASCADE, related_name="user_progress")
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="course_progress")
    weeks_completed = models.IntegerField(blank=True, null=True)

class Course(models.Model):
    """ Represents a course in the learning platform. """

    DIFFICULTY_CHOICES = [
        ('BG', 'Beginner'),
        ('IN', 'Intermediate'),
        ('AD', 'Advanced'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='images/', null=True, blank=True)
    difficulty = models.CharField(max_length=2, choices=DIFFICULTY_CHOICES)
    course_created = models.DateTimeField(auto_now_add=True)
    course_updated = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name="creator")

    def __str__(self):
        return f"Title: {self.title} Description: {self.description} Author: {self.created_by}"
    

class CourseContent(models.Model):
    """ Course's basic structure and content """

    lecture = models.URLField()
    overview = models.TextField()
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="course_content")
    weeks = models.IntegerField()

    def __str__(self):
        return f"Overview: {self.overview} Weeks: {self.weeks}"

class CourseComments(models.Model):
    """ Represents a comment on a course. """
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="comments")
    comment_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name="comment_comments")
    comment = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="course_parent_comments")

class Workouts(models.Model):
    """ Represent Workouts in a Course ."""

    INTENSITY_CHOICES = [
        ('L', 'Low' ),
        ('M', 'Medium'),
        ('H', 'High')
    ]
    EXCERTION_CHOICES = [(i, str(i)) for i in range(1, 11)]

    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="workouts")
    exercise = models.CharField(max_length=50)
    intensity = models.CharField(max_length=1, choices=INTENSITY_CHOICES)
    rest_time = models.IntegerField()
    sets = models.IntegerField()
    reps = models.IntegerField()
    excertion = models.IntegerField(choices=EXCERTION_CHOICES)

class CorrectExerciseForm(models.Model):
    demo = models.URLField()
    workout = models.ForeignKey('Workouts', on_delete=models.CASCADE, related_name="correct_exercise_form")
    description = models.CharField(max_length=69)

class WrongExerciseForm(models.Model):
    demo = models.URLField()
    workout = models.ForeignKey('Workouts', on_delete=models.CASCADE, related_name="wrong_exercise_form")
    description = models.CharField(max_length=69)

class Enrollment(models.Model):
    """ Bridge for a user to enroll a course"""
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="enrollee")
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="enrolled")
    date_enrolled = models.DateTimeField(auto_now_add=True)

class Blog(models.Model):
    """ Represents a mini blog"""
    author = models.ForeignKey('User', on_delete=models.CASCADE, related_name="author")
    content = models.TextField()
    title = models.CharField(max_length=50)

    def __str__(self):
        return f"Post: {self.title} Author: {self.author}"

class BlogComments(models.Model):
    blog = models.ForeignKey('Blog', on_delete=models.CASCADE, related_name="blog")
    comment = models.TextField(blank=True)
    comment_date = models.DateField(auto_now_add=True)
    comment_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name="commented_by")
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="blog_parent_comments")






