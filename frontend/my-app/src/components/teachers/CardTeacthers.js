// Teacher card component
// This component fetches and displays a list of yoga teachers using React and Bootstrap.
// It uses the fetchTeachers function from the yogaApi module to get the data
import React, { useEffect, useState } from 'react';
import { fetchTeachers } from '../../api/yogaApi';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TeachersSection.css'; 


function CardTeachers() {
    
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const getTeachers = async () => {
        try {
          const data = await fetchTeachers(); // usage of helper
          setTeachers(data);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        } finally {
          setLoading(false);
        }
      };
  
      getTeachers();
    }, []);
  
    if (loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" />
        </Container>
      );
    }

  return (
    <Container className="mt-5 mb-4">
      <h2 className="text-center mb-4">Meet Our Teachers</h2>
      <Row>
        {teachers.map((teacher) => (
          <Col key={teacher.id} md={4} className="mb-4">
            <Card className="cardt h-100 shadow">
              {teacher.photo && (
                <Card.Img
                variant="top"
                src={teacher.photo}
                alt={teacher.username}
                style={{ height: '300px', objectPosition: 'top center', objectFit: 'cover' }}
              />
              )}
              <Card.Body>
                <Card.Title style= {{color: 'var(--color-text)'}}>{teacher.username}</Card.Title>
                <Card.Subtitle style= {{color: 'var(--color-primary)'}} className="mb-2">{teacher.specialties}</Card.Subtitle>
                <Card.Text>{teacher.bio}</Card.Text>
                <Button
                  id='button'
                  onClick={() => navigate(`/classes?teacher=${teacher.username}`)}
                >
                  View Classes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CardTeachers;