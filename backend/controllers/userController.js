const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// @route   POST api/users
// @desc    Register a user
// @access  Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'student'
    });

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Make sure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    // Add debug logging
    console.log('Creating JWT token with payload:', JSON.stringify(payload));
    console.log('Using JWT_SECRET (first 3 chars):', process.env.JWT_SECRET.substring(0, 3));
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.error('Error signing JWT token:', err);
          return res.status(500).json({ msg: 'Error creating authentication token' });
        }
        console.log('Token created successfully (first 15 chars):', token.substring(0, 15));
        // Return user data along with token
        const userData = {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(400).json({ msg: 'Invalid credentials - password comparison error' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Make sure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    // Add debug logging
    console.log('Creating JWT token with payload:', JSON.stringify(payload));
    console.log('Using JWT_SECRET (first 3 chars):', process.env.JWT_SECRET.substring(0, 3));
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.error('Error signing JWT token:', err);
          return res.status(500).json({ msg: 'Error creating authentication token' });
        }
        console.log('Token created successfully (first 15 chars):', token.substring(0, 15));
        // Return user data along with token
        const userData = {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};