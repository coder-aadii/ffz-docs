const jwt = require('jsonwebtoken');

// Middleware to protect routes
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'yourSecretKey', (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;  // Attach userId to request
        next();  // Proceed to the next middleware or route handler
    });
}

module.exports = verifyToken;
