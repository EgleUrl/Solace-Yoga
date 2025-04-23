import React from 'react';
import { Button, Container } from 'react-bootstrap';
import './HomeSections.css'; 
import heroImage from '../../assets/hero-image.png';
import { Link } from 'react-router-dom';


function BigImage() {
  return (
    <div className="big-image" style={{ backgroundImage: `url(${heroImage})` }}>
      <Container className="big-image-content text-left">
        <h1>Welcome to Solace Yoga</h1>
        <p>Rebalance your body and mind with our carefully curated yoga classes, experienced teachers, and peaceful environment.</p>
        <Link to="/classes">
          <Button id="button">See Classes</Button>
        </Link>

      </Container>
    </div>
  );
}

export default BigImage;
