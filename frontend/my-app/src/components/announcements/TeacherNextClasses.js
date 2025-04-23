import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Col, Row } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { fetchTeacherNextOccurrences } from '../../api/yogaApi';
import './AnnouncementsSection.css';

function TeacherNextClasses() {
    const { user, accessToken } = useAuth();
    const [occurrences, setOccurrences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchTeacherNextOccurrences(accessToken); //  pass it here
            setOccurrences(data);
          } catch (error) {
            console.error('Failed to load teacher class occurrences:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (user?.role === 'teacher') {
          fetchData();
        } else {
          setLoading(false);
        }
      }, [user, accessToken]);

  if (!user || user.role !== 'teacher') return null;
  if (loading) return <Spinner animation="border" />;

  if (occurrences.length === 0) {
    return <Alert variant="info">You have no upcoming class dates.</Alert>;
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Your Next Class Dates</h4>
      <Row>
      {occurrences.map((occ) => (
        <Col key={occ.id} md={6} className="mb-4">
          <Card className="cardt mb-2 shadow-lg" key={occ.id}>
            <Card.Body>
              <Card.Title style={{ color: 'var(--color-text)'}}>{occ.class_title}</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {new Date(occ.date).toLocaleDateString()}<br />
                <strong>Time:</strong> {occ.time}<br />
                <strong>Location:</strong> {occ.location}<br />
                <strong>Booked:</strong> {occ.booking_count} student(s)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
      </Row>
    </div>
  );
}

export default TeacherNextClasses;

