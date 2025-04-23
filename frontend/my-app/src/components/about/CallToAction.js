import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './AboutSection.css';

function CallToAction() {
    return (
        <section className="about-cta text-center">
            <Container>
                <h2 style= {{color: 'var(--color-white)'}}>Ready to Begin Your Journey?</h2>
                <p style= {{color: 'var(--color-white)'}}>Join our community and explore classes that nourish your body and mind.</p>
                <Button href="/classes" id='button3'>Explore Classes</Button>
            </Container>
        </section>
    );
  }
  export default CallToAction;