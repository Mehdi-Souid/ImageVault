const { analyzeImage } = require('../services/aiService');
const path = require('path');
const multer = require('multer');
const Category = require('../models/Category');
const Image = require('../models/Image');
const User = require('../models/User');  // Assuming you have a User model
// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
cb(null, path.join(__dirname, '..', 'uploads/'));
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        cb(null, Date.now() + fileExtension); // Use current timestamp as the filename to avoid name conflicts
    },
});

const upload = multer({ storage: storage });

// Create a new image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // The image file path (where the image is saved on the server)
        const imageUrl = req.file.path;  // Store the local file path

        // Extract additional data from request body (if provided)
        const { description, tags, userId } = req.body;

        // Call the AI service to analyze the image and get results
        const aiAnalysisResult = await analyzeImage(imageUrl); // You should have analyzeImage function here

        // If AI analysis fails, log the error and send a response
        if (!aiAnalysisResult || aiAnalysisResult.error) {
            console.error("AI analysis error:", aiAnalysisResult ? aiAnalysisResult.error : "No result returned");
            return res.status(500).json({ message: 'Image analysis failed', error: aiAnalysisResult });
        }

        // Log AI analysis result (optional for debugging)
        console.log("AI analysis result:", aiAnalysisResult);

        // Limit tags to the first 10
        const limitedTags = aiAnalysisResult.tags.slice(0, 10);

        // Try to find an existing category based on the tags (e.g., by matching any of the tags to an existing category)
        let category = null;
        for (const tag of limitedTags) {
            category = await Category.findOne({ name: tag }); // Search for category by tag name
            if (category) break; // If a match is found, stop searching
        }

        // If no category is found, create a new category using the first tag
        if (!category) {
            const newCategory = new Category({
                name: limitedTags[0],  // Use the first tag as the category name
                description: `Category for ${limitedTags[0]}`,  // Optional: You can create a description
            });
            category = await newCategory.save();  // Save the new category to the database
        }

        // Create a new image object and save it to the database
        const newImage = new Image({
            imagePath: imageUrl,  // Store the correct image path
            description: aiAnalysisResult.description || description, // Use AI description or user-provided one
            tags: limitedTags,  // Use the first 10 tags
            categoryId: category._id,  // Set categoryId to the found or new category
            userId: userId,  // Assign userId (optional)
        });

        // Save the image document in the database
        await newImage.save();
        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });

    } catch (error) {
        console.error("Error uploading image:", error.message);
        res.status(400).json({ error: error.message });
    }
};


// Get all images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Image.find().populate('categoryId', 'name').populate('userId', 'username');
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an image by ID
exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).populate('categoryId', 'name').populate('userId', 'username');

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching image data' });
    }
};

// Update an image's details
exports.updateImage = async (req, res) => {
    try {
        const { description, tags, categoryId } = req.body;

        // If a new file is uploaded, update the image path
        let updateData = { description, tags, categoryId };

        if (req.file) {
            updateData.imageUrl = req.file.path; // Update the image URL with the new file path
        }

        const updatedImage = await Image.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an image
exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        image.favorited = true; // Mark image as favorited
        await image.save();

        res.status(200).json({ message: 'Image added to favorites', image });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add to Trash
exports.addToTrash = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        image.trashed = true; // Mark image as trashed
        await image.save();

        res.status(200).json({ message: 'Image added to trash', image });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// In controller, change getFavoriteImages and getTrashImages to match the actual field names
exports.getFavoriteImages = async (req, res) => {
    try {
        const favoriteImages = await Image.find({ favorited: true }); // Change 'favorites' to 'favorited'
        res.status(200).json(favoriteImages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching favorite images' });
    }
};

exports.getTrashImages = async (req, res) => {
    try {
        const trashImages = await Image.find({ trashed: true }); // Change 'trash' to 'trashed'
        res.status(200).json(trashImages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching trashed images' });
    }
};
exports.DeleteFromTrash = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedImage = await Image.findByIdAndUpdate(
        id,
        { trashed: false }, // Set trashed to false
        { new: true }       // Return the updated image
      );
  
      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.json({ message: 'Image restored from trash successfully', image: updatedImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to restore image from trash' });
    }
  };
  
  // Function to handle "Delete from Favorites" (set favorited to false)
  exports.DeleteFromFavorites = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedImage = await Image.findByIdAndUpdate(
        id,
        { favorited: false }, // Set favorited to false
        { new: true }         // Return the updated image
      );
  
      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.json({ message: 'Image removed from favorites successfully', image: updatedImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to remove image from favorites' });
    }
  };
exports.getImagesByCategory = async (req, res) => {
    const { categoryId } = req.params;
  
    try {
      console.log('Received categoryId:', categoryId); // Debugging log
  
      const images = await Image.find({ categoryId }); // Replace with your DB query
      console.log('Images found:', images); // Log the result
  
      if (!images.length) {
        return res.status(404).json({ message: 'No images found for this category.' });
      }
  
      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching images by category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Export upload middleware for handling file upload
exports.upload = upload.single('image'); // Single image upload