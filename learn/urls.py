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
    path("courses/pending", PendingCoursesView.as_view(), name="pending_courses"),
    path("courses/list", CoursesView.as_view(), name="browse"),
    path("courses/content/<int:course_id>", CourseContentview.as_view(), name="course_content"),
    path("courses/workout/<int:course_id>", WorkoutsView.as_view(), name="course_workout"),
    path("courses/correct_form/<int:workout_id>", CorrectExerciseFormView.as_view(), name="correct_form"),
    path("courses/wrong_form/<int:workout_id>", WrongExerciseFormView.as_view(), name="wrong_form" ),
    path("courses/comments/<int:course_id>", CourseCommentsView.as_view(), name="course_comments")

]





# Routes for our API VIEWSETS (By convention we use the model's name)

# user_router = DefaultRouter()
# user_router.register(r'User', UserView)

# user_progress_router = DefaultRouter()
# user_progress_router.register(r'UserProgress', UserProgressView)

# course_router = DefaultRouter()
# course_router.register(r'Course', CourseView)

# course_content_router = DefaultRouter()
# course_content_router.register(r'CourseContent', CourseContentView)

# course_comments_router = DefaultRouter()
# course_comments_router.register(r'CourseComments', CourseCommentsView)

# enrollment_router = DefaultRouter()
# enrollment_router.register(r'Enrollment', EnrollmentView)

# workouts_router = DefaultRouter()
# workouts_router.register(r'Workouts', WorkoutsView)

# correct_exercise_form_router = DefaultRouter()
# correct_exercise_form_router.register(r'CorrectExerciseForm', CorrectExerciseFormView)

# wrong_exercise_form_router = DefaultRouter()
# wrong_exercise_form_router.register(r'WrongExerciseForm', WrongExerciseFormView)

# blog_router = DefaultRouter()
# blog_router.register(r'Blog', BlogView)

# blog_comments_router = DefaultRouter()
# blog_comments_router.register(r'BlogComments', BlogCommentsView)

