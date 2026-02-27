from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.utils.text import slugify
from .models import ContactMessage, Project, Certification
@csrf_exempt
def submit_contact(request):
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')
        
        # Save to database
        contact = ContactMessage.objects.create(
            name=name,
            email=email,
            message=message_text
        )
        
        # Send automatic reply email
        subject = f"Thank you for contacting me, {name}! 🙏"
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                    border-radius: 16px 16px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .greeting {{
                    font-size: 20px;
                    color: #1e293b;
                    margin-bottom: 20px;
                }}
                .message-box {{
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 12px;
                    border-left: 6px solid #3b82f6;
                    margin: 25px 0;
                }}
                .signature {{
                    margin-top: 35px;
                    padding-top: 25px;
                    border-top: 2px solid #e2e8f0;
                }}
                .buttons-container {{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    justify-content: center;
                    margin: 30px 0;
                }}
                .btn {{
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    min-width: 160px;
                }}
                .btn-docker {{
                    background: #2496ed;
                    color: white;
                }}
                .btn-github {{
                    background: #333;
                    color: white;
                }}
                .btn-linkedin {{
                    background: #0077b5;
                    color: white;
                }}
                .btn:hover {{
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }}
                .footer {{
                    background: #f1f5f9;
                    padding: 25px;
                    text-align: center;
                    border-radius: 0 0 16px 16px;
                    color: #64748b;
                }}
                .footer-links {{
                    margin: 15px 0;
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                }}
                .footer-links a {{
                    color: #3b82f6;
                    text-decoration: none;
                    font-size: 14px;
                }}
                .footer-links a:hover {{
                    text-decoration: underline;
                }}
                .icon {{
                    font-size: 18px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>☁️ Hemanth Issai</h1>
                    <p style="margin-top: 10px; opacity: 0.95;">Cloud & DevOps Engineer</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        👋 Hello <strong>{name}</strong>!
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #475569;">
                        Thank you for reaching out to me through my portfolio. I've received your message and appreciate your interest in my work.
                    </p>
                    
                    <div class="message-box">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">YOUR MESSAGE</span>
                        </div>
                        <p style="font-size: 15px; color: #1e293b; font-style: italic; margin: 0;">
                            "{message_text}"
                        </p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #475569;">
                        I typically respond within <strong>24-48 hours</strong>. In the meantime, connect with me on:
                    </p>
                    
                    <div class="buttons-container">
                        <a href="https://hub.docker.com/u/heamnth345" class="btn btn-docker" target="_blank">
                            <span class="icon">🐳</span> Docker Hub
                        </a>
                        <a href="https://github.com/Hemanth870-tech" class="btn btn-github" target="_blank">
                            <span class="icon">🐙</span> GitHub
                        </a>
                        <a href="https://linkedin.com/in/hemanth-issai" class="btn btn-linkedin" target="_blank">
                            <span class="icon">🔗</span> LinkedIn
                        </a>
                    </div>
                    
                    <p style="font-size: 15px; color: #475569; text-align: center; margin: 25px 0 10px;">
                        ⭐ Check out my <strong>Docker projects</strong> with 97+ pulls!
                    </p>
                    
                    <div class="signature">
                        <p style="font-size: 16px; color: #1e293b; margin-bottom: 5px;">
                            Best regards,
                        </p>
                        <p style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0;">
                            Hemanth Issai
                        </p>
                        <p style="font-size: 14px; color: #64748b; margin-top: 5px;">
                            Cloud & DevOps Engineer | CSE Student
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-links">
                        <a href="https://github.com/Hemanth870-tech">GitHub</a> •
                        <a href="https://linkedin.com/in/hemanth-issai">LinkedIn</a> •
                        <a href="https://hub.docker.com/u/heamnth345">Docker Hub</a>
                    </div>
                    <p style="margin: 10px 0 0; font-size: 13px;">
                        © 2025 Hemanth Issai. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
Hello {name},

Thank you for contacting me! I've received your message and will get back to you shortly.

Your message: "{message_text}"

Connect with me:
- Docker Hub: https://hub.docker.com/u/heamnth345 (97+ pulls! ⭐)
- GitHub: https://github.com/Hemanth870-tech
- LinkedIn: https://linkedin.com/in/hemanth-issai

Best regards,
Hemanth Issai
Cloud & DevOps Engineer
        """
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            email_status = "sent"
        except Exception as e:
            print(f"Email error: {e}")
            email_status = "failed"
        
        return JsonResponse({
            'success': True,
            'message': 'Message sent successfully! Check your email for confirmation.',
            'email_status': email_status
        })
    
    return JsonResponse({
        'success': False,
        'message': 'message reached to hemanth , he will notify yu shortly through mail.'
    })

# ========== HELPER FUNCTION ==========
def is_admin_user(user):
    return user.is_authenticated and (user.is_superuser or user.is_staff)

# ========== PUBLIC VIEWS ==========
def portfolio(request):
    projects = Project.objects.filter(featured=True).order_by('order')
    certifications = Certification.objects.filter(featured=True).order_by('order')
    
    return render(request, 'portfolio.html', {
        'db_projects': projects,
        'db_certifications': certifications
    })

def about(request):
    return render(request, 'about.html')

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
        
        # Create regular user (NOT staff)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )
        user.save()
        
        messages.success(request, 'Account created successfully! Please login.')
        return redirect('login')
    
    return render(request, 'registration/signup.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        print(f"Login attempt: {username} / {password}")  # Debug
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            print(f"✅ Login successful for {username}")  # Debug
            return redirect('dashboard')
        else:
            print(f"❌ Login failed for {username}")  # Debug
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'registration/login.html')

def logout_view(request):
    logout(request)
    return redirect('portfolio')

# ========== DASHBOARD VIEW ==========
@login_required(login_url='login')
def dashboard(request):
    """Main dashboard - different UI for admin vs regular users"""
    projects = Project.objects.all().order_by('-created_at')
    certifications = Certification.objects.all().order_by('-issued_date')
    messages_list = ContactMessage.objects.all().order_by('-submitted_at')[:10]
    
    # Check if user is the admin 'hemanth'
    is_admin_user = request.user.is_superuser or request.user.is_staff
    
    context = {
        'projects': projects,
        'certifications': certifications,
        'messages_list': messages_list,
        'total_projects': projects.count(),
        'total_certifications': certifications.count(),
        'total_messages': ContactMessage.objects.count(),
        'is_admin': is_admin_user,  # True only for hemanth
    }
    
    return render(request, 'dashboard/index.html', context)

# ========== PROJECT CRUD (Admin Only) ==========
@login_required(login_url='login')
def add_project(request):
    # Debug
    print(f"User: {request.user.username}")
    print(f"is_superuser: {request.user.is_superuser}")
    print(f"is_staff: {request.user.is_staff}")
    # Only admin can access
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to add projects.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        technologies = request.POST.get('technologies')
        github_url = request.POST.get('github_url')
        dockerhub_url = request.POST.get('dockerhub_url')
        live_demo_url = request.POST.get('live_demo_url')
        architecture = request.POST.get('architecture')
        icon = request.POST.get('icon', 'fas fa-code-branch')
        badge_text = request.POST.get('badge_text', '')
        badge_color = request.POST.get('badge_color', 'docker-badge')
        featured = request.POST.get('featured') == 'on'
        order = request.POST.get('order', 0)
        
        # Create project
        project = Project.objects.create(
            title=title,
            description=description,
            technologies=technologies,
            github_url=github_url,
            dockerhub_url=dockerhub_url,
            live_demo_url=live_demo_url,
            architecture=architecture,
            icon=icon,
            badge_text=badge_text,
            badge_color=badge_color,
            featured=featured,
            order=order
        )
        
        messages.success(request, f'Project "{title}" added successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/add_project.html')

@login_required(login_url='login')
def edit_project(request, pk):
    # Only admin can access
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to edit projects.')
        return redirect('dashboard')
    
    project = get_object_or_404(Project, id=pk)
    
    if request.method == 'POST':
        project.title = request.POST.get('title')
        project.description = request.POST.get('description')
        project.technologies = request.POST.get('technologies')
        project.github_url = request.POST.get('github_url')
        project.dockerhub_url = request.POST.get('dockerhub_url')
        project.live_demo_url = request.POST.get('live_demo_url')
        project.architecture = request.POST.get('architecture')
        project.icon = request.POST.get('icon', 'fas fa-code-branch')
        project.badge_text = request.POST.get('badge_text', '')
        project.badge_color = request.POST.get('badge_color', 'docker-badge')
        project.featured = request.POST.get('featured') == 'on'
        project.order = request.POST.get('order', 0)
        project.save()
        
        messages.success(request, f'Project "{project.title}" updated successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/edit_project.html', {'project': project})

@login_required(login_url='login')
def delete_project(request, pk):
    # Only admin can access
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to delete projects.')
        return redirect('dashboard')
    
    project = get_object_or_404(Project, id=pk)
    
    if request.method == 'POST':
        title = project.title
        project.delete()
        messages.success(request, f'Project "{title}" deleted successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/delete_confirm.html', {'project': project})

# ========== CERTIFICATION CRUD (Admin Only) ==========
@login_required(login_url='login')
def add_certification(request):
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to delete projects.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        organization = request.POST.get('organization')
        description = request.POST.get('description')
        icon = request.POST.get('icon', 'fas fa-certificate')
        certificate_url = request.POST.get('certificate_url')
        focus_areas = request.POST.get('focus_areas')
        issued_date = request.POST.get('issued_date')
        featured = request.POST.get('featured') == 'on'
        order = request.POST.get('order', 0)
        
        cert = Certification.objects.create(
            title=title,
            organization=organization,
            description=description,
            icon=icon,
            certificate_url=certificate_url,
            focus_areas=focus_areas,
            issued_date=issued_date,
            featured=featured,
            order=order
        )
        
        messages.success(request, f'Certification "{title}" added successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/add_certification.html')

@login_required(login_url='login')
def edit_certification(request, pk):
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to delete projects.')
        return redirect('dashboard')
    
    cert = get_object_or_404(Certification, id=pk)
    
    if request.method == 'POST':
        cert.title = request.POST.get('title')
        cert.organization = request.POST.get('organization')
        cert.description = request.POST.get('description')
        cert.icon = request.POST.get('icon', 'fas fa-certificate')
        cert.certificate_url = request.POST.get('certificate_url')
        cert.focus_areas = request.POST.get('focus_areas')
        cert.issued_date = request.POST.get('issued_date')
        cert.featured = request.POST.get('featured') == 'on'
        cert.order = request.POST.get('order', 0)
        cert.save()
        
        messages.success(request, f'Certification "{cert.title}" updated successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/edit_certification.html', {'cert': cert})

@login_required(login_url='login')
def delete_certification(request, pk):
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You are not authorized to delete projects.')
        return redirect('dashboard')
    
    cert = get_object_or_404(Certification, id=pk)
    
    if request.method == 'POST':
        title = cert.title
        cert.delete()
        messages.success(request, f'Certification "{title}" deleted successfully!')
        return redirect('dashboard')
    
    return render(request, 'dashboard/delete_cert_confirm.html', {'cert': cert})

# ========== DETAIL VIEWS ==========
def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(request, 'projects/detail.html', {'project': project})

def certification_detail(request, slug):
    certification = get_object_or_404(Certification, slug=slug)
    return render(request, 'certifications/detail.html', {'certification': certification})

