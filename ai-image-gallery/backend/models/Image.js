// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imagePath: { 
        type: String, 
        required: true, // Store the local path to the image in the 'uploads' folder
    },
    tags: { 
        type: [String], 
        required: true, // Array of tags
    },
    description: { 
        type: String, 
        required: true, // Description of the image
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', // Reference to Category collection
        required: false, // Optional field
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to User collection
        required: false, // Optional field
    },
    trashed: { 
        type: Boolean, 
        default: false, // Indicates whether the image is in the trash
    },
    favorited: { 
        type: Boolean, 
        default: false, // Indicates whether the image is marked as a favorite
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now, // Timestamp for when the image was uploaded
    },
});

module.exports = mongoose.model('Image', imageSchema);
