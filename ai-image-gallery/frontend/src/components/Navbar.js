import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // Replace with actual authentication logic

  const handleGalleryClick = () => {
    if (isAuthenticated) {
      navigate('/gallery');
    } else {
      navigate('/signin');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">ImageGallery</div>
      <div className="nav-buttons">
        <Link to="/signin" className="btn">Sign In</Link>
        <Link to="/signup" className="btn">Sign Up</Link>
        <button className="btn" onClick={handleGalleryClick}>Gallery</button>
      </div>
    </nav>
  );
};

export default Navbar;
