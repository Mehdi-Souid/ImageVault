const Category = require('../models/Category');
const Image = require('../models/Image'); // Assuming you have an Image model

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check if category with the same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        
        const newCategory = new Category({ name });
        await newCategory.save();
        
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await Category.find();

        // Fetch the first 4 images for each category
        const categoriesWithThumbnails = await Promise.all(
            categories.map(async (category) => {
                const images = await Image.find({ categoryId: category._id })
                    .limit(4) // Get only the first 4 images
                    .select('imagePath'); // Fetch only the image path field
                return {
                    ...category.toObject(), // Convert Mongoose document to plain object
                    images, // Include the thumbnails
                };
            })
        );

        res.status(200).json(categoriesWithThumbnails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching category data' });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Update the category's name
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
