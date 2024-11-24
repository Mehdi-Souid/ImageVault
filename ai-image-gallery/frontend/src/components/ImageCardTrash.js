import React, { useState } from 'react';
import '../styles/ImageCard.css';

const ImageCardTrash = ({ data, onClick, onUndoTrash }) => {
  const [trashed, setTrashed] = useState(data.trashed || false);

  // Helper function to generate image URL
  const getImageUrl = (path) => {
    return path ? `http://localhost:5000/uploads/${path.split('\\').pop()}` : 'http://localhost:5000/uploads/default-image.jpg';
  };

  // Handle Undo Trash Button Click
  const handleUndoTrashClick = (e) => {
    e.stopPropagation();  // Prevents triggering onClick for the image itself
    setTrashed(false);
    if (onUndoTrash) onUndoTrash(data._id); // Call the callback to undo the trash action
  };

  // Prevent rendering if trashed
  if (!trashed) return null;

  const { name, uploadedAt } = data;
  const formattedDate = uploadedAt ? new Date(uploadedAt).toLocaleDateString() : 'Unknown';
  const imageUrl = getImageUrl(data.imagePath);

  return (
    <div className="card image-card" onClick={() => onClick(data._id)}>
      <img
        src={imageUrl}
        alt={name}
        className="thumbnail"
      />
      <div className="image-info">
        <h4>{name}</h4>
        <p>Uploaded on: {formattedDate}</p>
      </div>
      <div className="card-actions">
        <button className="undo-trash-btn" onClick={handleUndoTrashClick}>
          ↩️ Undo
        </button>
      </div>
    </div>
  );
};

export default ImageCardTrash;
