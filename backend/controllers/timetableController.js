const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Get timetable for student/faculty
const getTimetable = async (req, res) => {
  try {
    const { branch, section, year, semester } = req.query;
    const user = req.user;

    let query = {};

    if (user.role === 'student') {
      query = {
        branch: user.branch,
        section: user.section,
        year: user.year,
        semester: user.semester
      };
    } else if (user.role === 'faculty') {
      // For faculty, get all timetables where they are assigned
      const timetables = await Timetable.find({
        'schedule.periods.faculty': user._id
      }).populate('schedule.periods.faculty', 'name');
      
      return res.json({
        success: true,
        timetables: timetables.map(tt => ({
          ...tt.toObject(),
          schedule: tt.schedule.map(day => ({
            ...day,
            periods: day.periods.filter(period => 
              period.faculty._id.toString() === user._id.toString()
            )
          })).filter(day => day.periods.length > 0)
        }))
      });
    } else if (user.role === 'admin') {
      if (branch && section && year && semester) {
        query = { branch, section, year: parseInt(year), semester: parseInt(semester) };
      }
    }

    const timetable = await Timetable.findOne(query)
      .populate('schedule.periods.faculty', 'name employeeId');

    res.json({
      success: true,
      timetable
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create or update timetable (Admin only)
const createTimetable = async (req, res) => {
  try {
    const { branch, section, year, semester, schedule } = req.body;

    // Validate faculty assignments
    for (const day of schedule) {
      for (const period of day.periods) {
        const faculty = await User.findById(period.faculty);
        if (!faculty || faculty.role !== 'faculty') {
          return res.status(400).json({ 
            message: `Invalid faculty assignment for ${period.subject}` 
          });
        }
      }
    }

    const timetable = await Timetable.findOneAndUpdate(
      { branch, section, year, semester },
      { branch, section, year, semester, schedule },
      { upsert: true, new: true }
    ).populate('schedule.periods.faculty', 'name employeeId');

    res.json({
      success: true,
      message: 'Timetable created/updated successfully',
      timetable
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update specific period (Admin only)
const updatePeriod = async (req, res) => {
  try {
    const { timetableId, day, periodIndex } = req.params;
    const periodData = req.body;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    const daySchedule = timetable.schedule.find(d => d.day === day);
    if (!daySchedule) {
      return res.status(404).json({ message: 'Day not found' });
    }

    if (periodIndex >= daySchedule.periods.length) {
      return res.status(404).json({ message: 'Period not found' });
    }

    daySchedule.periods[periodIndex] = { ...daySchedule.periods[periodIndex], ...periodData };
    await timetable.save();

    const updatedTimetable = await Timetable.findById(timetableId)
      .populate('schedule.periods.faculty', 'name employeeId');

    res.json({
      success: true,
      message: 'Period updated successfully',
      timetable: updatedTimetable
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete timetable (Admin only)
const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    await Timetable.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all timetables (Admin only)
const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate('schedule.periods.faculty', 'name employeeId')
      .sort({ branch: 1, section: 1, year: 1, semester: 1 });

    res.json({
      success: true,
      timetables
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTimetable,
  createTimetable,
  updatePeriod,
  deleteTimetable,
  getAllTimetables
};