// Contact page
import PageHeader from '../components/PageHeader'
import React from 'react';
import { Container } from 'react-bootstrap';
import Hero from '../components/Hero';
import Map from '../components/contact/Map';
import UserForm from '../components/contact/UserForm';
import ContactDetails from '../components/contact/ContactDetails';

function Contact() {
  return (
    <div className="contact-page">
      <div>
        <PageHeader title={'Contact Us'} curPage={'Contact'} />
      </div>
        {/* Hero Section */}
      <Hero title={"Visit Us"} text={"Located in the heart of Peterborough, our studio is easy to find and ready to welcome you."} />
      <section className="contact-info py-5">
        <ContactDetails />
        <Map />
      </section>
      {/* Call to Action */}
      <section className="about-cta text-center">
        <Container>
          <h2 style= {{color: 'var(--color-white)'}}>Get in Touch!</h2>
          <p style= {{color: 'var(--color-white)'}}>For any inquires, suggestions, feedbacks, complains or praises, please fill the form bellow.</p> 
          <p style= {{color: 'var(--color-white)'}}>We will get back to you in two working days.</p>          
        </Container>
      </section>
      <div className='form-container'>
        <h2>Contact form</h2>
        <UserForm />
      </div>    
    </div>
  );
}

export default Contact;
