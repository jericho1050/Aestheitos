import jwt, datetime
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .models import User, Course


def authenticate_request(request):

    """ Validating token for authentication purposes """

    token = request.COOKIES.get("jwt")

    if not token:
        raise AuthenticationFailed('Unauthenticated!')

    try: 
        payload = jwt.decode(token, key='secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    
    user = User.objects.filter(id=payload['id']).first()

    # check if user is an instructor
    if not user.is_instructor:
        raise AuthenticationFailed('Unauthenticated! Not allowed to POST/PUT/DELETE')
    
    return user

def user_auth_request(request):

    """ Validating token for authentication purposes (we're only checking here if user is logged in) """

    token = request.COOKIES.get("jwt")

    if not token:
        raise AuthenticationFailed('Unauthenticated!')

    try: 
        payload = jwt.decode(token, key='secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    
    user = User.objects.filter(id=payload['id']).first()

    return user

def valid_ownership(user, course_id):
    """ we check if this course belongs to the instructor (creator of the course)"""

    # retrieve the course object or instance
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    
    if user != course.created_by:
        return False
    
    return True



    

    
    
