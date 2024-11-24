import React from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import AboutSection from '../components/About';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Carousel />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Home;
