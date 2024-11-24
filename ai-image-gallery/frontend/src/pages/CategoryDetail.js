import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Categorydetail.css"; // Import the CSS file

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({ name: "", items: [] });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Fetch category details
        const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${id}`);
        setCategory(categoryResponse.data || { name: "", items: [] });

        // Fetch images by category
        const imagesResponse = await axios.get(`http://localhost:5000/api/images/category/${id}`);
        setImages(imagesResponse.data || []);
      } catch (err) {
        setError("Failed to load category or images. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if ((!category.items || category.items.length === 0) && images.length === 0) {
    return <div className="no-images-message">No items or images found in this category.</div>;
  }

  return (
    <div className="category-detail-container">
      <h1 className="category-detail-header">{category.name || "Unnamed Category"}</h1>

      {category.items && category.items.length > 0 && (
        <>
          <h2 className="category-detail-subheader">Items</h2>
          <ul className="category-detail-items">
            {category.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </>
      )}

      {images.length > 0 && (
        <>
          <h2 className="category-detail-subheader">Images</h2>
          <div className="image-grid">
            {images.map((image) => (
              <img
                key={image.id}
                src={`http://localhost:5000/uploads/${image.imagePath.split("\\").pop()}`}
                alt={image.name || "Category image"}
                className="category-detail-image"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
