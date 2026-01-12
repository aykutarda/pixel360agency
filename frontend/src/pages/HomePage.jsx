import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="bg-dark min-h-screen">
      <Header />
      <Hero />
      <About />
      <Works />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
