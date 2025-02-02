// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // Correct import of verifyToken

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        // Log the password before hashing to verify the input
        console.log('Password before hashing:', password);

        // Create new user (password will be hashed automatically due to pre-save hook in the schema)
        const newUser = new User({ name, email, password });

        // Save the new user
        await newUser.save();

        // Log the hashed password after saving to verify
        console.log('User registered successfully:', newUser);

        // Send success response
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token in response
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// GET current user route
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user); // Get user by ID from JWT
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Send user data (excluding password)
        res.json({
            name: user.name,
            email: user.email,
            _id: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
