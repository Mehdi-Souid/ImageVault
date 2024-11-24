import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavbarGallery';
import Sidebar from '../components/SideBar';
import ImageCard from '../components/ImageCard';
import CategoryCard from '../components/CategoryCard'; // New Component
import '../styles/Gallery.css';

const GalleryPage = () => {
  const [view, setView] = useState('categories'); // Current view: 'categories' or 'images'
  const [categories, setCategories] = useState([]); // All categories
  const [images, setImages] = useState([]); // All images
  const [filteredCategories, setFilteredCategories] = useState([]); // Filtered categories
  const [filteredImages, setFilteredImages] = useState([]); // Filtered images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const navigate = useNavigate();

  // Fetch data based on the view
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === 'categories') {
          const categoryResponse = await axios.get('http://localhost:5000/api/categories');
          setCategories(categoryResponse.data);
          setFilteredCategories(categoryResponse.data); // Initialize filtered categories
        } else {
          const imageResponse = await axios.get('http://localhost:5000/api/images');
          setImages(imageResponse.data);
          setFilteredImages(imageResponse.data); // Initialize filtered images
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  // Filter categories or images based on the search query
  useEffect(() => {
    if (view === 'categories') {
      setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredImages(
        images.filter(image =>
          image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [searchQuery, view, categories, images]);

  // Handle card clicks
  const handleCardClick = (type, id) => {
    if (type === 'category') navigate(`/categories/${id}`);
    else if (type === 'image') navigate(`/images/${id}`);
  };

  // Handle favorite toggle
  const handleFavorite = async (id, currentFavorited) => {
    const newFavorited = !currentFavorited;
    try {
      await axios.put(`http://localhost:5000/api/images/${id}/favorite`, { favorited: newFavorited });
      setImages(images.map(image => (image._id === id ? { ...image, favorited: newFavorited } : image)));
    } catch (err) {
      console.error('Error favoriting image:', err);
    }
  };

  // Handle trash toggle
  const handleTrash = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/images/${id}/trash`, { trashed: true });
      setImages(images.filter(image => image._id !== id));
    } catch (err) {
      console.error('Error trashing image:', err);
    }
  };

  // Render categories
  const renderCategories = () => {
    if (filteredCategories.length === 0) return <p>No categories available</p>;
  
    return filteredCategories.map(category => {
      // Calculate the count of images per category
      const imageCount = category.images ? category.images.length : 0;
  
      return (
        <CategoryCard
          key={category._id}
          data={{ ...category, count: imageCount }}  // Add count here
          onClick={() => handleCardClick('category', category._id)}
        />
      );
    });
  };

  // Render images
  const renderImages = () => {
    if (filteredImages.length === 0) return <p>No images available</p>;
    return filteredImages.map(image => (
      <ImageCard
        key={image._id}
        data={image}
        onClick={() => handleCardClick('image', image._id)}
        onTrash={handleTrash}
        onFavorite={() => handleFavorite(image._id, image.favorited)}
      />
    ));
  };

  return (
    <div className="gallery-page">
      <Navbar onSearch={setSearchQuery} /> {/* Pass setSearchQuery to Navbar */}
      <div className="main-content">
        <Sidebar setView={setView} /> {/* Sidebar updates the view */}
        <div className="gallery-content">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {view === 'categories' ? renderCategories() : renderImages()}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
