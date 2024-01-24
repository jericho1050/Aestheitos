from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

# Routes for our viewset (By convention we use the model's name)

user_router = DefaultRouter()
user_router.register(r'User', UserViewSet)

user_progress_router = DefaultRouter()
user_progress_router.register(r'UserProgress', UserProgressViewSet)

course_router = DefaultRouter()
course_router.register(r'Course', CourseViewSet)

course_content_router = DefaultRouter()
course_content_router.register(r'CourseContent', CourseContentViewSet)

course_comments_router = DefaultRouter()
course_comments_router.register(r'CourseComments', CourseCommentsViewSet)

enrollment_router = DefaultRouter()
enrollment_router.register(r'Enrollment', EnrollmentViewSet)

workouts_router = DefaultRouter()
workouts_router.register(r'Workouts', WorkoutsViewSet)

correct_exercise_form_router = DefaultRouter()
correct_exercise_form_router.register(r'CorrectExerciseForm', CorrectExerciseFormViewSet)

wrong_exercise_form_router = DefaultRouter()
wrong_exercise_form_router.register(r'WrongExerciseForm', WrongExerciseFormViewSet)

blog_router = DefaultRouter()
blog_router.register(r'Blog', BlogViewSet)

blog_comments_router = DefaultRouter()
blog_comments_router.register(r'BlogComments', BlogCommentsViewSet)


