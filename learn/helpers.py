import jwt, datetime
from rest_framework.exceptions import AuthenticationFailed

from .models import User


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
        raise AuthenticationFailed('Unauthenticated! Not allowed to create')
    

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

    