// Client-side component to display a list of upcomming classes booked by the client
// It fetches the bookings from the API and filters them to show only upcoming classes
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Col, Row } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { fetchBookings } from '../../api/yogaApi';
import './AnnouncementsSection.css'; 

function ClientUpcomingClasses() {
  const { user, accessToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings when the component mounts or when user or accessToken changes
  // Filter bookings to show only those with an upcoming class session
  // Set loading to false when the data is fetched
  // If the user is not a client, set loading to false immediately
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings(accessToken);
        // Show only bookings with an upcoming class session
        const future = data.filter((b) => {
          const occ = b.yoga_class?.next_occurrence;
          return occ && new Date(occ) >= new Date();
        });
        setBookings(future);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'client') {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user, accessToken]);

  if (!user || user.role !== 'client') return null;

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (bookings.length === 0) {
    return <Alert variant="info">You have no upcoming class bookings.</Alert>;
  }

  return (
    <div className="mb-4">
      <h5 className="mb-3">Your Upcoming Booked Classes</h5>
      <Row>        
        {bookings.map((booking) => (
          <Col key={booking.id} md={6} className="mb-4">
            <Card className="cardt mb-2 shadow-md" key={booking.id}>
              <Card.Body>
                <Card.Title style={{ color: 'var(--color-text)'}}>{booking.yoga_class.title}</Card.Title>
                <Card.Text>
                  <strong>Next Class:</strong> {booking.yoga_class.next_occurrence
                    ? new Date(booking.yoga_class.next_occurrence).toLocaleString()
                    : 'TBA'}
                  <br />
                  <strong>With:</strong> {booking.yoga_class.teacher_name}<br />
                  <strong>Location:</strong> {booking.yoga_class.location}<br />
                  <small style={{ color: 'var(--color-primary)'}}>
                    Booked on {new Date(booking.booking_date).toLocaleDateString()}
                  </small>
                </Card.Text>
              </Card.Body> 
            </Card>
          </Col>                   
        ))}            
      </Row>
    </div>
  );
}

export default ClientUpcomingClasses;

