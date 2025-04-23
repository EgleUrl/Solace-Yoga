// The landing page of the application
import React from 'react';
import BigImage from '../components/home/BigImage';
import WelcomeSection from '../components/home/WelcomeSection';
import FeaturedClasses from '../components/home/FeaturedClasses';
import Testimonials from '../components/home/Testimonials';
import NewsletterSignup from '../components/home/NewsletterSignup';

function Home() {
  return (
    <>
      <BigImage />
      <WelcomeSection />
      <FeaturedClasses />
      <Testimonials />
      <NewsletterSignup />
    </>
  );
}

export default Home;
