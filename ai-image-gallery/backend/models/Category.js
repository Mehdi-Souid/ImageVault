// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, // Ensure each category name is unique
    },
    description: { 
        type: String, 
        required: false, // Optional description
    },
});

module.exports = mongoose.model('Category', categorySchema);
