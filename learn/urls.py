from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

app_name = "learn"
urlpatterns = [

    # API CALLS
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    # path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("user/courses/progress", UserProgressList.as_view(), name="progress-list"),
    path("user/course/<int:pk>/progress", UserProgressDetail.as_view(), name="progress-detail"),
    path('courses', CourseList.as_view(), name='course-list'),
    path('course/<int:pk>/rate', CourseRatingView.as_view(), name="course-rating"),
    path('course/<int:pk>', CourseDetail.as_view(), name='course-detail'),
    path('course/<int:pk>/course-content', CourseContentDetail.as_view(), name='course-content'),
    path('workouts/course/<int:pk>', WorkoutList.as_view(), name="course-workout-list"),
    path('workout/<int:pk>/course', WorkoutDetail.as_view(), name="course-workout-detail"),
    path('correct-exercises/course/workout/<int:pk>', CorrectExerciseFormList.as_view(), name="correct-exercise-list"),
    path('correct-exercise/<int:pk>/course/workout', CorrectExerciseFormDetail.as_view(), name="correct-exercise-detail"),
    path('wrong-exercises/course/workout/<int:pk>', WrongExerciseFormList.as_view(), name="wrong-exercise-list"),
    path('wrong-exercise/<int:pk>/course/workout', WrongExerciseFormDetail.as_view(), name="wrong-exercise-detail"),
    path('comments/course/<int:pk>', CourseCommentList.as_view(), name="course-comments"),
    path('comment/<int:pk>/course', CourseCommentDetail.as_view(), name="course-comment"),
    path('enrollment/course/<int:pk>', EnrollmentList.as_view(), name="enrollment-list"),
    path('enrollment/unenrollment/<int:pk>', UnnrollmentView.as_view(), name="unenrollment"),
    path('user/enrollments', EnrollmentUserList.as_view(), name="courses-enrolled"),
    path('blogs', BlogList.as_view(), name="blog-list"),
    path('blog/<int:pk>', BlogDetail.as_view(), name="blog-detail"),
    path('comments/blog/<int:pk>', BlogCommentList.as_view(), name="blog-comments"),
    path('comment/<int:pk>/blog', BlogCommentDetail.as_view(), name="blog-comment")


]


    