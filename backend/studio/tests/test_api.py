# Integration test for the API endpoints
# checks if the enpoint /api/occurrences/my-next/ requires authentication
import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
def test_occurrence_my_next_requires_authentication():
    client = APIClient()
    response = client.get('/api/occurrences/my-next/')
    assert response.status_code == 401  # Unauthorized
