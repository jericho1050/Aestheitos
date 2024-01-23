from rest_framework.serializers import ModelSerializer
from ..models import User, UserProgress, Course, CourseContent, CourseComments, Enrollment, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserProgressSerializer(ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'

class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CourseContentSerializer(ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'

class CourseCommentsSerializer(ModelSerializer):
    class Meta:
        model = CourseComments
        fields = '__all__'

class EnrollmentSerializer(ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class WorkoutsSerializer(ModelSerializer):
    class Meta:
        model = Workouts
        fields = '__all__'

class CorrectExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = CorrectExerciseForm
        fields = '__all__'

class WrongExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = WrongExerciseForm
        fields = '__all__'

class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'

class BlogCommentsSerializer(ModelSerializer):
    class Meta:
        model = BlogComments
        fields = '__all__'

