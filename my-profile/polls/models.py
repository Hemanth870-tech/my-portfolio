from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.email}"

class Project(models.Model):
    ARCHITECTURE_CHOICES = [
        ('microservices', 'Microservices'),
        ('monolithic', 'Monolithic'),
        ('devops', 'DevOps'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    long_description = models.TextField(blank=True, help_text="Detailed description for project page")
    icon = models.CharField(max_length=50, default='fas fa-code-branch', 
                           help_text="Font Awesome icon class")
    
    # Architecture type
    architecture = models.CharField(max_length=20, choices=ARCHITECTURE_CHOICES, default='devops')
    
    # Badge
    badge_text = models.CharField(max_length=50, blank=True)
    badge_color = models.CharField(max_length=20, default='docker-badge')
    
    # Technologies (comma-separated)
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies")
    
    # Links
    github_url = models.URLField(blank=True)
    dockerhub_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    
    # Statistics
    docker_pulls = models.IntegerField(default=0, blank=True)
    
    # Metadata
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('project_detail', args=[self.slug])
    
    def tech_list(self):
        return [tech.strip() for tech in self.technologies.split(',') if tech.strip()]
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order', '-created_at']

class Certification(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    organization = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='fas fa-certificate')
    certificate_url = models.URLField(blank=True, help_text="Link to view certificate")
    
    # Focus areas/tags
    focus_areas = models.CharField(max_length=500, blank=True, help_text="Comma-separated list of focus areas")
    
    # Metadata
    issued_date = models.DateField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # ← ADD THE SAVE METHOD HERE (after fields, before other methods)
    def save(self, *args, **kwargs):
        if not self.slug:  # If slug is empty
            self.slug = slugify(self.title)  # Generate from title
        super().save(*args, **kwargs)
    
    def focus_list(self):
        return [area.strip() for area in self.focus_areas.split(',') if area.strip()]
    
    def __str__(self):
        return f"{self.title} - {self.organization}"
    
    class Meta:
        ordering = ['order', '-issued_date']