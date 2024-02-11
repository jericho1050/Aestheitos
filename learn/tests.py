from django.test import Client, TestCase
from django.urls import reverse
from .models import User, UserProgress, Course, CourseContent, CourseComments, Enrollment, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments
from datetime import datetime, date

# Create your tests here.
class CourseTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')

        self.course = Course.objects.create(
            title="Testing title",
            description="Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!",
            difficulty='BG',
            created_by= self.user
        )

    def test_course_creation(self):
        """ Test creating a course """
        course = Course.objects.get(title="Testing title")
        self.assertEqual(course.title, "Testing title")
        self.assertEqual(course.description, "Lorem ipsum dolor sit amet. Et illum dolores et numquam aperiam aut totam labore. Est tempora dicta At corrupti tenetur aut optio autem aut maiores distinctio ut sequi accusantium aut provident rerum et natus laudantium.Est nihil vero quo blanditiis doloribus et nesciunt rerum! Est magni accusantium non blanditiis doloribus eum molestias asperiores aut soluta odio id nisi velit!")
        self.assertEqual(course.difficulty, 'BG')
        self.assertEqual(course.created_by, self.user)
        self.assertIsNotNone(course.thumbnail) # since we allow it to be empty after all.
        self.assertIsNotNone(course.course_created)
        self.assertIsNotNone(course.course_updated)
        expected_choices = [
            ('BG', 'Beginner'),
            ('IN', 'Intermediate'),
            ('AD', 'Advanced'),
        ]
        self.assertEqual(course.DIFFICULTY_CHOICES, expected_choices)

    def test_course_timestamps(self):
        """ Testing timestamps of our course"""
        course = Course.objects.get(id=self.course.id)

        self.assertAlmostEqual(course.course_created.timestamp(), course.course_updated.timestamp(), delta=1)

        # Update the course
        course.difficulty = "IN"
        course.save()

        course.refresh_from_db()

        self.assertGreater(course.course_updated, course.course_created)


    def test_course_update(self):
        """ Test updating a course """
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
        self.user = User.objects.create(username='testuser')

        self.course = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty='BG',
            created_by=self.user
        )
        CourseContent.objects.create(
            lecture="https://www.youtube.com/watch?v=eTJQOi_xlTo&t=102s",
            overview="Testing the goal of this program is give you mobility and by end of it you'll be flexible as Yujiro Hanma or Baki Hanma",
            course = self.course,
            weeks = 18
        )

    def test_content_creation(self): 
        """Test when creating a content"""

        course = CourseContent.objects.get(id=self.course.id)
        self.assertEqual(course.course, self.course)
        self.assertEqual(course.lecture , "https://www.youtube.com/watch?v=eTJQOi_xlTo&t=102s")
        self.assertEqual(course.overview, "Testing the goal of this program is give you mobility and by end of it you'll be flexible as Yujiro Hanma or Baki Hanma")
        self.assertEqual(course.weeks, 18)
        
    def test_content_update(self):
        """ Tests when updating a content"""
        course = CourseContent.objects.get(id=self.course.id)
        course.lecture= "https://www.youtube.com/watch?v=Ru1hYrwCZJo&t=196s"
        course.overview= "Mobility exercise"
        course.weeks = 8
        self.assertEqual(course.course, self.course)
        self.assertEqual(course.lecture , "https://www.youtube.com/watch?v=Ru1hYrwCZJo&t=196s")
        self.assertEqual(course.overview, "Mobility exercise")
        self.assertEqual(course.weeks, 8)

    def test_content_deletion(self):
        course = CourseContent.objects.get(id=self.course.id)
        course.delete()

        with self.assertRaises(CourseContent.DoesNotExist):
            CourseContent.objects.get(id=self.course.id)

class CourseCommentsTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.course = Course.objects.create(
            title="Testing Content",
            description="Lorem ipsum",
            difficulty='BG',
            created_by=self.user
        )
        self.comment = CourseComments.objects.create(
            course=self.course,
            comment_by = self.user,
            comment = "WOW grape nice material"
        )

        self.reply_comment = CourseComments.objects.create(
            course=self.course,
            comment_by= self.user,
            comment= "This is a reply",
            parent_comment=self.comment 
        )

    def test_comment(self):
        comment = CourseComments.objects.get(course=self.course, comment="WOW grape nice material")
        self.assertEqual(comment.comment, "WOW grape nice material")
        self.assertEqual(comment.comment_by, self.user)
        self.assertIsNotNone(comment.comment_date)

    def test_comment_update_delete(self):
        """modified and deleted a comment"""
        comment = CourseComments.objects.get(course=self.course, parent_comment__isnull=True)

        comment.comment= "wow"
        self.assertNotEqual(comment, "WOW grape nice material")

        comment.delete()

        with self.assertRaises(CourseComments.DoesNotExist):
            CourseComments.objects.get(comment="wow")

    def test_comment_replies(self):
        replies = self.comment.replies.all()
        self.assertIn(self.reply_comment, replies)


