"""
WSGI config for protfolio project.
"""

import os
import sys
from django.core.wsgi import get_wsgi_application


# ===== STATIC COLLECTION TRIGGER =====
if os.environ.get('COLLECTSTATIC') == 'true':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protfolio.settings')
    from django.core.management import execute_from_command_line
    print("📦 Collecting static files...")
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
    print("✅ Static files collected!")
    sys.exit(0)
# =====================================


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protfolio.settings')

application = get_wsgi_application()