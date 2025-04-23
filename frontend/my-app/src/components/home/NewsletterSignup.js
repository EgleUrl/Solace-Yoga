import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import './HomeSections.css'; // Ensure your styles are here

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false || !validateEmail(email)) {
      setValidated(true);
      return;
    }

    // If valid:
    alert('Thank you for subscribing!');
    setEmail(''); // Reset the email field
    setValidated(false); // Reset validation
  };

  // Email validation function (regex based)
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <section className="newsletter-signup">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2>Stay Connected</h2>
            <p>Subscribe for studio updates and special offers!</p>
          </Col>
          <Col md={6}>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <InputGroup className="mb-3">
                <Form.Control
                  required
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={validated && !validateEmail(email)}
                />
                <Form.Control.Feedback type="invalid">
                  Please, enter a valid email address.
                </Form.Control.Feedback>
                <Button id="button" type="submit">
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default NewsletterSignup;
