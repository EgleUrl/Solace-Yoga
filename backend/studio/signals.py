# This file contains signal handlers for the YogaClass model.
# generates YogaClassOccurrence instances when a YogaClass is created or updated.

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import YogaClass, YogaClassOccurrence
from datetime import timedelta
from django.utils import timezone

@receiver(post_save, sender=YogaClass)
def create_or_update_class_occurrences(sender, instance, created, **kwargs):
    start_date = instance.start_date
    end_date = instance.end_date or (start_date + timedelta(days=30))

    # Map day_of_week string to Python weekday number
    day_of_week_map = {
        'monday': 0,
        'tuesday': 1,
        'wednesday': 2,
        'thursday': 3,
        'friday': 4,
        'saturday': 5,
        'sunday': 6,
    }

    target_weekday = day_of_week_map[instance.day_of_week.lower()]

    # Get existing occurrence dates to avoid duplication
    existing_dates = set(
        YogaClassOccurrence.objects.filter(yoga_class=instance).values_list('date', flat=True)
    )

    occurrences_to_create = []
    occurrences_to_update = []

    current_date = start_date

    while current_date <= end_date:
        if current_date.weekday() == target_weekday:
            if current_date in existing_dates:
                # Update capacity if changed
                occurrence = YogaClassOccurrence.objects.get(yoga_class=instance, date=current_date)
                if occurrence.capacity != instance.capacity:
                    occurrence.capacity = instance.capacity
                    occurrences_to_update.append(occurrence)
            else:
                # New occurrence
                occurrence = YogaClassOccurrence(
                    yoga_class=instance,
                    date=current_date,
                    capacity=instance.capacity,
                )
                occurrences_to_create.append(occurrence)
        current_date += timedelta(days=1)

    # Bulk create and bulk update for efficiency
    if occurrences_to_create:
        YogaClassOccurrence.objects.bulk_create(occurrences_to_create)
        print(f"Created {len(occurrences_to_create)} new occurrences for '{instance.title}'")

    if occurrences_to_update:
        YogaClassOccurrence.objects.bulk_update(occurrences_to_update, ['capacity'])
        print(f"Updated {len(occurrences_to_update)} occurrences for '{instance.title}'")
