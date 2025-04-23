// Hero component representing the hero section of the page
import React from "react";
import { Container } from "react-bootstrap";
import './Hero.css'; // CSS file for styling

function Hero({ title, text}) {
    return (
        <section className="hero text-center">
            <Container>
                <h1>{title}</h1>
                <h6 style={{ color: "var(--color-white)"}}>{text}</h6>
             </Container>
        </section>
    );
  }
  export default Hero;