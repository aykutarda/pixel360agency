import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import GeometricShapes from '../components/GeometricShapes';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import AICapabilities from '../components/AICapabilities';
import Framework from '../components/Framework';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEOHead, { generateOrganizationSchema } from '../components/SEOHead';

const HomePage = () => {
  return (
    <div className="bg-dark min-h-screen relative">
      <SEOHead
        title="AI-Powered Growth Agency"
        description="Yapay zeka destekli dijital pazarlama çözümleri. Google Ads, Meta Ads, SEO ve daha fazlası. 360° büyüme stratejileri ile markanızı ölçeklendirin."
        canonical="https://pixel360.com.tr"
        keywords={['dijital pazarlama ajansı', 'google ads ajansı', 'meta ads ajansı', 'seo ajansı', 'istanbul dijital ajans']}
        schema={generateOrganizationSchema()}
      />
      
      {/* Animated Background Canvas */}
      <AnimatedBackground />
      
      {/* Geometric 3D Shapes */}
      <GeometricShapes />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <WhyUs />
        <AICapabilities />
        <Framework />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
