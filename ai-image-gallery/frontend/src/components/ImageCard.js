import React, { useState } from 'react';
import '../styles/ImageCard.css';

const ImageCard = ({ data, onClick, onFavorite, onTrash }) => {
  const [favorited, setFavorited] = useState(data.favorited || false);
  const [trashed, setTrashed] = useState(data.trashed || false);

  const getImageUrl = (path) => {
    return path
      ? `http://localhost:5000/uploads/${path.split('\\').pop()}`
      : 'http://localhost:5000/uploads/default-image.jpg';
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
    if (onFavorite) onFavorite(data._id, !favorited);
  };

  const handleTrashClick = (e) => {
    e.stopPropagation();
    setTrashed(true);
    if (onTrash) onTrash(data._id);
  };

  if (trashed) return null;

  const { name, tags = [], uploadedAt } = data;
  const formattedDate = uploadedAt ? new Date(uploadedAt).toLocaleDateString() : 'Unknown';
  const imageUrl = getImageUrl(data.imagePath);

  return (
    <div className="card image-card" onClick={() => onClick(data._id)}>
      <img src={imageUrl} alt={name} className="thumbnail" />
      <div className="image-info">
        <h4>{name}</h4>
        <p>Uploaded on: {formattedDate}</p>
        <p>Tags: {tags.join(', ')}</p>
      </div>
      <div className="card-actions">
        <button
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          {favorited ? '❤️' : '🖤'}
        </button>
        <button className="trash-btn" onClick={handleTrashClick}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
