from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path('', views.Home),
    path('lobby', views.Lobby),
    path('room', views.Room),

    path('get_token/', views.getToken),
]


