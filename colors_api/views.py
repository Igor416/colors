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
            raise ValidationError('Email is already registered!')

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

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=remember_me[remember]),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
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
            raise ValidationError('No email found!')

        if user is None:
            raise ValidationError('User not found!')

        h = hashlib.sha256()
        h.update(password.encode('utf-8'))

        if user.password != h.hexdigest():
            raise ValidationError('Incorrect password!')

        remember = request.data['remember_me']

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=remember_me[remember]),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response

class RestoreView(APIView):
    def post(self, request):
        data = {
            'step': '1'
        }
        try:
            email = request.data['email'].casefold()
        except:
            email = None
        try:
            user_code = request.data['code']
        except:
            user_code = None
        try:
            new_password = request.data['password']
        except:
            new_password = None

        if email:
            request.session['email'] = email
            request.session['step'] = '1'
            try:
                user = User.objects.get(email = email)
            except:
                raise ValidationError('No user found with this email!')
            code = randint(100000, 999999)
            try:
                send_mail(
                    'Password recovery',
                    f'You asked for password recovery, for this copy this code \'{code}\' and paste it into the site field',
                    'colorswebsitehelp@gmail.com',
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                raise ValidationError('Invalid email!')
            data['step'] = '2'
            request.session['code'] = str(code)
        elif user_code:
            request.session['step'] = '2'
            try:
                resend = request.data['resend']
            except:
                resend = None
            if resend:
                code = randint(100000, 999999)
                email = request.session['email']
                print(code)
                try:
                    send_mail(
                        'Password recovery',
                        f'You asked for password recovery, for this copy this code \'{code}\' and paste it into the site field',
                        'colorswebsitehelp@gmail.com',
                        [email],
                        fail_silently=False,
                    )
                except Exception as e:
                    raise ValidationError('Invalid email!')
                data['step'] = '2'
                request.session['code'] = str(code)
            else:
                if user_code == request.session['code']:
                    data['step'] = '3'
                    del request.session['code']
                else:
                    raise ValidationError('Invalid code!')
        elif new_password:
            request.session['step'] = '3'
            user = User.objects.get(email = request.session['email'])

            h = hashlib.sha256()
            h.update(new_password.encode('utf-8'))
            user.password = str(h.hexdigest())

            user.save()
            del request.session['email']
            del request.session['step']

            remember = request.data['remember_me']

            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=remember_me[remember]),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

            response = Response()

            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }
            return response
        else:
            raise ValidationError('No valid data!')

        return Response(data)

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise ValidationError('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise ValidationError('Unauthenticated!')

        user = User.objects.get(id=payload['id'])
        serializer = UserSerializer(user)
        #return everything except for the password
        data = dict(serializer.data)
        data.pop('password')
        return Response(data)

    def put(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.get(id=payload['id'])

        data = request.data['data']
        if data == 'info':
            name = request.data['name']
            email = request.data['email']
            user.name = name
            user.email = email
            user.save()
        elif data == 'colors':
            colors = request.data['colors']
            user.colors = colors
            user.save()

        serializer = UserSerializer(user)
        data = dict(serializer.data)
        data.pop('password')
        return Response(data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
