from django.contrib import admin
from .models import ContactMessage, Project, Certification

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submitted_at')
    search_fields = ('name', 'email')
    list_filter = ('submitted_at',)
    readonly_fields = ('submitted_at',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'architecture', 'featured', 'order', 'docker_pulls', 'created_at')
    list_filter = ('architecture', 'featured', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'long_description', 'icon')
        }),
        ('Architecture & Badge', {
            'fields': ('architecture', 'badge_text', 'badge_color')
        }),
        ('Technologies', {
            'fields': ('technologies',)
        }),
        ('Links', {
            'fields': ('github_url', 'dockerhub_url', 'live_demo_url', 'docker_pulls')
        }),
        ('Metadata', {
            'fields': ('featured', 'order')
        }),
    )

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'featured', 'order', 'issued_date')
    list_filter = ('featured', 'organization', 'issued_date')
    search_fields = ('title', 'organization', 'description')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'organization', 'description', 'icon')
        }),
        ('Certificate Details', {
            'fields': ('certificate_url', 'issued_date', 'focus_areas')
        }),
        ('Metadata', {
            'fields': ('featured', 'order')
        }),
    )