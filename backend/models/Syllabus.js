const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  branch: {
    type: String,
    enum: ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    required: true
  },
  regulation: {
    type: String,
    required: true,
    default: 'R22'
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
  subjects: [{
    subjectCode: {
      type: String,
      required: true
    },
    subjectName: {
      type: String,
      required: true
    },
    credits: {
      type: Number,
      required: true
    },
    syllabusFile: {
      type: String, // URL or file path
    },
    jntuhLink: {
      type: String, // Direct JNTUH syllabus link
    },
    description: String,
    units: [{
      unitNumber: Number,
      unitTitle: String,
      topics: [String],
      hours: Number
    }]
  }],
  academicYear: {
    type: String,
    required: true,
    default: '2024-25'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for unique syllabus per branch, regulation, year, semester
syllabusSchema.index({ branch: 1, regulation: 1, year: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);