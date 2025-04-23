import api from './axios';

// Fetch all yoga classes
export const fetchClasses = async (params = {}) => {
  try {
    const response = await api.get('classes/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};
// Fetch class occurrences (optionally filter by class ID)
export const fetchOccurrences = async (classId = null) => {
  const params = {};
  if (classId) params.class = classId;

  const response = await api.get('occurrences/', { params });
  return response.data;
};

// Fetch bookings (requires auth!)
export const fetchBookings = async (accessToken) => {
  const response = await api.get('bookings/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
// Create bookings from basket (requires auth!)
export const createBooking = async (basket, accessToken) => {
  try {
    const response = await api.post(
      'bookings/',
      { basket },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
// Fetch all teachers
export const fetchTeachers = async () => {
  const response = await api.get('teachers/');
  return response.data;
};

// Fetch all announcements
export const fetchAnnouncements = async () => {
  try {
    const response = await api.get('announcements/');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Create a new announcement (admin only)
export const createAnnouncement = async (data, accessToken) => {
  try {
    const response = await api.post('announcements/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Delete an announcement (admin only, and teachers can delete their own)
// Note: This function assumes that the backend checks if the user is a teacher
// and if they are the owner of the announcement before allowing deletion.
export const deleteAnnouncement = async (id, accessToken) => {
  try {
    const response = await api.delete(`announcements/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};
// Update an announcement (admin only, and teachers can update their own)
export const updateAnnouncement = async (id, data, accessToken) => {
  try {
    const response = await api.put(`announcements/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};
// Fetch all yoga classes for a specific teacher
export const fetchTeacherNextOccurrences = async (accessToken) => {
  const response = await api.get('occurrences/my-next/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

