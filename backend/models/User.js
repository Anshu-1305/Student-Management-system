const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student', 'parent'],
    required: true
  },
  rollNumber: {
    type: String,
    sparse: true,
    unique: true
  },
  employeeId: {
    type: String,
    sparse: true,
    unique: true
  },
  branch: {
    type: String,
    enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    required: function() { return this.role === 'student'; }
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: function() { return this.role === 'student'; }
  },
  regulation: {
    type: String,
    default: 'R22',
    required: function() { return this.role === 'student'; }
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: function() { return this.role === 'student'; }
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: function() { return this.role === 'student'; }
  },
  facultyDesignation: {
    type: String,
    enum: ['Professor', 'Assistant Professor', 'HOD', 'Assistant HOD'],
    required: function() { return this.role === 'faculty'; }
  },
  subjects: [{
    type: String
  }],
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.role === 'parent'; }
  },
  phone: String,
  address: String,
  profilePicture: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);