# polls/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('submit-contact/', views.submit_contact, name='submit_contact'),
]