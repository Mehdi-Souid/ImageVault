import React from 'react';
import '../styles/About.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <h2>About Us</h2>
      <p>Welcome to ImageGallery, where you can upload, explore, and share images with the world. Enjoy the simple and fast way to organize your memories!</p>
      <div className="features">
        <div className="feature">
          <span>📸</span>
          <p>Upload Your Photos</p>
        </div>
        <div className="feature">
          <span>🌍</span>
          <p>Explore Gallery</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
