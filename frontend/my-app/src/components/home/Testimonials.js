import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HomeSections.css';

function Testimonials() {
  const testimonials = [
    { quote: 'Solace Yoga has transformed my mornings!', author: 'Emily R.' },
    { quote: 'The teachers are fantastic and the environment is peaceful.', author: 'James T.' },
    { quote: 'Perfect place to find balance in daily life.', author: 'Sophia L.' },
  ];

  return (
    <section className="testimonials">
      <Container>
        <h2 className="text-center mb-4">What Our Clients Say</h2>
        <Row>
          {testimonials.map((t, idx) => (
            <Col md={4} key={idx} className="mb-3 text-center">
              <blockquote>"{t.quote}"</blockquote>
              <p><strong>- {t.author}</strong></p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Testimonials;
