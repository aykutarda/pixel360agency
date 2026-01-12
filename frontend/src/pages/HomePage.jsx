import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import GeometricShapes from '../components/GeometricShapes';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Packages from '../components/Packages';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="bg-dark min-h-screen relative">
      {/* Animated Background Canvas */}
      <AnimatedBackground />
      
      {/* Geometric 3D Shapes */}
      <GeometricShapes />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Services />
        <Portfolio />
        <Packages />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
