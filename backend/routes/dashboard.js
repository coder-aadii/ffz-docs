const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Import the middleware

// Protected route - Dashboard
router.get('/pages/dashboard', verifyToken, (req, res) => {
    // Example: You can return user data here.
    res.json({ message: 'Welcome to your dashboard', userId: req.userId });
});

module.exports = router;
