import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Lazy loading pages
const SignIn = lazy(() => import('./pages/SignInPage'));
const SignUp = lazy(() => import('./pages/SignUpPage'));
const Gallery = lazy(() => import('./pages/GalleryPage'));
const Home = lazy(() => import('./pages/HomePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TrashPage = lazy(() => import('./pages/TrashPage'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const AddImage = lazy(() => import('./pages/AddImagePage'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail')); // New page
const ImageDetail = lazy(() => import('./pages/ImageDetail')); // New page

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication state on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!userId); // Set true if userId exists
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signin"
            element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trash"
            element={
              <ProtectedRoute>
                <TrashPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddImage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute>
                <CategoryDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images/:id"
            element={
              <ProtectedRoute>
                <ImageDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
