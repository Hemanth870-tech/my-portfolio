"""
URL configuration for protfolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for protfolio project.
"""
from django.contrib import admin
from django.urls import path
from polls.views import (
    submit_contact, project_detail, certification_detail,
    dashboard, add_project, edit_project, delete_project,
    add_certification, edit_certification, delete_certification,
    portfolio, about, signup_view, login_view, logout_view, create_admin,
)

urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin (still accessible)
    
    # Public pages
    path('', portfolio, name='portfolio'),
    path('about/', about, name='about'),
    
    # Authentication
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Dashboard
    path('dashboard/', dashboard, name='dashboard'),
    
    # Project CRUD (Admin only)
    path('dashboard/add-project/', add_project, name='add_project'),
    path('dashboard/edit-project/<int:pk>/', edit_project, name='edit_project'),
    path('dashboard/delete-project/<int:pk>/', delete_project, name='delete_project'),
    
    # Certification CRUD (Admin only)
    path('dashboard/add-certification/', add_certification, name='add_certification'),
    path('dashboard/edit-certification/<int:pk>/', edit_certification, name='edit_certification'),
    path('dashboard/delete-certification/<int:pk>/', delete_certification, name='delete_certification'),
    
    # Detail pages
    path('projects/<slug:slug>/', project_detail, name='project_detail'),
    path('certifications/<slug:slug>/', certification_detail, name='certification_detail'),
    
    # Contact
    path('contact/submit/', submit_contact, name='submit_contact'),
    path('create-admin/', create_admin, name='create_admin'),
]
