from django.test import Client, TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from .models import (
    User,
    UserProgress,
    Course,
    CourseContent,
    CourseComments,
    Enrollment,
    Workouts,
    CorrectExerciseForm,
    WrongExerciseForm,
    Blog,
    BlogComments,
)
from datetime import datetime, date
from .serializers import WorkoutsSerializer

# Reference For APIClient testing
# https://www.django-rest-framework.org/api-guide/testing/#apiclient

# Create your tests here.


class UserProgressTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.course = Course.objects.create(
            title="Testing title",
            description="Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!",
            difficulty="BG",
            created_by=self.user,
        )

    def test_user_progress_creation(self):
        """Testing creating a progress"""
        progress = UserProgress.objects.create(user=self.user, course=self.course)
        progress.weeks_completed = 3
        self.assertIsNotNone(progress)
        self.assertEqual(3, progress.weeks_completed)
        self.assertFalse(0, progress.weeks_completed)


class CourseTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.course = Course.objects.create(
            title="Testing title",
            description="Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!",
            difficulty="BG",
            created_by=self.user,
        )

    def test_create_course(self):
        """Test creating a course"""
        course = Course.objects.get(title="Testing title")
        self.assertEqual(course.title, "Testing title")
        self.assertEqual(
            course.description,
            "Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!",
        )
        self.assertEqual(course.difficulty, "BG")
        self.assertEqual(course.created_by, self.user)
        self.assertIsNotNone(
            course.thumbnail
        )  # since we allow it to be empty after all.
        self.assertIsNotNone(course.course_created)
        self.assertIsNotNone(course.course_updated)
        expected_choices = [
            ("BG", "Beginner"),
            ("IN", "Intermediate"),
            ("AD", "Advanced"),
        ]
        self.assertEqual(course.DIFFICULTY_CHOICES, expected_choices)

    def test_course_timestamps(self):
        """Testing timestamps of our course"""
        course = Course.objects.get(id=self.course.id)

        self.assertAlmostEqual(
            course.course_created.timestamp(),
            course.course_updated.timestamp(),
            delta=1,
        )

        # Update the course
        course.difficulty = "IN"
        course.save()

        course.refresh_from_db()

        self.assertGreater(course.course_updated, course.course_created)

    def test_update_course(self):
        """Test updating a course"""
        test = Course.objects.get(title="Testing title")
        test.title = "New test title"
        test.description = "New test description"
        test.difficulty = "AD"
        test.save()

        self.assertNotEqual(test.title, self.course.title)
        self.assertNotEqual(test.description, self.course.description)
        self.assertNotEqual(test.difficulty, self.course.difficulty)

        self.assertEqual(test.title, "New test title")
        self.assertEqual(test.description, "New test description")
        self.assertEqual(test.difficulty, "AD")

    def test_course_deletion(self):
        course = Course.objects.get(title="Testing title")
        course.delete()

        with self.assertRaises(Course.DoesNotExist):
            Course.objects.get(title="Testing title")


class CourseContentTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.course = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty="BG",
            created_by=self.user,
        )
        CourseContent.objects.create(
            lecture="https://www.youtube.com/watch?v=eTJQOi_xlTo&t=102s",
            overview="Testing the goal of this program is give you mobility and by end of it you'll be flexible as Yujiro Hanma or Baki Hanma",
            course=self.course,
            weeks=18,
        )

    def test_create_content(self):
        """Test when creating a content"""

        course = CourseContent.objects.get(id=self.course.id)
        self.assertEqual(course.course, self.course)
        self.assertEqual(
            course.lecture, "https://www.youtube.com/watch?v=eTJQOi_xlTo&t=102s"
        )
        self.assertEqual(
            course.overview,
            "Testing the goal of this program is give you mobility and by end of it you'll be flexible as Yujiro Hanma or Baki Hanma",
        )
        self.assertEqual(course.weeks, 18)

    def test_update_content(self):
        """Tests when updating a content"""
        course = CourseContent.objects.get(id=self.course.id)
        course.lecture = "https://www.youtube.com/watch?v=Ru1hYrwCZJo&t=196s"
        course.overview = "Mobility exercise"
        course.weeks = 8
        self.assertEqual(course.course, self.course)
        self.assertEqual(
            course.lecture, "https://www.youtube.com/watch?v=Ru1hYrwCZJo&t=196s"
        )
        self.assertEqual(course.overview, "Mobility exercise")
        self.assertEqual(course.weeks, 8)

    def test_content_deletion(self):
        course = CourseContent.objects.get(id=self.course.id)
        course.delete()

        with self.assertRaises(CourseContent.DoesNotExist):
            CourseContent.objects.get(id=self.course.id)


class CourseCommentsTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.course = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty="BG",
            created_by=self.user,
        )
        self.comment = CourseComments.objects.create(
            course=self.course, comment_by=self.user, comment="WOW grape nice material"
        )

        self.reply_comment = CourseComments.objects.create(
            course=self.course,
            comment_by=self.user,
            comment="This is a reply",
            parent_comment=self.comment,
        )

    def test_comment(self):
        comment = CourseComments.objects.get(
            course=self.course, comment="WOW grape nice material"
        )
        self.assertEqual(comment.comment, "WOW grape nice material")
        self.assertEqual(comment.comment_by, self.user)
        self.assertIsNotNone(comment.comment_date)

    def test_comment_update_delete(self):
        """
        Ensure we can modify and delete a comment instance
        """
        comment = CourseComments.objects.get(
            course=self.course, parent_comment__isnull=True
        )

        comment.comment = "wow"
        self.assertNotEqual(comment, "WOW grape nice material")

        comment.delete()

        with self.assertRaises(CourseComments.DoesNotExist):
            CourseComments.objects.get(comment="wow")

    def test_comment_replies(self):
        replies = self.comment.replies.all()
        self.assertIn(self.reply_comment, replies)


class WorkoutsTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise="Test Exercise",
            intensity="L",
            rest_time=60,
            sets=3,
            reps=10,
            excertion=5,
        )

    def test_workout_creation(self):
        """
        Ensure we can create a new workout object
        """
        self.assertEqual(self.workout.course, self.course)
        self.assertEqual(self.workout.exercise, "Test Exercise")
        self.assertEqual(self.workout.intensity, "L")
        self.assertEqual(self.workout.rest_time, 60)
        self.assertEqual(self.workout.sets, 3)
        self.assertEqual(self.workout.reps, 10)
        self.assertEqual(self.workout.excertion, 5)

    def test_intensity_choices(self):
        choices = dict(Workouts.INTENSITY_CHOICES)
        self.assertEqual(choices["L"], "Low")
        self.assertEqual(choices["M"], "Medium")
        self.assertEqual(choices["H"], "High")

    def test_excertion_choices(self):
        choices = dict(Workouts.EXCERTION_CHOICES)
        self.assertEqual(choices[1], "1")
        self.assertEqual(choices[10], "10")


class CorrectExerciseFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise="Push Up",
            intensity="M",
            rest_time=90,
            sets=3,
            reps=10,
            excertion=5,
        )
        self.correct_exercise_form = CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=IODxDxX7oi4",
            workout=self.workout,
            description="Scapula position retracted",
        )

    def test_correct_exercise_form_creation(self):
        self.assertEqual(
            self.correct_exercise_form.demo,
            "https://www.youtube.com/watch?v=IODxDxX7oi4",
        )
        self.assertEqual(self.correct_exercise_form.workout, self.workout)
        self.assertEqual(
            self.correct_exercise_form.description, "Scapula position retracted"
        )


class WrongExerciseFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise="Push Up",
            intensity="M",
            rest_time=90,
            sets=3,
            reps=10,
            excertion=5,
        )
        self.wrong_exercise_form = WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=VJsayRzxq-U&t=113s",
            workout=self.workout,
            description="Flared elbow",
        )

    def test_wrong_exercise_form_creation(self):
        self.assertEqual(
            self.wrong_exercise_form.demo,
            "https://www.youtube.com/watch?v=VJsayRzxq-U&t=113s",
        )
        self.assertEqual(self.wrong_exercise_form.workout, self.workout)
        self.assertEqual(self.wrong_exercise_form.description, "Flared elbow")


class EnrollmentTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.user2 = User.objects.create(username="testuser123")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.enrollment = Enrollment.objects.create(user=self.user2, course=self.course)

    def test_user_enrollment(self):
        self.assertEqual(self.enrollment.user, self.user2)

    def test_course_enrollment(self):
        self.assertEqual(self.enrollment.course, self.course)

    def test_date_enrolled(self):
        self.assertIsInstance(self.enrollment.date_enrolled, datetime)

    def test_related_names(self):
        self.assertIn(self.enrollment, self.user2.enrollee.all())
        self.assertIn(self.enrollment, self.course.enrolled.all())


class BlogTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.blog = Blog.objects.create(
            author=self.user, content="Testing", title="Noli me the test"
        )

    def test_author(self):
        self.assertEqual(self.blog.author, self.user)

    def test_content(self):
        self.assertEqual(self.blog.content, "Testing")

    def test_title(self):
        self.assertEqual(self.blog.title, "Noli me the test")

    def test_blog_creation_with_empty_content(self):
        blog = Blog.objects.create(
            author=self.user, content="", title="Empty Content Test"
        )
        self.assertEqual(blog.content, "")

    def test_blog_creation_with_long_title(self):
        long_title = "a" * 255
        blog = Blog.objects.create(
            author=self.user, content="Long title test", title=long_title
        )
        self.assertEqual(blog.title, long_title)

    def test_user_edit_blog(self):
        new_content = "Updated content"
        self.blog.content = new_content
        self.assertEqual(self.blog.content, new_content)


class BlogCommentsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")

        self.blog = Blog.objects.create(
            author=self.user, content="Testing", title="Test Blog"
        )
        self.comment = BlogComments.objects.create(
            blog=self.blog,
            comment="Test Comment",
            comment_by=self.user,
            parent_comment=None,
        )
        self.reply_comment = BlogComments.objects.create(
            blog=self.blog,
            comment_by=self.user,
            comment="This is a reply",
            parent_comment=self.comment,
        )

    def test_blog_comments(self):
        comment = BlogComments.objects.get(id=1)
        self.assertEqual(comment.blog.title, "Test Blog")
        self.assertEqual(comment.comment, "Test Comment")
        self.assertEqual(comment.comment_by.username, "testuser")
        self.assertIsNone(comment.parent_comment)

    def test_blog_comments_related_names(self):
        comment = BlogComments.objects.get(id=1)

        blog = Blog.objects.get(id=1)
        user = User.objects.get(id=1)

        # Test related names
        self.assertEqual(blog.blog.count(), 2)
        self.assertEqual(user.commented_by.count(), 2)
        self.assertEqual(comment.blog_parent_comments.count(), 1)

    def test_comment_replies(self):
        replies = self.comment.blog_parent_comments.all()
        self.assertIn(self.reply_comment, replies)


# Client (REST API) Testing starts here
class RegisterAPITestCase(APITestCase):
    def test_create_account(self):
        """
        Ensure we can create a new account object.
        """

        url = reverse("learn:register")
        data = {
            "username": "testuser",
            "email": "testemail@gmail.com",
            "password": "secret",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "testuser")


