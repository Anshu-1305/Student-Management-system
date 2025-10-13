const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'academic', 'fee', 'exam', 'attendance', 'result'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'faculty', 'parents', 'specific'],
    default: 'all'
  },
  specificTargets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  branch: {
    type: String,
    enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL', 'all']
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C', 'all']
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: Date,
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);