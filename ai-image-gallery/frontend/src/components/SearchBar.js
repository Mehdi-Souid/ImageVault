// SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importing the FaSearch icon
import '../styles/SearchBar.css'; // Import styles for the SearchBar

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const handleInputChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value); // Notify the parent component about input changes
    }
  };

  return (
    <div className="search-bar-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        className="search-bar"
        onChange={handleInputChange} // Handle input changes
      />
    </div>
  );
};

export default SearchBar;
