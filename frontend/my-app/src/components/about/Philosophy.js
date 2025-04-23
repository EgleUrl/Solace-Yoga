import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutSection.css';

function Philosophy() {
    return (
    <section className="about-philosophy">
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                <div className="studio-image" />
                </Col>
                <Col md={6}>
                  <h2>Our Philosophy</h2>
                  <p>
                    At Solace Yoga, we believe that yoga is more than just a physical practice — it's a journey of balance, mindfulness, and inner peace.
                    Our studio offers a welcoming environment where every student, regardless of experience, can find their place.
                  </p>
                  <p>
                    We are committed to helping you cultivate harmony in your daily life through expert guidance, community support, and a focus on holistic well-being.
                  </p>
                  <p>Excitingly, we are also preparing to open a new location in Cambridge, bringing the same peaceful sanctuary to even more students.</p>
                  <p>We’d love to hear from you — feel free to <a href="/contact"><i>contact us</i></a> to find out more or plan your visit!</p>
                </Col>
              </Row>
            </Container>
          </section>
    );
  }
  export default Philosophy