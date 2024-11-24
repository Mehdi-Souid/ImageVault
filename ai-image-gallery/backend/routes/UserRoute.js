const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get a user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

// Sign in
router.post('/signin', userController.signInUser);

module.exports = router;
