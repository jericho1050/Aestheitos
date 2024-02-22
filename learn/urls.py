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
    path("user/course/<int:pk>/progress-view", UserProgressView.as_view(), name="progress-create"),
    path("user/courses/progress", UserProgressList.as_view(), name="progress-list"),
    path("user/course/<int:pk>/progress", UserProgressDetail.as_view(), name="progress-detail"),
    path('courses', CourseList.as_view(), name='course-list'),
    path('course/<int:pk>/rate', CourseRatingView.as_view(), name="course-rating"),
    path('course/<int:pk>', CourseDetail.as_view(), name='course-detail'),
    path('course/<int:pk>/course-content', CourseContentDetail.as_view(), name='course-content'),
    path('course/<int:pk>/workouts', WorkoutList.as_view(), name="course-workout-list"),
    path('course/workout/<int:pk>', WorkoutDetail.as_view(), name="course-workout-detail"),
    path('course/workout/<int:pk>/correct-exercises', CorrectExerciseFormList.as_view(), name="correct-exercise-list"),
    path('course/workout/correct-exercise/<int:pk>', CorrectExerciseFormDetail.as_view(), name="correct-exercise-detail"),
    path('course/workout/<int:pk>/wrong-exercises', WrongExerciseFormList.as_view(), name="wrong-exercise-list"),
    path('course/workout/wrong-exercise/<int:pk>', WrongExerciseFormDetail.as_view(), name="wrong-exercise-detail"),
    path('course/<int:pk>/comments', CourseCommentList.as_view(), name="course-comments"),
    path('course/comment/<int:pk>', CourseCommentDetail.as_view(), name="course-comment"),
    path('course/<int:pk>/enrollments', EnrollmentList.as_view(), name="enrollment-list"),
    path('course/unenrollment/<int:pk>', UnnrollmentView.as_view(), name="unenrollment"),
    path('user/enrollments', EnrollmentUserList.as_view(), name="courses-enrolled"),
    path('blogs', BlogList.as_view(), name="blog-list"),
    path('blog/<int:pk>', BlogDetail.as_view(), name="blog-detail"),
    path('blog/<int:pk>/comments', BlogCommentList.as_view(), name="blog-comments"),
    path('blog/comment/<int:pk>', BlogCommentDetail.as_view(), name="blog-comment")


]


    