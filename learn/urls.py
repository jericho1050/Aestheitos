from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

app_name = "learn"
urlpatterns = [

    # API CALLS
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),


    path('courses', CourseList.as_view(), name='course-list'),
    path('course/<int:course_id>', CourseDetail.as_view(), name='course-detail'),
    path('course-content/<int:course_id>', CourseContentDetail.as_view(), name='CRU-course-content'),
    path('course/<int:course_id>/workouts', WorkoutList.as_view(), name="course-workouts"),
    path('course/workout/<int:course_id>', WorkoutDetail.as_view(), name="course-workout")
    







    # path("courses/<int:course_id>/content", CourseContentview.as_view(), name="course_content"),
    # path("courses/<int:course_id>/workout", WorkoutsView.as_view(), name="course_workout"),
    # path("workout/<int:workout_id>/correct_form", CorrectExerciseFormView.as_view(), name="correct_form"),
    # path("workout/<int:workout_id>/wrong_form", WrongExerciseFormView.as_view(), name="wrong_form" ),
    # path("courses/<int:course_id>/comments", CourseCommentsView.as_view(), name="course_comments")

]


