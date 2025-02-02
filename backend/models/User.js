// User.js (Mongoose Model)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    console.log('Hashing password:', this.password); // Log the plain text password before hashing
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Hashed password:', this.password); // Log the hashed password after hashing
    next();
  } catch (error) {
    next(error);  // Pass the error to the next middleware
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = function (password) {
  console.log('Comparing password:', password, 'with stored hash:', this.password);

  return bcrypt.compare(password, this.password)
    .then(isMatch => {
      console.log('Password match result:', isMatch);
      return isMatch;
    })
    .catch(error => {
      console.error('Error comparing password:', error);
      return false;
    });
};

module.exports = mongoose.model('User', userSchema);
