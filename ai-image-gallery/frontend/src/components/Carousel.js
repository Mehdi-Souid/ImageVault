import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const Carousel = () => {
  const images = [image1, image2, image3]; // Array of images to rotate
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]); // Reset interval on index change

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Featured ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
        />
      ))}

      {/* Navigation Buttons */}
      <button className="carousel-button left" onClick={handlePrev}>
        &#10094;
      </button>
      <button className="carousel-button right" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
