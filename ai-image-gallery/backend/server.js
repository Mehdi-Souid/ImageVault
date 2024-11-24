const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const imageRoutes = require('./routes/imageRoute');
const userRoutes = require('./routes/UserRoute');
const categoryRoutes = require('./routes/CategoryRoute');

const app = express();

// Middleware
app.use(cors()); // Replace with your frontend domain or allow all origins with '*'
app.use(express.json()); // Body parsing is built into Express

// MongoDB connection
mongoose.connect('mongodb+srv://NovaFury:azerty@bloody.kumzafl.mongodb.net/vocabdb?retryWrites=true&w=majority', {
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);  // Exit process if MongoDB connection fails
    });

// Set up routes
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Serve images from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
