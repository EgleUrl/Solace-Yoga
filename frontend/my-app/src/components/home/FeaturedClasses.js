import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiSun } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { FiMoon } from 'react-icons/fi';
import './HomeSections.css';

function FeaturedClasses() {
  const classes = [
    { title: 'Sunrise Flow', description: 'Energize your morning with mindful movement.', href: "classes?timeOfDay=morning", icon: <FiSun size={40}/> },
    { title: 'Balance & Restore', description: 'Grounding practice for body and mind.', href: "classes?timeOfDay=afternoon", icon: <FaLeaf size={40}/> },
    { title: 'Evening Calm', description: 'Relax and unwind with gentle stretches.', href: "classes?timeOfDay=evening", icon: <FiMoon size={40}/> },
  ];

  return (
    <section className="featured-classes">
      <Container>
        <h2 className="text-center mb-4">Our Classes</h2>
        <Row>
          {classes.map((yogaClass, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card className="text-center h-100" style={{color: 'var(--color-primary)'}}>
                <Card.Body>
                  <div className="class-icon">{yogaClass.icon}</div>
                  <Card.Title>{yogaClass.title}</Card.Title>
                  <Card.Text>{yogaClass.description}</Card.Text>
                  <Button id="button" href={yogaClass.href}>View Classes</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default FeaturedClasses;
