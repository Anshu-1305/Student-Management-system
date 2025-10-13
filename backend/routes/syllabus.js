const express = require('express');
const {
  getSyllabus,
  createSyllabus,
  updateSubject,
  deleteSyllabus,
  getAllSyllabi
} = require('../controllers/syllabusController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get syllabus (All authenticated users)
router.get('/', auth, getSyllabus);

// Get all syllabi (Admin only)
router.get('/all', auth, authorize('admin'), getAllSyllabi);

// Create/Update syllabus (Admin only)
router.post('/', auth, authorize('admin'), createSyllabus);

// Update specific subject (Admin only)
router.put('/:syllabusId/subject/:subjectCode', auth, authorize('admin'), updateSubject);

// Delete syllabus (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteSyllabus);

module.exports = router;