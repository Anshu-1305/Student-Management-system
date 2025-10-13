const Syllabus = require('../models/Syllabus');
const axios = require('axios');

// Get syllabus for student/faculty
const getSyllabus = async (req, res) => {
  try {
    const { branch, regulation, year, semester } = req.query;
    const user = req.user;

    let query = {};

    if (user.role === 'student') {
      query = {
        branch: user.branch,
        regulation: user.regulation,
        year: user.year,
        semester: user.semester
      };
    } else if (user.role === 'admin' || user.role === 'faculty') {
      if (branch && regulation && year && semester) {
        query = { 
          branch, 
          regulation, 
          year: parseInt(year), 
          semester: parseInt(semester) 
        };
      }
    }

    const syllabus = await Syllabus.findOne(query)
      .populate('uploadedBy', 'name');

    if (!syllabus) {
      // Try to fetch from JNTUH if not found locally
      const jntuhSyllabus = await fetchJNTUHSyllabus(query);
      if (jntuhSyllabus) {
        return res.json({
          success: true,
          syllabus: jntuhSyllabus,
          source: 'JNTUH'
        });
      }
      
      return res.status(404).json({ 
        message: 'Syllabus not found for the specified criteria' 
      });
    }

    res.json({
      success: true,
      syllabus,
      source: 'local'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create or update syllabus (Admin only)
const createSyllabus = async (req, res) => {
  try {
    const { branch, regulation, year, semester, subjects } = req.body;

    const syllabus = await Syllabus.findOneAndUpdate(
      { branch, regulation, year, semester },
      { 
        branch, 
        regulation, 
        year, 
        semester, 
        subjects,
        uploadedBy: req.user._id
      },
      { upsert: true, new: true }
    ).populate('uploadedBy', 'name');

    res.json({
      success: true,
      message: 'Syllabus created/updated successfully',
      syllabus
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update specific subject in syllabus (Admin only)
const updateSubject = async (req, res) => {
  try {
    const { syllabusId, subjectCode } = req.params;
    const subjectData = req.body;

    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    const subjectIndex = syllabus.subjects.findIndex(
      sub => sub.subjectCode === subjectCode
    );

    if (subjectIndex === -1) {
      // Add new subject
      syllabus.subjects.push(subjectData);
    } else {
      // Update existing subject
      syllabus.subjects[subjectIndex] = { 
        ...syllabus.subjects[subjectIndex], 
        ...subjectData 
      };
    }

    await syllabus.save();

    const updatedSyllabus = await Syllabus.findById(syllabusId)
      .populate('uploadedBy', 'name');

    res.json({
      success: true,
      message: 'Subject updated successfully',
      syllabus: updatedSyllabus
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete syllabus (Admin only)
const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;

    await Syllabus.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all syllabi (Admin only)
const getAllSyllabi = async (req, res) => {
  try {
    const syllabi = await Syllabus.find()
      .populate('uploadedBy', 'name')
      .sort({ branch: 1, regulation: 1, year: 1, semester: 1 });

    res.json({
      success: true,
      syllabi
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to fetch syllabus from JNTUH website
const fetchJNTUHSyllabus = async (query) => {
  try {
    // This is a mock implementation - replace with actual JNTUH API/scraping logic
    const jntuhBaseUrl = 'https://jntuh.ac.in/syllabus';
    
    // Mock JNTUH syllabus structure
    const mockJNTUHSyllabus = {
      branch: query.branch,
      regulation: query.regulation,
      year: query.year,
      semester: query.semester,
      subjects: [
        {
          subjectCode: 'CS501',
          subjectName: 'Compiler Design',
          credits: 4,
          jntuhLink: `${jntuhBaseUrl}/${query.regulation}/${query.branch}/sem${query.semester}/CS501.pdf`,
          description: 'Introduction to compiler design and implementation'
        },
        {
          subjectCode: 'CS502',
          subjectName: 'Cloud Computing',
          credits: 4,
          jntuhLink: `${jntuhBaseUrl}/${query.regulation}/${query.branch}/sem${query.semester}/CS502.pdf`,
          description: 'Cloud computing concepts and technologies'
        }
      ]
    };

    return mockJNTUHSyllabus;
  } catch (error) {
    console.error('Error fetching JNTUH syllabus:', error);
    return null;
  }
};

module.exports = {
  getSyllabus,
  createSyllabus,
  updateSubject,
  deleteSyllabus,
  getAllSyllabi
};