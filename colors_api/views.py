from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from .serializers import UserSerializer
from django.core.mail import send_mail
from random import randint
from .models import User
import datetime
import hashlib
import jwt

#if true save token for 72 hours = 3 days, otherwise save only for one hour
remember_me = {
    True: 72,
    False: 1
}

class RegisterView(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except:
            return Response(data='Email is already registered!', status=400, exception=True)

        remember = request.data['remember_me']
        name = request.data['name']
        password = request.data['password']
        email = request.data['email']

        h = hashlib.sha256()
        h.update(password.encode('utf-8'))

        user = User(
            name=name,
            email=email,
            password=h.hexdigest()
        )
        user.save()

        remember = request.data['remember_me']
        now = datetime.datetime.utcnow()
        payload = {
            'id': user.id,
            'exp': now + datetime.timedelta(hours=remember_me[remember]),
            'iat': now
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.set_cookie(key='auth', value='true', expires=now + datetime.timedelta(hours=remember_me[remember]))
        response.data = {
            'jwt': token
        }
        return response

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        try:
            user = User.objects.get(email=email)
        except:
            return Response(data='No email found!', status=404, exception=True)

        if user is None:
            return Response(data='User not found!', status=404, exception=True)

        h = hashlib.sha256()
        h.update(password.encode('utf-8'))

        if user.password != h.hexdigest():
            return Response(data='Incorrect password!', status=403, exception=True)

        remember = request.data['remember_me']
        now = datetime.datetime.utcnow()
        payload = {
            'id': user.id,
            'exp': now + datetime.timedelta(hours=remember_me[remember]),
            'iat': now
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.set_cookie(key='auth', value='true', expires=now + datetime.timedelta(hours=remember_me[remember]))
        response.data = {
            'jwt': token
        }
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.set_cookie(key='auth', value='false')
        response.data = {
            'message': 'success'
        }
        return response
