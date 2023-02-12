from . import views
from django.urls import path

urlpatterns = [
    path('', views.home, name = 'home'),
    path('picker', views.home, name = 'home'),
    path('calculator', views.home, name = 'home'),
    path('calculator/help', views.home, name = 'home'),
    path('trends', views.home, name = 'home'),
    path('trends/decades', views.home, name = 'home'),
    path('trends/decades/<string>', views.home, name = 'home'),
    path('trends/years', views.home, name = 'home'),
    path('schemes', views.home, name = 'home'),
    path('schemes/<string>', views.home, name = 'home'),
    path('models', views.home, name = 'home'),
    path('profile', views.home, name = 'home'),
    path('log_in', views.home, name = 'home'),
    path('sign_up', views.home, name = 'home'),
    path('restore', views.home, name = 'home'),
]