class WorkoutsTestCase(TestCase):
    
    def setUp(self):
        self.user = User.objects.create(username='testuser')

        self.course = Course.objects.create(title='Test Course', created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise='Test Exercise',
            intensity='L',
            rest_time=60,
            sets=3,
            reps=10,
            excertion=5
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.course, self.course)
        self.assertEqual(self.workout.exercise, 'Test Exercise')
        self.assertEqual(self.workout.intensity, 'L')
        self.assertEqual(self.workout.rest_time, 60)
        self.assertEqual(self.workout.sets, 3)
        self.assertEqual(self.workout.reps, 10)
        self.assertEqual(self.workout.excertion, 5)

    def test_intensity_choices(self):
        choices = dict(Workouts.INTENSITY_CHOICES)
        self.assertEqual(choices['L'], 'Low')
        self.assertEqual(choices['M'], 'Medium')
        self.assertEqual(choices['H'], 'High')

    def test_excertion_choices(self):
        choices = dict(Workouts.EXCERTION_CHOICES)
        self.assertEqual(choices[1], '1')
        self.assertEqual(choices[10], '10')

class CorrectExerciseFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')

        self.course = Course.objects.create(title='Test Course', created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise='Push Up',
            intensity='M',
            rest_time=90,
            sets=3,
            reps=10,
            excertion=5
        )
        self.correct_exercise_form = CorrectExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=IODxDxX7oi4",
            workout=self.workout,
            description="Scapula position retracted"
        )

    def test_correct_exercise_form_creation(self):
        self.assertEqual(self.correct_exercise_form.demo, "https://www.youtube.com/watch?v=IODxDxX7oi4")
        self.assertEqual(self.correct_exercise_form.workout, self.workout)
        self.assertEqual(self.correct_exercise_form.description, "Scapula position retracted")


class WrongExerciseFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')

        self.course = Course.objects.create(title='Test Course', created_by=self.user)
        self.workout = Workouts.objects.create(
            course=self.course,
            exercise='Push Up',
            intensity='M',
            rest_time=90,
            sets=3,
            reps=10,
            excertion=5
        )
        self.wrong_exercise_form = WrongExerciseForm.objects.create(
            demo="https://www.youtube.com/watch?v=VJsayRzxq-U&t=113s",
            workout=self.workout,
            description="Flared elbow"
        )

    def test_wrong_exercise_form_creation(self):
        self.assertEqual(self.wrong_exercise_form.demo, "https://www.youtube.com/watch?v=VJsayRzxq-U&t=113s")
        self.assertEqual(self.wrong_exercise_form.workout, self.workout)
        self.assertEqual(self.wrong_exercise_form.description, "Flared elbow")

class EnrollmentTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.user2 = User.objects.create(username='testuser123')

        self.course = Course.objects.create(title='Test Course', created_by=self.user)
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
        self.user = User.objects.create(username='testuser')

        self.blog = Blog.objects.create(
            author=self.user,
            content="Testing",
            title="Noli me the test"
        )

    def test_author(self):
        self.assertEqual(self.blog.author, self.user)

    def test_content(self):
        self.assertEqual(self.blog.content, "Testing")

    def test_title(self):
        self.assertEqual(self.blog.title, "Noli me the test")
    
    def test_blog_creation_with_empty_content(self):
        blog = Blog.objects.create(
        author=self.user,
        content="",
        title="Empty Content Test"
        )
        self.assertEqual(blog.content, "")

    def test_blog_creation_with_long_title(self):
        long_title = "a" * 255
        blog = Blog.objects.create(
        author=self.user,
        content="Long title test",
        title=long_title
        )
        self.assertEqual(blog.title, long_title)

    def test_user_edit_blog(self):
        new_content = "Updated content"
        self.blog.content = new_content
        self.assertEqual(self.blog.content, new_content)

        
class BlogCommentsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')

        self.blog = Blog.objects.create(
            author=self.user,
            content="Testing",
            title="Test Blog"
        )
        self.comment = BlogComments.objects.create(
            blog=self.blog,
            comment='Test Comment',
            comment_by=self.user,
            parent_comment=None
        )
        self.reply_comment = BlogComments.objects.create(
            blog=self.blog,
            comment_by= self.user,
            comment= "This is a reply",
            parent_comment=self.comment 
        )

    def test_blog_comments(self):
        comment = BlogComments.objects.get(id=1)
        self.assertEqual(comment.blog.title, 'Test Blog')
        self.assertEqual(comment.comment, 'Test Comment')
        self.assertEqual(comment.comment_by.username, 'testuser')
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
