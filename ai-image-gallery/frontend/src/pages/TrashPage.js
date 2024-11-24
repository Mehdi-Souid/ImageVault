import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCardTrash from '../components/ImageCardTrash';  // Import the trash card component
import Navbar from '../components/NavbarGallery';
import Sidebar from '../components/SidebarFav';
import '../styles/Gallery.css';

const TrashPage = () => {
  const [images, setImages] = useState([]); // All trashed images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trashed images
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const imageResponse = await axios.get('http://localhost:5000/api/images?trashed=true');
        setImages(imageResponse.data); // Load only trashed images
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle undo trash click
  const handleUndoTrash = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/images/${id}/trashDelete`, { trashed: false }); // Make API call
      setImages(images.filter(image => image._id !== id)); // Remove the image from the UI
    } catch (err) {
      console.error('Error undoing trash:', err);
    }
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <div className="main-content">
        <Sidebar setView={() => {}} />
        <div className="gallery-content">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {images.length > 0 ? (
            images.map((image) => (
              <ImageCardTrash
                key={image._id}
                data={image}
                onClick={() => console.log('Image clicked')} // Placeholder for an image click handler
                onUndoTrash={() => handleUndoTrash(image._id)}  // Pass the undo trash handler
              />
            ))
          ) : (
            <p>No trashed images found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashPage;
