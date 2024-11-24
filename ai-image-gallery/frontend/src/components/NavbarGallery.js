import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Importing the FaUser icon
import SearchBar from './SearchBar'; // Import the SearchBar component
import '../styles/NavbarGallery.css';

const Navbar = ({ onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (e.g., clear token, redirect)
    console.log("Logged out");
    navigate('/');
  };

  return (
    <nav className="navbaro">
      {/* Left: No Logo */}

      {/* Middle: Search Bar */}
      <SearchBar
        placeholder="Search images or categories..."
        onSearch={onSearch} // Pass search query up to parent
      />

      {/* Right: Profile Icon */}
      <div className="profile">
        <FaUser
          className="profile-icon" // Using the FaUser icon
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
