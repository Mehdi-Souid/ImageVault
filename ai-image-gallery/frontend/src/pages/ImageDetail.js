import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ImageDetail.css";

const ImageDetail = () => {
  const { id } = useParams(); // Extract image ID from URL
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/images/${id}`);
        setImage(response.data);
      } catch (err) {
        setError("Failed to load image details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!image) return <div className="no-image-message">No image found</div>;

  return (
    <div className="image-detail-container">
      <h1 className="image-detail-header">{image.name}</h1>
      <img
        src={`http://localhost:5000/uploads/${image.imagePath.split("\\").pop()}`}
        alt={image.name}
        className="image-detail-image"
      />
      <p className="image-detail-description">{image.description}</p>
      <div className="image-detail-tags">
        {image.tags.map((tag, index) => (
          <span key={index} className="image-detail-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="image-detail-buttons">
        <button className="image-detail-button">Like</button>
        <button className="image-detail-button">Share</button>
      </div>
    </div>
  );
};

export default ImageDetail;
