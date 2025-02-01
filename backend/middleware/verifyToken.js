const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Middleware to protect routes
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Use the secret key from the environment variable
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;  // Attach userId to request
        next();  // Proceed to the next middleware or route handler
    });
}

module.exports = verifyToken;
