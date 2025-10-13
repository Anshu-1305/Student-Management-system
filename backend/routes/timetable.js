const express = require('express');
const {
  getTimetable,
  createTimetable,
  updatePeriod,
  deleteTimetable,
  getAllTimetables
} = require('../controllers/timetableController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get timetable (All authenticated users)
router.get('/', auth, getTimetable);

// Get all timetables (Admin only)
router.get('/all', auth, authorize('admin'), getAllTimetables);

// Create/Update timetable (Admin only)
router.post('/', auth, authorize('admin'), createTimetable);

// Update specific period (Admin only)
router.put('/:timetableId/day/:day/period/:periodIndex', auth, authorize('admin'), updatePeriod);

// Delete timetable (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteTimetable);

module.exports = router;