class Login_LogoutAPITestCase(APITestCase):
    def setUp(self):
        User.objects.create_user(username="testuser", password="secret")

    def test_login(self):
        """
        Ensure that sucessfully logged in
        """
        client = APIClient()
        response1 = client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response2 = client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "wrongpass"},
            format="json",
        )
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIsNotNone(response1.data["jwt"])

    def test_logout(self):
        client = APIClient()
        response = client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CourseListAPITestCase(APITestCase):
    def setUp(self):
        user = User.objects.create_user(username="testuser", password="secret")
        Course.objects.create(
            title="set up",
            description="nothing",
            difficulty="BG",
            thumbnail="images/images/skillz.jpg",
            created_by=user,
        )
        Course.objects.create(
            title="set up2",
            description="nothing2",
            difficulty="BG",
            thumbnail="images/images/skillz.jpg",
            created_by=user,
        )
        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.unaunthenticated_client = APIClient(enforce_csrf_checks=True)
        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        token = response.json()
        self.authenticated_client.force_authenticate(user=user, token=token["jwt"])
        self.unaunthenticated_client.force_authenticate(user=None)

    def test_create_course(self):
        """
        Ensure we can create a new course
        """

        with open("images/images/skillz.jpg", "rb") as file:
            image = SimpleUploadedFile(
                "picture.jpg", file.read(), content_type="image/jpeg"
            )

        # test required fields
        response = self.authenticated_client.post(
            reverse("learn:course-list"),
            {
                "title": "test field required",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # test invalid thumbnail
        response = self.authenticated_client.post(
            reverse("learn:course-list"),
            {
                "title": "test difficulty repsonse and test thumbnail repsonse",
                "description": "testing thumbnail is not a valid file",
                "difficulty": "BG",
                "thumbnail": "/images/images/skillz.jpg",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # test put request with unathenticated user
        response = self.unaunthenticated_client.post(
            reverse("learn:course-list"),
            {
                "title": "test no cookie",
                "description": "not empty",
                "difficulty": "BG",
                "thumbnail": image,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # reset cursor for file reading of image
        image.seek(0)

        # test post request with valid fields and authenticated client
        response = self.authenticated_client.post(
            reverse("learn:course-list"),
            {
                "title": "test ok response",
                "description": "all fields properly filled",
                "difficulty": "BG",
                "thumbnail": image,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_course_list(self):
        """
        Ensure we can retrieve a list of course.
        """

        client = APIClient(enforce_csrf_checks=True)
        response = client.get(reverse("learn:course-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(
            Course.objects.get(title="set up").title, response.data[0]["title"]
        )
        self.assertEqual(
            Course.objects.get(title="set up2").title, response.data[1]["title"]
        )


class CourseDetailAPITestCase(APITestCase):

    def setUp(self):
        user = User.objects.create_user(username="testuser", password="secret")
        Course.objects.create(
            title="set up",
            description="nothing",
            difficulty="BG",
            thumbnail="images/images/skillz.jpg",
            created_by=user,
        )
        Course.objects.create(
            title="set up2",
            description="nothing2",
            difficulty="BG",
            thumbnail="images/images/skillz.jpg",
            created_by=user,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        token = response.json()

        self.authenticated_client.force_authenticate(user=user, token=token["jwt"])
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_course(self):
        """
        Ensure we can retreive a course instance
        """

        client = APIClient(enforce_csrf_checks=True)
        response1 = client.get(reverse("learn:course-detail", args=[1]))
        response2 = client.get(reverse("learn:course-detail", args=[2]))
        response3 = client.get(reverse("learn:course-detail", args=[3]))
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(response3.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_course(self):
        """
        Ensure we can update a course instance
        """

        # test put request with unauthenticated user
        response = self.unauthenticated_client.put(
            reverse("learn:course-detail", args=[1]),
            {
                "title": "test unauth",
                "description": "test unauth",
                "difficulty": "AD",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # test put request with authenticated client and invalid fields
        response = self.authenticated_client.put(
            reverse("learn:course-detail", args=[1]),
            {
                "title": "test changing title",
                "description": "",
                "difficulty": "abc",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # test put request with authenticated client and invalid course id
        response = self.authenticated_client.put(
            reverse("learn:course-detail", args=[3]),
            {
                "title": "test changing title",
                "description": "",
                "difficulty": "abc",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # test put request with authenticated client and valid fields
        response = self.authenticated_client.put(
            reverse("learn:course-detail", args=[1]),
            {
                "title": "changing title using put",
                "description": "nothing1",
                "difficulty": "AD",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "changing title using put")

    def test_delete_course(self):
        """
        Ensure we can delete a course instance
        """

        # test delete request with unathenticated client
        response = self.unauthenticated_client.delete(
            reverse("learn:course-detail", args=[2])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # test delete request with authenticated client

        response = self.authenticated_client.delete(
            reverse("learn:course-detail", args=[2])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class CourseContentDetailAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.course1 = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty="BG",
            created_by=self.user,
        )
        self.course2 = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty="BG",
            created_by=self.user,
        )
        self.content = CourseContent.objects.create(
            lecture="https://www.youtube.com/watch?v=eTJQOi_xlTo&t=102s",
            overview="API TESTING",
            course=self.course2,
            weeks=18,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"), {"username": "testuser", "password": "secret"}
        )
        token = response.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])

    def test_retrieve_course_content(self):
        client = APIClient(enforce_csrf_checks=True)
        response1 = client.get(reverse("learn:course-content", args=[2]))
        response2 = client.get(reverse("learn:course-content", args=[1]))

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response1.data["lecture"], self.content.lecture)
        self.assertEqual(response1.data["overview"], self.content.overview)
        self.assertEqual(self.user, self.content.course.created_by)

    def test_create_course_content(self):
        # test create content with authenticated client
        response1 = self.authenticated_client.post(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing post method",
                "weeks": 18,
            },
            format="json"
        )
        # test create content with unauthenticated client
        response2 = self.unauthenticated_client.post(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing post method",
                "weeks": 18,
            },
            format="json"
        )

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data["overview"], "testing post method")
        self.assertEqual(response1.data["lecture"], "https://www.youtube.com")
        self.assertEqual(response1.data["weeks"], 18)
        self.assertEqual(response2.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_course_content(self):
        # test update content with authenticated client
        response1 = self.authenticated_client.put(
            reverse("learn:course-content", args=[2]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )
        response2 = self.unauthenticated_client.put(
            reverse("learn:course-content", args=[2]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )
        response3 = self.authenticated_client.put(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data["overview"], "testing Put method brah")
        self.assertEqual(response1.data["lecture"], "https://www.youtube.com")
        self.assertEqual(response1.data["weeks"], 69)
        self.assertEqual(response2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response3.status_code, status.HTTP_404_NOT_FOUND)


class WorkoutListAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise="Test Exercse",
            intensity="L",
            rest_time=60,
            sets=3,
            reps=10,
            excertion=5,
        )
        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        token = response.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_workout_list(self):
        """
        Ensure we can retreive a list of workout
        """
        client = APIClient(enforce_csrf_checks=True)
        response1 = client.get(reverse("learn:course-workout-list", args=[1]))
        response2 = client.get(reverse("learn:course-workout-list", args=[2]))

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response2.status_code, status.HTTP_404_NOT_FOUND)
        self.assertListEqual(response2.data, [])

    def test_create_workout(self):
        """
        Ensure we can create a new workout
        """
        # test create workout with authenticated client
        response1 = self.authenticated_client.post(
            reverse("learn:course-workout-list", args=[1]),
            {
                "exercise": "Reverse Plank bridge",
                "demo": "https://www.youtube.com/watch?v=tSvmWU-0Zo0&t=663s",
                "intensity": "M",
                "rest_time": "1",
                "sets": "3",
                "reps": "60",
                "excertion": "8",
            },
            format="json",
        )
        # test create workout with unatuhenticated client
        response2 = self.unauthenticated_client.post(
            reverse("learn:course-workout-list", args=[1]),
            {
                "exercise": "Reverse Plank bridge",
                "demo": "https://www.youtube.com/watch?v=tSvmWU-0Zo0&t=663s",
                "intensity": "M",
                "rest_time": "1",
                "sets": "3",
                "reps": "60",
                "excertion": "8",
            },
            format="json",
        )

        # test create workout with empty fields with authenticated client
        response3 = self.authenticated_client.post(
            reverse("learn:course-workout-list", args=[1]),
            {
                "exercise": "",
                "demo": "",
                "intensity": "",
                "rest_time": "",
                "sets": "",
                "reps": "",
                "excertion": "",
            },
            format="json",
        )

        # test create workout with invalid fields with authenticated client
        response4 = self.authenticated_client.post(
            reverse("learn:course-workout-list", args=[1]),
            {
                "exercise": 1,
                "demo": "lmao",
                "intensity": 2,
                "rest_time": "lmao",
                "sets": 3,
                "reps": "lmao",
                "excertion": 5,
            },
            format="json",
        )

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data["exercise"], "Reverse Plank bridge")
        self.assertEqual(
            response1.data["demo"], "https://www.youtube.com/watch?v=tSvmWU-0Zo0&t=663s"
        )
        self.assertEqual(response1.data["intensity"], "M")
        self.assertEqual(response1.data["rest_time"], 1)
        self.assertEqual(response1.data["sets"], 3)
        self.assertEqual(response1.data["reps"], 60)
        self.assertEqual(response1.data["excertion"], 8)

        self.assertEqual(response2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)


class WorkoutDetailAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")

        self.course = Course.objects.create(title="Test Course", created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise="Test Exercse",
            intensity="L",
            rest_time=60,
            sets=3,
            reps=10,
            excertion=5,
        )
        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        token = response.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_workout(self):
        """
        Ensure we can retrieve a workout instance
        """
        client = APIClient(enforce_csrf_checks=True)
        response = client.get(
            reverse("learn:course-workout-detail", args=[1]),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)

    def test_update_workout(self):
        """
        Ensure we can create a workout instance
        """

        # test put request with authenticated client
        response1 = self.authenticated_client.put(
            reverse("learn:course-workout-detail", args=[1]),
            {
                "exercise": "Hollow body Plank",
                "demo": "https://www.youtube.com",
                "intensity": "M",
                "rest_time": 1,
                "sets": 3,
                "reps": 60,
                "excertion": 8,
            },
            format="json"
        )

        # test put request with unauthenticated client
        response2 = self.unauthenticated_client.put(
            reverse("learn:course-workout-detail", args=[1]),
            {
                "exercise": "Hollow body Plank",
                "demo": "https://www.youtube.com",
                "intensity": "M",
                "rest_time": 1,
                "sets": 3,
                "reps": 60,
                "excertion": 8,
            },
            format="json"
        )

        # test put request with authenticated client and some invalid fields
        response3 = self.authenticated_client.put(
            reverse("learn:course-workout-detail", args=[1]),
            {
                "exercise": 1,
                "demo": "https://www.youtube",
                "intensity": "Md",
                "rest_time": 1,
                "sets": 3,
                "reps": 60,
                "excertion": 8,
            },
            format="json"
        )

        # test put request with authenticated client and empty body
        response4 = self.authenticated_client.put(
            reverse("learn:course-workout-detail", args=[1]),
            {
            },
            format="json"
        )

        dict = {
                    "id": 1,
                    "exercise": "Hollow body Plank",
                    "demo": "https://www.youtube.com",
                    "intensity": "M",
                    "rest_time": 1,
                    "sets": 3,
                    "reps": 60,
                    "excertion": 8,
                    "course": 1
                }
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response1.data, dict)
        self.assertEqual(response2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_workout(self):
        """
        Ensure we can delete a workout instance
        """

        # test delete request with unauthenticated client
        response1 = self.unauthenticated_client.delete(reverse("learn:course-workout-detail", args=[1]))
        
        # test delete request with authenticated client
        response2 = self.authenticated_client.delete(reverse("learn:course-workout-detail", args=[1]))


        self.assertEqual(response2.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response1.status_code, status.HTTP_403_FORBIDDEN)


        




