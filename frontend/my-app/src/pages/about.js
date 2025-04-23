// About page
import PageHeader from '../components/PageHeader'
import React from 'react';
import Hero from '../components/Hero';
import Philosophy from '../components/about/Philosophy';
import CallToAction from '../components/about/CallToAction';
import OurTeam from '../components/about/OurTeam';

function About() {
  return (    
    <div className="about-page">
        <div>
            <PageHeader title={'About Us'} curPage={'About'} />
        </div>
      {/* Hero Section */}
      <Hero title={"Solace Yoga"} text={"Rebalance your body and mind with us at Solace Yoga. Discover our philosophy, our space, and our wonderful community."} />
      {/* Philosophy */}
      <Philosophy />
      {/* Call to Action */}
      <CallToAction />
      {/* Our Team Section */}
      <OurTeam/>
    </div>    
  );
}

export default About;
