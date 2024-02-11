from rest_framework.serializers import ModelSerializer

from .models import User, UserProgress, Course, CourseContent, CourseComments, Enrollment, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments

#  In Django, a serializer is a way to convert complex data types, like Django models, into Python native datatypes that can then be easily rendered into JSON, XML, or other content types. This process is called serialization.

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserProgressSerializer(ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'

class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['created_by']


class CourseContentSerializer(ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'
        read_only_fields = ['course']


class CourseCommentsSerializer(ModelSerializer):
    class Meta:
        model = CourseComments
        fields = '__all__'
        read_only_fields = ['course', 'comment_by']

class EnrollmentSerializer(ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class WorkoutsSerializer(ModelSerializer):
    class Meta:
        model = Workouts
        fields = '__all__'
        read_only_fields = ['course']

class CorrectExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = CorrectExerciseForm
        fields = '__all__'
        read_only_fields = ['workout']

class WrongExerciseFormSerializer(ModelSerializer):
    class Meta:
        model = WrongExerciseForm
        fields = '__all__'
        read_only_fields = ['workout']

class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'

class BlogCommentsSerializer(ModelSerializer):
    class Meta:
        model = BlogComments
        fields = '__all__'

