const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Timetable = require('../models/Timetable');
const Syllabus = require('../models/Syllabus');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_sms');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
      phone: '9876543210',
      isActive: true
    });

    // Create Faculty
    const facultyPassword = await bcrypt.hash('faculty123', 12);
    const faculty = [
      {
        name: 'Sumalatha',
        email: 'sumalatha@demo.com',
        password: facultyPassword,
        role: 'faculty',
        employeeId: 'FAC001',
        facultyDesignation: 'Assistant Professor',
        subjects: ['Compiler Design'],
        phone: '9876543211'
      },
      {
        name: 'Tukaram',
        email: 'tukaram@demo.com',
        password: facultyPassword,
        role: 'faculty',
        employeeId: 'FAC002',
        facultyDesignation: 'Professor',
        subjects: ['Cloud Computing'],
        phone: '9876543212'
      },
      {
        name: 'Murlidher',
        email: 'murlidher@demo.com',
        password: facultyPassword,
        role: 'faculty',
        employeeId: 'FAC003',
        facultyDesignation: 'Assistant Professor',
        subjects: ['Cryptography', 'Computer Networking'],
        phone: '9876543213'
      },
      {
        name: 'Saleha',
        email: 'saleha@demo.com',
        password: facultyPassword,
        role: 'faculty',
        employeeId: 'FAC004',
        facultyDesignation: 'Assistant Professor',
        subjects: ['Principles of Entrepreneurship'],
        phone: '9876543214'
      }
    ];

    // Create Students
    const studentPassword = await bcrypt.hash('student123', 12);
    const students = [
      {
        name: 'Anshu Kumar',
        email: 'anshu@demo.com',
        password: studentPassword,
        role: 'student',
        rollNumber: '226F1A05A4',
        branch: 'CSE',
        section: 'A',
        year: 3,
        semester: 5,
        regulation: 'R22',
        phone: '9876543215'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@demo.com',
        password: studentPassword,
        role: 'student',
        rollNumber: '226F1A05B1',
        branch: 'CSE',
        section: 'B',
        year: 3,
        semester: 5,
        regulation: 'R22',
        phone: '9876543216'
      },
      {
        name: 'Rahul Singh',
        email: 'rahul@demo.com',
        password: studentPassword,
        role: 'student',
        rollNumber: '226F1A66A1',
        branch: 'CSD',
        section: 'A',
        year: 3,
        semester: 5,
        regulation: 'R22',
        phone: '9876543217'
      }
    ];

    // Save all users
    await admin.save();
    const savedFaculty = await User.insertMany(faculty);
    await User.insertMany(students);

    console.log('Users seeded successfully!');
    return savedFaculty;
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedTimetables = async (faculty) => {
  try {
    // Clear existing timetables
    await Timetable.deleteMany({});

    // Create timetable for CSE-A, 3rd year, 5th semester
    const cseATimetable = new Timetable({
      branch: 'CSE',
      section: 'A',
      year: 3,
      semester: 5,
      schedule: [
        {
          day: 'Monday',
          periods: [
            {
              startTime: '09:00',
              endTime: '10:00',
              subject: 'Compiler Design',
              faculty: faculty[0]._id, // Sumalatha
              room: 'R203',
              type: 'Theory'
            },
            {
              startTime: '10:00',
              endTime: '11:00',
              subject: 'Cloud Computing',
              faculty: faculty[1]._id, // Tukaram
              room: 'R204',
              type: 'Theory'
            },
            {
              startTime: '11:15',
              endTime: '12:15',
              subject: 'Cryptography',
              faculty: faculty[2]._id, // Murlidher
              room: 'R205',
              type: 'Theory'
            }
          ]
        },
        {
          day: 'Tuesday',
          periods: [
            {
              startTime: '09:00',
              endTime: '10:00',
              subject: 'Computer Networking',
              faculty: faculty[2]._id, // Murlidher
              room: 'R203',
              type: 'Theory'
            },
            {
              startTime: '10:00',
              endTime: '11:00',
              subject: 'Principles of Entrepreneurship',
              faculty: faculty[3]._id, // Saleha
              room: 'R204',
              type: 'Theory'
            }
          ]
        }
      ]
    });

    // Create timetable for CSE-B, 3rd year, 5th semester
    const cseBTimetable = new Timetable({
      branch: 'CSE',
      section: 'B',
      year: 3,
      semester: 5,
      schedule: [
        {
          day: 'Monday',
          periods: [
            {
              startTime: '09:00',
              endTime: '10:00',
              subject: 'Cloud Computing',
              faculty: faculty[1]._id, // Tukaram
              room: 'R206',
              type: 'Theory'
            },
            {
              startTime: '10:00',
              endTime: '11:00',
              subject: 'Compiler Design',
              faculty: faculty[0]._id, // Sumalatha
              room: 'R207',
              type: 'Theory'
            }
          ]
        }
      ]
    });

    await cseATimetable.save();
    await cseBTimetable.save();

    console.log('Timetables seeded successfully!');
  } catch (error) {
    console.error('Error seeding timetables:', error);
  }
};

const seedSyllabus = async () => {
  try {
    // Clear existing syllabus
    await Syllabus.deleteMany({});

    // Create syllabus for CSE, R22, 3rd year, 5th semester
    const cseSyllabus = new Syllabus({
      branch: 'CSE',
      regulation: 'R22',
      year: 3,
      semester: 5,
      subjects: [
        {
          subjectCode: 'CS501',
          subjectName: 'Compiler Design',
          credits: 4,
          description: 'Introduction to compiler design principles and implementation techniques',
          units: [
            {
              unitNumber: 1,
              unitTitle: 'Introduction to Compilers',
              topics: ['Phases of Compiler', 'Lexical Analysis', 'Syntax Analysis'],
              hours: 10
            },
            {
              unitNumber: 2,
              unitTitle: 'Semantic Analysis',
              topics: ['Type Checking', 'Symbol Tables', 'Error Recovery'],
              hours: 10
            }
          ]
        },
        {
          subjectCode: 'CS502',
          subjectName: 'Cloud Computing',
          credits: 4,
          description: 'Fundamentals of cloud computing technologies and services',
          units: [
            {
              unitNumber: 1,
              unitTitle: 'Cloud Computing Fundamentals',
              topics: ['Cloud Models', 'Service Models', 'Deployment Models'],
              hours: 10
            }
          ]
        },
        {
          subjectCode: 'CS503',
          subjectName: 'Cryptography',
          credits: 3,
          description: 'Introduction to cryptographic algorithms and security protocols'
        },
        {
          subjectCode: 'CS504',
          subjectName: 'Computer Networking',
          credits: 4,
          description: 'Network protocols, architectures, and communication systems'
        },
        {
          subjectCode: 'HS501',
          subjectName: 'Principles of Entrepreneurship',
          credits: 2,
          description: 'Entrepreneurship concepts and business development'
        }
      ],
      uploadedBy: null // Will be set to admin ID after admin is created
    });

    await cseSyllabus.save();

    console.log('Syllabus seeded successfully!');
  } catch (error) {
    console.error('Error seeding syllabus:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const faculty = await seedUsers();
    await seedTimetables(faculty);
    await seedSyllabus();
    
    console.log('Database seeding completed successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('Faculty: sumalatha@demo.com / faculty123');
    console.log('Student: anshu@demo.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };