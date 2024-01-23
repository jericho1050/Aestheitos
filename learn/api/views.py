from rest_framework.viewsets import ModelViewSet
from ..models import User, UserProgress, Course, CourseContent, CourseComments, Enrollment, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments
from .serializers import (UserSerializer, UserProgressSerializer, CourseSerializer, CourseContentSerializer, CourseCommentsSerializer,
                           EnrollmentSerializer, WorkoutsSerializer, CorrectExerciseFormSerializer, 
                           WrongExerciseFormSerializer, BlogSerializer, BlogCommentsSerializer)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserProgressViewSet(ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseContentViewSet(ModelViewSet):
    queryset = CourseContent.objects.all()
    serializer_class = CourseContentSerializer

class CourseCommentsViewSet(ModelViewSet):
    queryset = CourseComments.objects.all()
    serializer_class = CourseCommentsSerializer

class EnrollmentViewSet(ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class WorkoutsViewSet(ModelViewSet):
    queryset = Workouts.objects.all()
    serializer_class = WorkoutsSerializer

class CorrectExerciseFormViewSet(ModelViewSet):
    queryset = CorrectExerciseForm.objects.all()
    serializer_class = CorrectExerciseFormSerializer

class WrongExerciseFormViewSet(ModelViewSet):
    queryset = WrongExerciseForm.objects.all()
    serializer_class = WrongExerciseFormSerializer

class BlogViewSet(ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class BlogCommentsViewSet(ModelViewSet):
    queryset = BlogComments.objects.all()
    serializer_class = BlogCommentsSerializer