from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *
from .models import *
import jwt, datetime
from .helpers import *


# REFERENCE FOR Django API Authentication using JWT Tokens
# https://www.youtube.com/watch?v=PUzgZrS_piQ&list=LL&index=3&t=968s&ab_channel=ScalableScripts

# REFERENCE FOR DRF Class Based functions etc
# https://www.django-rest-framework.org/tutorial/3-class-based-views/


# API calls (Class based functions)


class RegisterView(APIView):
    """Creates a newly Account"""

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    """Log in and User validation then returns a JWT"""

    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]

        user = User.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")

        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=1),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")

        response = Response()

        response.set_cookie(key="jwt", value=token, httponly=True)

        response.data = {"jwt": token}
        return response


class LogoutView(APIView):

    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "success"}

        return response


class PendingCoursesView(APIView):

    def get(self, request):
        """returns all pending Courses with the status P"""

        queryset = Course.objects.filter(status="P")

        # serializing model instance (i.e convert model instance into JSON)
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)


class CoursesView(APIView):
    """ Browsable list of courses """

    def post(self, request):
        """ POST request creates a newly browsable Course """
        user = authenticate_request(request)

        course = request.data

        # deserializing data (i.e convert data into model instance)
        serializer = CourseSerializer(data=course)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=user)
        return Response(serializer.data)

    def get(self, request):
        """ GET request returns all Courses """

        # query for requestd course
        queryset = Course.objects.filter(status="A")

        # serializing model instance (i.e convert model instance into JSON)
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request):
        """ PUT request Update that particular Course """

        user = authenticate_request(request)

        updated_course = request.data

        # deserializing updated data (i.e convert data into model instance)
        existing_course = Course.objects.get(id=updated_course["id"])
        serializer = CourseSerializer(existing_course, data=updated_course)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CourseContentview(APIView):
    """ Course's content or material of that particular course """

    def get(self, request, course_id):
        """ GET request returns a particular Course's Content """

        # query for request course's content
        try:
            content = CourseContent.objects.get(course=course_id)
        except CourseContent.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        # serializing model instance (i.e convert model instance into JSON)
        serializer = CourseContentSerializer(content)

        return Response(serializer.data)

    def post(self, request, course_id):
        """ POST request creates a particular Course's content """

        authenticate_request(request)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        content = request.data

        # deserializing fresh data (i.e convert data into model instance)
        serializer = CourseContentSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)

        return Response(serializer.data)

    def put(self, request, course_id):
        """ PUT request Update that particular Course's content """

        authenticate_request(request)

        updated_content = request.data

        # query or retrieve the course's content
        try:
            existing_content = CourseContent.objects.get(course=course_id)
        except CourseContent.DoesNotExist:
            return Response({"erorr": "No Content found"}, status=404)

        # deserializing updated data (i.e convert data into model instance)
        serializer = CourseContentSerializer(existing_content, data=updated_content)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class WorkoutsView(APIView):
    """ Workouts or Exercises of that particular course """

    def get(self, request, course_id):
        """ GET request returns a particular Workout and it's description """

        # query for requested workout
        queryset = Workouts.objects.filter(course=course_id)
        # serializing model instance (i.e convert model instance into JSON)
        serializer = WorkoutsSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, course_id):
        """ POST request creates a particular Workout demo """

        authenticate_request(request)

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

        workout = request.data

        # deserializing fresh data (i.e convert data into model instance)
        serializer = WorkoutsSerializer(data=workout)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data)

    def put(self, request, course_id):
        """ PUT request Update that particular Workout itself """

        authenticate_request(request)

        updated_workout = request.data

        # retrieve the workout instance
        try:
            existing_workout = Workouts.objects.get(course=course_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found"}, status=404)

        # deserializing updated data (i.e convert data into model instance)
        serializer = WorkoutsSerializer(existing_workout, data=updated_workout)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class CorrectExerciseFormView(APIView):
    """ The Do's or an Exercise's correct form """

    def get(self, request, workout_id):
        """ GET request returns the correct exercise of that workout """

        # retrieve the workout instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"erorr": "Workout not found"}, status=404)

        # query for the requested correct exercise form
        exercise = CorrectExerciseForm.objects.filter(workout=workout)

        # serializing model instance (i.e convert model instance into JSON)
        serializer = CorrectExerciseFormSerializer(exercise, many=True)
        return Response(serializer.data)

    def post(self, request, workout_id):
        """ POST request creates a demo and description of the correct exercise """

        authenticate_request(request)

        # retrieve the workout instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found"}, status=404)

        exercise = request.data

        # deserializing fresh data (i.e convert data into model instance)
        serializer = CorrectExerciseFormSerializer(data=exercise)
        serializer.is_valid(raise_exception=True)
        serializer.save(workout=workout)

        return Response(serializer.data)

    def put(self, request, workout_id):
        """ PUT request updates the demo or description of the correct exercise """

        authenticate_request(request)

        update = request.data

        queryset = CorrectExerciseForm.objects.filter(workout=workout_id)

        # retrieve the requested existing exercise obj
        existing_exercise = None
        for obj in queryset:
            if update["id"] == obj.id:
                existing_exercise = obj
                break

        if existing_exercise is None:
            return Response({"error": "Exercise not found"}, status=404)

        # deserializing fresh data (i.e convert data into model instance)
        serializer = CorrectExerciseFormSerializer(existing_exercise, data=update)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class WrongExerciseFormView(APIView):
    """ The don'ts or an exercise's wrong form """

    def get(self, request, workout_id):
        """ GET request returns the wrong exercise of that workout """

        # retrieve the workout instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found"}, status=404)
        
        exercise = WrongExerciseForm.objects.filter(workout=workout)

        # serializing model instance (i.e convert model instance into JSON)
        serializer = WrongExerciseFormSerializer(exercise, many=True)
        return Response(serializer.data)
    
    def post(self, request, workout_id):
        """ POST request creates a demo and description of the wrong exercise """

        authenticate_request(request)

        # retrieve the workout instance
        try:
            workout = Workouts.objects.get(id=workout_id)
        except Workouts.DoesNotExist:
            return Response({"error": "Workout not found!"}, status=404)
        
        exercise = request.data

        # deserializing fresh data (i.e convert data into model instance)
        serializer = WrongExerciseFormSerializer(data=exercise)
        serializer.is_valid(raise_exception=True)
        serializer.save(workout=workout)
        return Response(serializer.data)
    
    def put(self, request, workout_id):
        """" PUT request updates the demo or description of the wrong exercise """

        authenticate_request(request)

        update = request.data

        queryset = WrongExerciseForm.objects.filter(workout=workout_id)

        # retrieving the requested existing exercise obj
        existing_exercise = None
        for obj in queryset:
            if update['id'] == obj.id:
                existing_exercise = obj
                break
        if existing_exercise is None:
            return Response({"error": "Exercuse not found!"}, status=404)
        
        # deserializing fresh data (i.e convert data into model instance)
        serializer = WrongExerciseFormSerializer(existing_exercise, data=update)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class CourseCommentsView(APIView):
    """ Commenting function of a course """

    def get(self, request, course_id):
        pass

    def post(self, request, course_id):

        user = user_auth_request(request)

        comment = request.data
        comment['comment_by'] = user.id

        # if it's a reply initialize a variable to it's parent instance
        try:
            reply_id = comment['parent_comment']
            reply = CourseComments.objects.get(id=reply_id)
        except (KeyError, CourseComments.DoesNotExist):
            reply = None

        # retrieve the course instance
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "No course found!"}, status=404)
        
        # deserializing fresh data (i.e convert data into model instance)
        serializer = CourseCommentsSerializer(data=comment)
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course, parent_comment=reply)
        return Response(serializer.data)

        


        
        



        





# debugging/tesitng purposes only for jwt token
class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, key="secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


# NOT USED BELOW

# def index(request):
#     pass

# def csrf(request):
#     return JsonResponse({'csrfToken': get_token(request)})

# # register account API
# @ensure_csrf_cookie
# def register(request):

#     if request.method != 'POST':
#         return JsonResponse({"error": "POST request required."}, status=400)

#     data = json.loads(request.body)
#     first_name = data.get("firstName")
#     last_name = data.get("lastName")
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")

#     # Attempt to create new user
#     try:
#         user = User.objects.create(first_name=first_name, last_name=last_name, username=username, email=email)
#         user.set_password(password)
#         user.save()
#     except IntegrityError as e:
#         print(e)
#         return JsonResponse({"error": "Username already taken"}, status=400)


#     return JsonResponse({"Success": "Account Created"}, status=200)
