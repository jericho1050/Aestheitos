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
    path('course/<int:pk>', CourseDetail.as_view(), name='course-detail'),
    path('course/<int:pk>/course-content', CourseContentDetail.as_view(), name='CRU-course-content'),
    path('course/<int:pk>/workouts', WorkoutList.as_view(), name="course-workout-list"),
    path('course/workout/<int:pk>', WorkoutDetail.as_view(), name="course-workout-detail"),
    path('course/workout/<int:pk>/correct-exercises', CorrectExerciseFormList.as_view(), name="correct-exercise-list"),
    path('course/workout/correct-exercise/<int:pk>', CorrectExerciseFormDetail.as_view(), name="correct-exercise-detail"),
    path('course/workout/<int:pk>/wrong-exercises', WrongExerciseFormList.as_view(), name="wrong-exercise-list"),
    path('course/workout/wrong-exercise/<int:pk>', WrongExerciseFormDetail.as_view(), name="wrong-exercise-detail"),
    path('course/<int:pk>/comments', CourseCommentList.as_view(), name="course-comments"),
    path('course/comment/<int:pk>', CourseCommentDetail.as_view(), name="course-comment"),
    path('course/<int:pk>/enrollments', EnrollmentList.as_view(), name="enrollment-list"),
    path('course/unenrollment/<int:pk>', UnnrollmentView.as_view(), name="nenrollment"),
    path('user/enrollments', EnrollmentUserList.as_view(), name="courses-enrolled")






    # path("courses/<int:course_id>/content", CourseContentview.as_view(), name="course_content"),
    # path("courses/<int:course_id>/workout", WorkoutsView.as_view(), name="course_workout"),
    # path("workout/<int:workout_id>/correct_form", CorrectExerciseFormView.as_view(), name="correct_form"),
    # path("workout/<int:workout_id>/wrong_form", WrongExerciseFormView.as_view(), name="wrong_form" ),
    # path("courses/<int:course_id>/comments", CourseCommentsView.as_view(), name="course_comments")

]


