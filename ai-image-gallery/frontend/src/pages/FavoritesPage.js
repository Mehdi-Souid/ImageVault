import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavbarGallery';
import Sidebar from '../components/SidebarFav';
import ImageCard from '../components/ImageCard';
import '../styles/Gallery.css';

const FavoritesPage = () => {
  const [images, setImages] = useState([]); // All images
  const [filteredImages, setFilteredImages] = useState([]); // Only favorited images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch images when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const imageResponse = await axios.get('http://localhost:5000/api/images');
        setImages(imageResponse.data);
        setFilteredImages(imageResponse.data.filter(image => image.favorited === true)); // Filter only favorited images
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // No dependency, this will run once on mount

  // Handle image click
  const handleCardClick = (type, id) => {
    if (type === 'image') {
      navigate(`/images/${id}`);
    }
  };

  // Handle trash click - update trashed status in the database
  const handleTrash = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/images/${id}/trash`, { trashed: true });
      setImages(images.filter(image => image._id !== id));
      setFilteredImages(filteredImages.filter(image => image._id !== id));  // Re-filter images after trashing
    } catch (err) {
      console.error('Error trashing image:', err);
    }
  };

  // Handle favorite click - use appropriate API call based on favorited status
  const handleFavorite = async (id, favorited) => {
    try {
      if (favorited) {
        // Call the API to delete from favorites
        await axios.put(`http://localhost:5000/api/images/${id}/favoriteDelete`);
      } else {
        // Call the API to add to favorites
        await axios.put(`http://localhost:5000/api/images/${id}/favorite`, { favorited: true });
      }

      // Update the state after the API call
      setImages(images.map(image => 
        image._id === id ? { ...image, favorited: !favorited } : image
      ));

      // Update the filtered images to reflect the changes
      if (favorited) {
        setFilteredImages(filteredImages.filter(image => image._id !== id)); // Remove from favorites
      } else {
        setFilteredImages([...filteredImages, images.find(image => image._id === id)]); // Add to favorites
      }
    } catch (err) {
      console.error('Error handling favorite status:', err);
    }
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <div className="main-content">
        <Sidebar setView={() => {}} /> {/* Sidebar with no view change */}
        <div className="gallery-content">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <ImageCard
                key={image._id}
                type="image"
                data={image}
                onClick={() => handleCardClick('image', image._id)}
                onTrash={handleTrash}  // Pass the onTrash handler
                onFavorite={(id) => handleFavorite(id, image.favorited)}  // Pass the onFavorite handler
              />
            ))
          ) : (
            <p>No favorite images found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
