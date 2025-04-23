import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './ContactSection.css';

function ContactDetails() {
    return (        
        <Container> 
            <h2>Our Studio</h2>        
            <Row>            
                <Col md={6}>              
                    <div className="contact-image" />
                </Col>
                <Col md={6} >
                    <div className='address'> 
                        <h4>Contact details</h4>             
                        <p><strong>Solace Yoga Studio</strong></p>
                        <p>15 Gravel Walk<br />Peterborough, PE1 1YU<br />United Kingdom</p>
                        <p><strong>Phone:</strong> +44 1733 123456</p>
                        <p><strong>Email:</strong> hello@solaceyoga.co.uk</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
  }
  export default ContactDetails;