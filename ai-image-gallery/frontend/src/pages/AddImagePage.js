import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Addimage.css"

const AddImagePage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      setMessage('User not logged in!');
      setLoading(false);
      return;
    }

    if (!image) {
      setMessage('Please select an image to upload.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', image); // Append the selected image
    formData.append('userId', userId); // Add userId to form data

    try {
      const response = await axios.post('/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Image uploaded successfully!');
      console.log(response.data); // Optional: Log response for debugging
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-image-page">
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image">Choose Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddImagePage;
