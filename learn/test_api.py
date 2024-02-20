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

# Reference For APIClient testing
# https://www.django-rest-framework.org/api-guide/testing/#apiclient


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

    def test_retrieve_course_list(self):
        """
        Ensure we can retrieve the list of courses.
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

        # test update instance with unathenticated user
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

        # test update instance with valid fields and authenticated client
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

        # test update course with unauthenticated user
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

        # test update course with an authenticated client and invalid fields
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

        # test update course with an authenticated client and invalid course id
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

        # test update course with an authenticated client and valid fields
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

        # test delete course with unathenticated client
        response = self.unauthenticated_client.delete(
            reverse("learn:course-detail", args=[2])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # test delete course with authenticated client

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
        response_1 = client.get(reverse("learn:course-content", args=[2]))
        response_2 = client.get(reverse("learn:course-content", args=[1]))

        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertEqual(response_2.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_1.data["lecture"], self.content.lecture)
        self.assertEqual(response_1.data["overview"], self.content.overview)
        self.assertEqual(self.user, self.content.course.created_by)

    def test_create_course_content(self):
        # test create content with authenticated client
        response_1 = self.authenticated_client.post(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing post method",
                "weeks": 18,
            },
            format="json",
        )
        # test create content with unauthenticated client
        response_2 = self.unauthenticated_client.post(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing post method",
                "weeks": 18,
            },
            format="json",
        )

        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertEqual(response_1.data["overview"], "testing post method")
        self.assertEqual(response_1.data["lecture"], "https://www.youtube.com")
        self.assertEqual(response_1.data["weeks"], 18)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_course_content(self):
        # test update content with an authenticated client
        response_1 = self.authenticated_client.put(
            reverse("learn:course-content", args=[2]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )
        response_2 = self.unauthenticated_client.put(
            reverse("learn:course-content", args=[2]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )
        response_3 = self.authenticated_client.put(
            reverse("learn:course-content", args=[1]),
            {
                "lecture": "https://www.youtube.com",
                "overview": "testing Put method brah",
                "weeks": 69,
            },
            format="json",
        )

        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertEqual(response_1.data["overview"], "testing Put method brah")
        self.assertEqual(response_1.data["lecture"], "https://www.youtube.com")
        self.assertEqual(response_1.data["weeks"], 69)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)


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
        Ensure we can retreive the list of workouts
        """
        client = APIClient(enforce_csrf_checks=True)
        response_1 = client.get(reverse("learn:course-workout-list", args=[1]))
        response_2 = client.get(reverse("learn:course-workout-list", args=[2]))

        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response_2.status_code, status.HTTP_404_NOT_FOUND)
        self.assertListEqual(response_2.data, [])

    def test_create_workout(self):
        """
        Ensure we can create a new workout
        """
        # test create workout with an authenticated client
        response_1 = self.authenticated_client.post(
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
        # test create workout with an unatuhenticated client
        response_2 = self.unauthenticated_client.post(
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

        # test create workout with empty fields with an authenticated client
        response_3 = self.authenticated_client.post(
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

        # test create workout with invalid fields with an authenticated client
        response_4 = self.authenticated_client.post(
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

        self.assertEqual(response_1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_1.data["exercise"], "Reverse Plank bridge")
        self.assertEqual(
            response_1.data["demo"],
            "https://www.youtube.com/watch?v=tSvmWU-0Zo0&t=663s",
        )
        self.assertEqual(response_1.data["intensity"], "M")
        self.assertEqual(response_1.data["rest_time"], 1)
        self.assertEqual(response_1.data["sets"], 3)
        self.assertEqual(response_1.data["reps"], 60)
        self.assertEqual(response_1.data["excertion"], 8)

        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_4.status_code, status.HTTP_400_BAD_REQUEST)


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

        response_2 = client.get(
            reverse("learn:course-workout-detail", args=[4]),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertEqual(response_2.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_workout(self):
        """
        Ensure we can update a workout instance
        """

        # test update instance with an authenticated client
        response_1 = self.authenticated_client.put(
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
            format="json",
        )

        # test update instance with an unauthenticated client
        response_2 = self.unauthenticated_client.put(
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
            format="json",
        )

        # test update instance with an authenticated client and some invalid fields
        response_3 = self.authenticated_client.put(
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
            format="json",
        )

        # test update instance with an authenticated client and empty body
        response_4 = self.authenticated_client.put(
            reverse("learn:course-workout-detail", args=[1]), {}, format="json"
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
            "course": 1,
        }
        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response_1.data, dict)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_4.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_workout(self):
        """
        Ensure we can delete a workout instance
        """

        # test delete  with an unauthenticated client
        response1 = self.unauthenticated_client.delete(
            reverse("learn:course-workout-detail", args=[1])
        )

        # test delete request with an authenticated client
        response2 = self.authenticated_client.delete(
            reverse("learn:course-workout-detail", args=[1])
        )

        self.assertEqual(response2.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response1.status_code, status.HTTP_403_FORBIDDEN)


class CourseCommentListAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        self.course = Course.objects.create(title="test", created_by=self.user)
        self.course_2 = Course.objects.create(title="test_2", created_by=self.user)

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unathenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client_2.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unathenticated_client.force_authenticate(user=None)

    def test_retrieve_comment_list(self):
        """
        Ensure we can retrieve the list of comments for a course
        """
        self.authenticated_client.post(
            reverse("learn:course-comments", args=[1]),
            {"comment": "testing for retrieval"},
            format="json",
        )

        client = APIClient(enforce_csrf_checks=True)

        # test the first created course and retrieve it's comments with client
        response = self.authenticated_client.get(
            reverse("learn:course-comments", args=[1])
        )

        # test the second created course (which is empty) and retrieve it's comments with client
        response_2 = client.get(reverse("learn:course-comments", args=[2]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertIn("testing", response.data[0]["comment"])
        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertListEqual(response_2.data, [])

    def test_course_create_comment(self):
        """
        Ensure we can create a comment object
        """

        # test create comment with an authenticated client
        response = self.authenticated_client.post(
            reverse("learn:course-comments", args=[1]),
            {"comment": "testing authenticated client to comment"},
            format="json",
        )
        # test create comment with an unauthenticated client
        response_2 = self.unathenticated_client.post(
            reverse("learn:course-comments", args=[1]),
            {"comment": "testing unauthenticated client to comment"},
            format="json",
        )

        # test create comment with an authenticated client and invalid key or field
        response_3 = self.authenticated_client.post(
            reverse("learn:course-comments", args=[1]),
            {"wrongField": "testing authenticated client to comment"},
            format="json",
        )

        # test create comment with an authenticated client no.2 and have it reply to authenticated client no.1's comment
        response_4 = self.authenticated_client_2.post(
            reverse("learn:course-comments", args=[1]),
            {"comment": "testing authenticated client to comment", "parent_comment": 1},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["comment"], "testing authenticated client to comment"
        )
        self.assertEqual(response.data["comment_by"], self.user.id)
        self.assertIsNone(response.data["parent_comment"])
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_4.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_4.data["comment_by"], self.user_2.id)
        self.assertEqual(response_4.data["parent_comment"], response.data["id"])


class CourseCommentDetailAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        course = Course.objects.create(title="test", created_by=self.user_2)
        self.comment = CourseComments.objects.create(
            course=course, comment="to modify", comment_by=self.user
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_course_comment(self):
        """
        Ensure we can retrieve a comment instance
        """

        # test retrieve instance with an authenticated user
        response = self.authenticated_client.get(
            reverse("learn:course-comment", args=[1])
        )

        # test retrieve intsance that doesn't exist
        response_2 = self.unauthenticated_client.get(
            reverse("learn:course-comment", args=[3])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["comment_by"], self.user.id)
        self.assertIn("to modify", response.data["comment"])
        self.assertEqual(response_2.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_course_comment(self):
        """
        Ensure we can update a comment instance
        """

        # test update instance with an authenticated user's own comment
        response = self.authenticated_client.put(
            reverse("learn:course-comment", args=[1]),
            {"comment": "modified"},
            format="json",
        )

        # test update instance with an authenticated user's own comment and change comment by
        response_2 = self.authenticated_client.put(
            reverse("learn:course-comment", args=[1]),
            {"comment": "modified comment_by", "comment_by": 2},
            format="json",
        )

        # test update instance that doesn't exist
        response_3 = self.authenticated_client.put(
            reverse("learn:course-comment", args=[4]), {"comment": "idk"}, format="json"
        )

        # test update instance with an authenticated user's own comment and not put any field
        response_4 = self.authenticated_client.put(
            reverse("learn:course-comment", args=[1]), {}, format="json"
        )

        # test update instance with an authenticated user that DOESN'T own the comment
        response_5 = self.authenticated_client_2.put(
            reverse("learn:course-comment", args=[1]),
            {"comment": "modifiying"},
            format="json",
        )

        # test update instance with unathenticated user that DOESN'T own the comment
        response_6 = self.unauthenticated_client.put(
            reverse("learn:course-comment", args=[1]),
            {"comment": "modifiying"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("modified", response.data["comment"])
        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertEqual(response_2.data["comment_by"], self.user.id)
        self.assertNotEqual(response_2.data["comment_by"], self.user_2.id)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_5.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_6.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_course_comment(self):
        """
        Ensure we can delete a comment instance
        """

        # test delete instance with an unauthenticated user that DOESN'T own the comment
        response = self.unauthenticated_client.delete(
            reverse("learn:course-comment", args=[1])
        )

        # test delete instance with an authenticated user that DOESN'T own the comment
        response_2 = self.authenticated_client_2.delete(
            reverse("learn:course-comment", args=[1])
        )

        # test delete instance that doesn't exist
        response_3 = self.authenticated_client.delete(
            reverse("learn:course-comment", args=[5])
        )

        # test delete instance with an authenticated user that DOESN'T own the comment
        response_4 = self.authenticated_client.delete(
            reverse("learn:course-comment", args=[1])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_204_NO_CONTENT)


class CorrectExerciseFormListAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        course = Course.objects.create(title="test", created_by=self.user)
        workout = Workouts.objects.create(
            course=course,
            exercise="Regular dips",
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
        )
        CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="scapula retracted during eccentric",
            workout=workout,
        )
        CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="lean torso",
            workout=workout,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_correct_exercise_list(self):
        """
        Ensure we can retrieve the correct exercise list for a course.
        """
        client = APIClient()
        response = client.get(reverse("learn:correct-exercise-list", args=[1]))
        response_2 = client.get(reverse("learn:correct-exercise-list", args=[3]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertListEqual(response_2.data, [])

    def test_create_correct_exercise_demo(self):
        """
        Ensure we can create a correct exercise demo
        """

        # test create correct exercise demo with an authenticated client
        response = self.authenticated_client.post(
            reverse("learn:correct-exercise-list", args=[1]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "scapula depressed",
            },
            format="json",
        )

        # test create correct exercise demo with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.post(
            reverse("learn:correct-exercise-list", args=[1]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "idk don't be bad",
            },
            format="json",
        )

        # test create correct exercise demo that a workout instance doesn't exist
        response_3 = self.authenticated_client.post(
            reverse("learn:correct-exercise-list", args=[5]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "idk",
            },
            format="json",
        )

        # test create correct exercise demo with an unauthenticated client
        response_4 = self.unauthenticated_client.post(
            reverse("learn:correct-exercise-list", args=[1]),
            {"demo": "https://www.youtube.com/watchme", "description": "idk"},
        )

        # test create correct exercise demo with an empty field
        response_5 = self.authenticated_client.post(
            reverse("learn:correct-exercise-list", args=[1])
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("scapula", response.data["description"])
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_5.status_code, status.HTTP_400_BAD_REQUEST)


class CorrectExerciseFormDetailAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        course = Course.objects.create(title="test", created_by=self.user)
        workout = Workouts.objects.create(
            course=course,
            exercise="Regular dips",
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
        )
        CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="scapula retracted during eccentric",
            workout=workout,
        )
        CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="lean torso",
            workout=workout,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_correct_exercise_demo(self):
        """
        Ensure we can retrieve a correct exercise form instance
        """

        client = APIClient(enforce_csrf_checks=True)
        response = client.get(reverse("learn:correct-exercise-detail", args=[1]))
        response_2 = client.get(reverse("learn:correct-exercise-detail", args=[2]))
        response_3 = client.get(reverse("learn:correct-exercise-detail", args=[5]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_correct_exercise_demo(self):
        """
        Ensure we can update a correct exercise form instance
        """

        # test update instance with an authenticated client
        response = self.authenticated_client.put(
            reverse("learn:correct-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )

        # test update instance with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.put(
            reverse("learn:correct-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )

        # test update instance with an empty fields
        response_3 = self.authenticated_client.put(
            reverse("learn:correct-exercise-detail", args=[1])
        )

        # test update instance that doesn't exists
        response_4 = self.authenticated_client.put(
            reverse("learn:correct-exercise-detail", args=[5]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )
        # test update instance with an unathenticated client
        response_5 = self.unauthenticated_client.put(
            reverse("learn:correct-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_4.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_5.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_correct_exercise_demo(self):
        """
        Ensure we can delete a correct exercise form instance
        """

        # test delete instance with an unauthenticated client
        response = self.unauthenticated_client.delete(
            reverse("learn:correct-exercise-detail", args=[1])
        )

        # test delete instance with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.delete(
            reverse("learn:correct-exercise-detail", args=[1])
        )

        # test delete instance does NOT exist
        response_3 = self.unauthenticated_client.delete(
            reverse("learn:correct-exercise-detail", args=[5])
        )

        # test delete instance with an authenticated client
        response_4 = self.authenticated_client.delete(
            reverse("learn:correct-exercise-detail", args=[1])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_204_NO_CONTENT)


class WrongExerciseFormListAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        course = Course.objects.create(title="test", created_by=self.user)
        workout = Workouts.objects.create(
            course=course,
            exercise="Regular dips",
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
        )
        WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="shrugging",
            workout=workout,
        )
        WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="flared elbows",
            workout=workout,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_wrong_exercise_list(self):
        """
        Ensure we can retrieve the wrong exercise list for a course.
        """
        client = APIClient()
        response = client.get(reverse("learn:wrong-exercise-list", args=[1]))
        response_2 = client.get(reverse("learn:wrong-exercise-list", args=[3]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertListEqual(response_2.data, [])

    def test_create_wrong_exercise_demo(self):
        """
        Ensure we can create a wrong exercise demo
        """

        # test create wrong exercise demo with an authenticated client
        response = self.authenticated_client.post(
            reverse("learn:wrong-exercise-list", args=[1]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "scapula elevation",
            },
            format="json",
        )

        # test create wrong exercise demo with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.post(
            reverse("learn:wrong-exercise-list", args=[1]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "idk don't be bad",
            },
            format="json",
        )

        # test create wrong exercise demo that a workout instance doesn't exist
        response_3 = self.authenticated_client.post(
            reverse("learn:wrong-exercise-list", args=[5]),
            {
                "demo": "https://www.youtube.com/watch?v=-Djq3QihTyA",
                "description": "idk",
            },
            format="json",
        )

        # test create wrong exercise demo with an unauthenticated client
        response_4 = self.unauthenticated_client.post(
            reverse("learn:wrong-exercise-list", args=[1]),
            {"demo": "https://www.youtube.com/watchme", "description": "idk"},
        )

        # test create wrong exercise demo with an empty field
        response_5 = self.authenticated_client.post(
            reverse("learn:wrong-exercise-list", args=[1])
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("scapula", response.data["description"])
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_5.status_code, status.HTTP_400_BAD_REQUEST)


class WrongExerciseFormDetailAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="secret")
        self.user_2 = User.objects.create_user(username="testuser2", password="secret")
        course = Course.objects.create(title="test", created_by=self.user)
        workout = Workouts.objects.create(
            course=course,
            exercise="Regular dips",
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
        )
        WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="scapula protracted during eccentric",
            workout=workout,
        )
        WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=ZFBP4549A1s",
            description="upright body",
            workout=workout,
        )

        self.authenticated_client = APIClient(enforce_csrf_checks=True)
        self.authenticated_client_2 = APIClient(enforce_csrf_checks=True)
        self.unauthenticated_client = APIClient(enforce_csrf_checks=True)

        response = self.authenticated_client.post(
            reverse("learn:login"),
            {"username": "testuser", "password": "secret"},
            format="json",
        )
        response_2 = self.authenticated_client_2.post(
            reverse("learn:login"),
            {"username": "testuser2", "password": "secret"},
            format="json",
        )

        token = response.json()
        token_2 = response_2.json()

        self.authenticated_client.force_authenticate(user=self.user, token=token["jwt"])
        self.authenticated_client.force_authenticate(
            user=self.user_2, token=token_2["jwt"]
        )
        self.unauthenticated_client.force_authenticate(user=None)

    def test_retrieve_wrong_exercise_demo(self):
        """
        Ensure we can retrieve a wrong exercise form instance
        """

        client = APIClient(enforce_csrf_checks=True)
        response = client.get(reverse("learn:wrong-exercise-detail", args=[1]))
        response_2 = client.get(reverse("learn:wrong-exercise-detail", args=[2]))
        response_3 = client.get(reverse("learn:wrong-exercise-detail", args=[5]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertIn("youtube", response.data["demo"])
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_wrong_exercise_demo(self):
        """
        Ensure we can update a wrong exercise form instance
        """

        # test update instance with an authenticated client
        response = self.authenticated_client.put(
            reverse("learn:wrong-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )

        # test update instance with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.put(
            reverse("learn:wrong-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades up",
            },
            format="json",
        )

        # test update instance with an empty fields
        response_3 = self.authenticated_client.put(
            reverse("learn:wrong-exercise-detail", args=[1])
        )

        # test update instance that doesn't exists
        response_4 = self.authenticated_client.put(
            reverse("learn:wrong-exercise-detail", args=[5]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )
        # test update instance with an unathenticated client
        response_5 = self.unauthenticated_client.put(
            reverse("learn:wrong-exercise-detail", args=[1]),
            {
                "demo": "https://www.youtube.com/watchmebaby",
                "description": "shoulder blades down",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_4.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_5.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_wrong_exercise_demo(self):
        """
        Ensure we can delete a wrong exercise form instance
        """

        # test delete instance with an unauthenticated client
        response = self.unauthenticated_client.delete(
            reverse("learn:wrong-exercise-detail", args=[1])
        )

        # test delete instance with an authenticated client that DOESN'T own the course
        response_2 = self.authenticated_client_2.delete(
            reverse("learn:wrong-exercise-detail", args=[1])
        )

        # test delete instance does NOT exist
        response_3 = self.unauthenticated_client.delete(
            reverse("learn:wrong-exercise-detail", args=[5])
        )

        # test delete instance with an authenticated client
        response_4 = self.authenticated_client.delete(
            reverse("learn:wrong-exercise-detail", args=[1])
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_2.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_3.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response_4.status_code, status.HTTP_204_NO_CONTENT)
