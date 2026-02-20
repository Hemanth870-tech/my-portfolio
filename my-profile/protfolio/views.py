from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from polls.models import Project, Certification
def portfolio(request):
    # Get all projects and certifications from database (for future additions)
    db_projects = Project.objects.filter(featured=True).order_by('order')
    db_certifications = Certification.objects.filter(featured=True).order_by('order')
    
    return render(request, 'portfolio.html', {
        'db_projects': db_projects,
        'db_certifications': db_certifications
    })

def contact(request):
    return HttpResponse("this is the contact page.")

def about(request):  # ← THIS WAS MISSING
    return HttpResponse("Myself of HEMANTH . I am from CSE CLOUD/DEVOPS domains.")

def myname(request):  # ← THIS WAS MISSING
    return HttpResponse("MY NAME IS HEMANTH")

# ========== AUTHENTICATION VIEWS ==========

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        # Validation
        if password1 != password2:
            messages.error(request, 'Passwords do not match!')
            return redirect('signup')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists!')
            return redirect('signup')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered!')
            return redirect('signup')
        
        # Create user with staff privileges
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1,
            is_staff=True,  # ← ADD THIS
            is_superuser=False  # Optional: keep as regular staff
        )
        user.save()
        
        # Auto login after signup
        login(request, user)
        messages.success(request, f'Welcome {username}! Account created successfully.')
        return redirect('dashboard')  # ← Redirect straight to dashboard
    
    return render(request, 'registration/signup.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Check if user is admin/staff
            if user.is_staff or user.is_superuser:
                return redirect('dashboard')
            else:
                messages.error(request, 'You are not authorized to access dashboard')
                return redirect('login')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'registration/login.html')

def logout_view(request):
    logout(request)
    return redirect('portfolio')