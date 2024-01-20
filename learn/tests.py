from django.test import TestCase
from .models import User, UserProgress, Course, CourseContent, CourseComments, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments

# Create your tests here.
class CourseTestCase(TestCase):

    def setUp(self):
        self.course = Course.objects.create(
            title="Testing title",
            description="Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!",
            difficulty='BG'
        )

    def test_creation(self):
        """ test creating a course """
        self.assertEqual(self.course.title, "Testing title")
        self.assertEqual(self.course.description, "Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!")
        self.assertEqual(self.course.difficulty, 'BG')
        self.assertIsNotNone(self.course.thumbnail)





