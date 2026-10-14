const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  // Optional for pupil accounts, which log in with a username instead
  email: {
    type: String,
    required: function() { return !this.username; },
    unique: true,
    sparse: true
  },
  // Codename login for pupils (e.g. "10X-07") so no personal data is stored
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  registeredOn: { 
    type: Date, 
    default: Date.now 
  },
  // Student specific fields
  yearGroup: { type: Number },
  class: { type: String },
  preferences: {
    learningStyle: { type: String },
    preferredResourceTypes: [String],
    additionalNeeds: { type: String }
  },
  // Teacher specific fields
  department: { type: String },
  classes: [String],
  // Common fields
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Password hash middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);