const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Routes
app.use('/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
