# Defines the configuration for the 'studio' app in a Django project.
from django.apps import AppConfig

class StudioConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'studio'

    def ready(self):
        import studio.signals  # Connects signals

