const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/favorites', imageController.getFavoriteImages);
router.get('/trash', imageController.getTrashImages);
router.put('/:id/trashDelete', imageController.DeleteFromTrash);
router.put('/:id/favoriteDelete', imageController.DeleteFromFavorites);
router.get('/category/:categoryId', imageController.getImagesByCategory);
// Upload image
router.post('/upload', imageController.upload, imageController.uploadImage);
// Get all images
router.get('/', imageController.getAllImages);
// Get image by ID
router.get('/:id', imageController.getImageById);

// Update image
router.put('/:id', imageController.upload, imageController.updateImage);

// Add to favorites
router.put('/:id/favorite', imageController.addToFavorites);

// Add to trash
router.put('/:id/trash', imageController.addToTrash);

// Delete image
router.delete('/:id', imageController.deleteImage);
module.exports = router;
