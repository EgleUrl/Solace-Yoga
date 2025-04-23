import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './AboutSection.css';
import teacher1 from '../../assets/teacher1.png';
import teacher2 from '../../assets/teacher2.png';
import teacher3 from '../../assets/teacher3.png';

function Teachers() {
    return (
        <section className="about-team">
            <Container>
                <h2 className="text-center mb-4">Meet Our Team</h2>
                <Row>
                    <Col md={4} className="text-center mb-4">
                        <img src={teacher1} alt="Teacher 1" className="img-fluid rounded-circle mb-3" style={{ width: '30vh', height: '30vh', objectFit: 'cover' }} />
                        <h5>Emma R.</h5>
                        <p>Vinyasa Flow Expert, with 8 years of experience guiding mindful movement.</p>
                    </Col>
                    <Col md={4} className="text-center mb-4">
                        <img src={teacher2} alt="Teacher 2" className="img-fluid rounded-circle mb-3" style={{ width: '30vh', height: '30vh', objectFit: 'cover' }} />
                        <h5>Liam S.</h5>
                        <p>Specializes in Restorative Yoga, bringing calm and clarity to every session.</p>
                    </Col>
                    <Col md={4} className="text-center mb-4">
                        <img src={teacher3} alt="Teacher 3" className="img-fluid rounded-circle mb-3" style={{ width: '30vh', height: '30vh', objectFit: 'cover' }} />
                        <h5>Sophia K.</h5>
                        <p>Yoga therapist focusing on holistic wellbeing and mindfulness practices.</p>
                    </Col>
                    <div className="text-center mb-2">                        
                        <Button id='button' className="mt-3 w-20" href="/teachers">See All Our Team</Button>
                    </div>
                </Row>
            </Container>
        </section>
    );
  }
  export default Teachers