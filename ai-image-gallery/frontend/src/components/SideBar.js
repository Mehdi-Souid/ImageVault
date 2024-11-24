import React, { useState, useEffect } from 'react';
import { FaFolder, FaPlus, FaHeart, FaTrash, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ setView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [username, setUsername] = useState(''); // Store the username
  const [currentView, setCurrentView] = useState('categories'); // Track the current view type
  const navigate = useNavigate();

  // Fetch user data based on ID in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('username'); // Retrieve user ID from localStorage
    
          setUsername(userId); // Update the username state with fetched data
       
    
  }, []);

  // Handle view changes and navigation
  const handleViewChange = (viewType) => {
    if (viewType === 'categories') {
      // Toggle between categories and images
      const newView = currentView === 'categories' ? 'images' : 'categories';
      setCurrentView(newView); // Update current view based on the toggle
      setView(newView); // Update the view on the page
    } else if (viewType === 'favorites') {
      navigate('/favorites'); // Navigate to the Favorites page
    } else if (viewType === 'trash') {
      navigate('/trash'); // Navigate to the Trash page
    } else if (viewType === 'Add images') {
      navigate('/add'); // Navigate to Add Image page
    }
  };

  return (
    <div
      className={`sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Section */}
      <div className="profile-section">
        <FaUser className="icon profile-icon" />
        {isHovered && <p className="username">{username}</p>}
      </div>

      {/* Feature Icons */}
      <ul className="feature-list">
        {/* Categories (with dynamic text based on currentView) */}
        <li onClick={() => handleViewChange('categories')}>
          <FaFolder className="icon" />
          
          {isHovered && <span>{currentView === 'categories' ? 'Categories' : 'Images'}</span>}
        </li>
        {/* Add Image */}
        <li onClick={() => handleViewChange('Add images')}>
          <FaPlus className="icon" />
          {isHovered && <span>Add Image</span>}
        </li>
        {/* Favorites */}
        <li onClick={() => handleViewChange('favorites')}>
          <FaHeart className="icon" />
          {isHovered && <span>Favorites</span>}
        </li>
        {/* Trash */}
        <li onClick={() => handleViewChange('trash')}>
          <FaTrash className="icon" />
          {isHovered && <span>Trash</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
