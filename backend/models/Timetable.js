const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  branch: {
    type: String,
    enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    required: true
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
    required: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: true
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    periods: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      subject: {
        type: String,
        required: true
      },
      faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      room: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['Theory', 'Lab', 'Tutorial'],
        default: 'Theory'
      }
    }]
  }],
  academicYear: {
    type: String,
    required: true,
    default: '2024-25'
  }
}, {
  timestamps: true
});

// Compound index for unique timetable per class
timetableSchema.index({ branch: 1, section: 1, year: 1, semester: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);