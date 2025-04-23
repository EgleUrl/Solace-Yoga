import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HomeSections.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function WelcomeSection() {
  return (
    <section className="welcome-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="welcome-image" />
          </Col>
          <Col md={6}>
            <h2>Solace Yoga Studio</h2>
            <p>At Solace Yoga, we believe in harmony between mind and body. Our studio offers a tranquil environment where everyone, 
              from beginners to advanced practitioners, can find balance and peace.</p>
            <Link to="/about">
                <Button id="button">Explore Our Studio</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WelcomeSection;
