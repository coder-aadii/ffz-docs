const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const User = require('../models/User');
const router = express.Router();
require('dotenv').config(); // Load environment variables

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token using secret key from the environment variable
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });  // Send token back to frontend
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare password using the method in the User model
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token using secret key from the environment variable
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user' });
    }
});

// Get User Data (Profile)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) return res.status(401).json({ message: 'No token provided' });

        // Verify the token using secret key from the environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.userId); // Find the user by ID
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ name: user.name }); // Return the user's name
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
});

module.exports = router;
