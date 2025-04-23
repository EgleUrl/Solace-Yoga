// Teachers page
import React from 'react';
import PageHeader from '../components/PageHeader';
import Hero from '../components/Hero';
import CardTeachers from '../components/teachers/CardTeacthers';


function Teachers() {
  return (
    <div>
      <PageHeader title="Our team" curPage="Teachers"/>
      <Hero title={"Our instructors"} text={"Meet our dedicated team of experienced yoga teachers to guide you on your journey to balance, strength, and mindfulness."}/>
      <CardTeachers />
    </div>
  );
}
export default Teachers;
