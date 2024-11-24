import React from 'react';
import '../styles/CategoryCard.css';

const CategoryCard = ({ data, onClick }) => {
  const { name, images = [] } = data; // Removed count

  const getImageUrl = (path) => {
    return path
      ? `http://localhost:5000/uploads/${path.split('\\').pop()}`
      : 'http://localhost:5000/uploads/default-image.jpg';
  };

  return (
    <div className="card category-card" onClick={onClick}>
      <div className="image-grid">
        {images.length > 0 ? (
          images.slice(0, 4).map((image) => {
            const imageUrl = getImageUrl(image.imagePath);
            return (
              <img key={image._id} src={imageUrl} alt={name} className="thumbnail" />
            );
          })
        ) : (
          <p>No images available</p>
        )}
      </div>
      <div className="category-info">
        <h3>{name}</h3>
        <p>{images.length} Images</p> {/* Dynamically calculate image count */}
      </div>
    </div>
  );
};

export default CategoryCard;
