import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter, Download, Plus, Edit, Trash2, BookOpen, Users, Video, Bell, Search, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EnhancedTimetable = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedView, setSelectedView] = useState('week');
  const [selectedClass, setSelectedClass] = useState('CSE-A');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  // Enhanced timetable data with comprehensive details
  const mockTimetableData = {
    'CSE-A': {
      Monday: [
        { 
          time: '9:00-10:00', 
          subject: 'Compiler Design', 
          faculty: 'Sumalatha', 
          room: 'R203', 
          type: 'Theory',
          subjectCode: 'CS501',
          credits: 4,
          attendance: 85,
          nextTopic: 'Lexical Analysis',
          facultyId: 'FAC001',
          semester: 5,
          branch: 'CSE',
          section: 'A'
        },
        { 
          time: '10:00-11:00', 
          subject: 'Cloud Computing', 
          faculty: 'Tukaram', 
          room: 'R204', 
          type: 'Theory',
          subjectCode: 'CS502',
          credits: 4,
          attendance: 92,
          nextTopic: 'AWS Services',
          facultyId: 'FAC002',
          semester: 5,
          branch: 'CSE',
          section: 'A'
        },
        { 
          time: '11:15-12:15', 
          subject: 'Cryptography', 
          faculty: 'Murlidher', 
          room: 'R205', 
          type: 'Theory',
          subjectCode: 'CS503',
          credits: 3,
          attendance: 78,
          nextTopic: 'RSA Algorithm',
          facultyId: 'FAC003',
          semester: 5,
          branch: 'CSE',
          section: 'A'
        },
        { 
          time: '1:15-2:15', 
          subject: 'Computer Networks Lab', 
          faculty: 'Murlidher', 
          room: 'Lab-1', 
          type: 'Lab',
          subjectCode: 'CS504L',
          credits: 2,
          attendance: 95,
          nextTopic: 'Socket Programming',
          facultyId: 'FAC003',
          semester: 5,
          branch: 'CSE',
          section: 'A'
        },
        { 
          time: '2:15-3:15', 
          subject: 'Entrepreneurship', 
          faculty: 'Saleha', 
          room: 'R207', 
          type: 'Theory',
          subjectCode: 'HS501',
          credits: 2,
          attendance: 88,
          nextTopic: 'Business Models',
          facultyId: 'FAC004',
          semester: 5,
          branch: 'CSE',
          section: 'A'
        }
      ],
      Tuesday: [
        { time: '9:00-10:00', subject: 'Cloud Computing', faculty: 'Tukaram', room: 'R204', type: 'Theory', subjectCode: 'CS502', credits: 4, attendance: 90, nextTopic: 'Docker Containers', facultyId: 'FAC002' },
        { time: '10:00-11:00', subject: 'Compiler Design Lab', faculty: 'Sumalatha', room: 'Lab-2', type: 'Lab', subjectCode: 'CS501L', credits: 2, attendance: 87, nextTopic: 'Lex Tool', facultyId: 'FAC001' },
        { time: '11:15-12:15', subject: 'Computer Networks', faculty: 'Murlidher', room: 'R205', type: 'Theory', subjectCode: 'CS504', credits: 4, attendance: 82, nextTopic: 'TCP/IP Protocol', facultyId: 'FAC003' },
        { time: '1:15-2:15', subject: 'Cryptography Lab', faculty: 'Murlidher', room: 'Lab-3', type: 'Lab', subjectCode: 'CS503L', credits: 2, attendance: 91, nextTopic: 'Encryption Algorithms', facultyId: 'FAC003' }
      ],
      Wednesday: [
        { time: '9:00-10:00', subject: 'Entrepreneurship', faculty: 'Saleha', room: 'R207', type: 'Theory', subjectCode: 'HS501', credits: 2, attendance: 85, nextTopic: 'Startup Ecosystem', facultyId: 'FAC004' },
        { time: '10:00-11:00', subject: 'Compiler Design', faculty: 'Sumalatha', room: 'R203', type: 'Theory', subjectCode: 'CS501', credits: 4, attendance: 89, nextTopic: 'Syntax Analysis', facultyId: 'FAC001' },
        { time: '11:15-12:15', subject: 'Cloud Computing Lab', faculty: 'Tukaram', room: 'Lab-4', type: 'Lab', subjectCode: 'CS502L', credits: 2, attendance: 93, nextTopic: 'AWS EC2 Setup', facultyId: 'FAC002' }
      ],
      Thursday: [
        { time: '9:00-10:00', subject: 'Computer Networks', faculty: 'Murlidher', room: 'R205', type: 'Theory', subjectCode: 'CS504', credits: 4, attendance: 86, nextTopic: 'Network Security', facultyId: 'FAC003' },
        { time: '10:00-11:00', subject: 'Cryptography Lab', faculty: 'Murlidher', room: 'Lab-3', type: 'Lab', subjectCode: 'CS503L', credits: 2, attendance: 88, nextTopic: 'Digital Signatures', facultyId: 'FAC003' },
        { time: '11:15-12:15', subject: 'Compiler Design', faculty: 'Sumalatha', room: 'R203', type: 'Theory', subjectCode: 'CS501', credits: 4, attendance: 91, nextTopic: 'Semantic Analysis', facultyId: 'FAC001' }
      ],
      Friday: [
        { time: '9:00-10:00', subject: 'Cloud Computing', faculty: 'Tukaram', room: 'R204', type: 'Theory', subjectCode: 'CS502', credits: 4, attendance: 87, nextTopic: 'Microservices', facultyId: 'FAC002' },
        { time: '10:00-11:00', subject: 'Entrepreneurship', faculty: 'Saleha', room: 'R207', type: 'Theory', subjectCode: 'HS501', credits: 2, attendance: 90, nextTopic: 'Funding Sources', facultyId: 'FAC004' },
        { time: '11:15-12:15', subject: 'Computer Networks', faculty: 'Murlidher', room: 'R205', type: 'Theory', subjectCode: 'CS504', credits: 4, attendance: 84, nextTopic: 'Wireless Networks', facultyId: 'FAC003' }
      ],
      Saturday: [
        { time: '9:00-10:00', subject: 'Compiler Design Lab', faculty: 'Sumalatha', room: 'Lab-2', type: 'Lab', subjectCode: 'CS501L', credits: 2, attendance: 92, nextTopic: 'Parser Implementation', facultyId: 'FAC001' },
        { time: '10:00-11:00', subject: 'Cryptography', faculty: 'Murlidher', room: 'R206', type: 'Theory', subjectCode: 'CS503', credits: 3, attendance: 89, nextTopic: 'Hash Functions', facultyId: 'FAC003' }
      ]
    },
    'CSE-B': {
      Monday: [
        { time: '9:00-10:00', subject: 'Cloud Computing', faculty: 'Tukaram', room: 'R206', type: 'Theory', subjectCode: 'CS502', credits: 4, attendance: 88, nextTopic: 'Virtualization', facultyId: 'FAC002' },
        { time: '10:00-11:00', subject: 'Compiler Design', faculty: 'Sumalatha', room: 'R207', type: 'Theory', subjectCode: 'CS501', credits: 4, attendance: 85, nextTopic: 'Grammar Types', facultyId: 'FAC001' }
      ]
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:15-12:15', '1:15-2:15', '2:15-3:15', '3:15-4:15'];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTimetableData(mockTimetableData);
      if (user?.role === 'student') {
        setSelectedClass(`${user.branch}-${user.section}`);
      }
      setLoading(false);
    }, 1000);
  }, [user]);

  const getSubjectColor = (subject) => {
    const colors = {
      'Compiler Design': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      'Cloud Computing': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      'Cryptography': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      'Computer Networks': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      'Entrepreneurship': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
    };
    
    for (const [key, value] of Object.entries(colors)) {
      if (subject.includes(key)) {
        return value;
      }
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
  };

  const getCurrentDayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetableData[selectedClass]?.[today] || [];
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const todayClasses = timetableData[selectedClass]?.[today] || [];
    
    return todayClasses.filter(class_ => {
      const [startTime] = class_.time.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const classTime = hours * 60 + minutes;
      return classTime > currentTime;
    }).slice(0, 3);
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600 dark:text-green-400';
    if (attendance >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFilteredClasses = () => {
    const allClasses = [];
    Object.entries(timetableData[selectedClass] || {}).forEach(([day, classes]) => {
      classes.forEach(class_ => {
        allClasses.push({ ...class_, day });
      });
    });

    return allClasses.filter(class_ => {
      const matchesSearch = searchTerm === '' || 
        class_.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        class_.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        class_.room.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterSubject === 'all' || class_.subject === filterSubject;
      
      return matchesSearch && matchesFilter;
    });
  };

  const getAllSubjects = () => {
    const subjects = new Set();
    Object.values(timetableData[selectedClass] || {}).forEach(dayClasses => {
      dayClasses.forEach(class_ => subjects.add(class_.subject));
    });
    return Array.from(subjects);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'student' ? `${user.branch}-${user.section} • Semester ${user.semester}` : 'Class schedules and timings'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-48"
            />
          </div>

          {/* Filter */}
          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="input-field"
          >
            <option value="all">All Subjects</option>
            {getAllSubjects().map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {user?.role === 'admin' && (
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="CSE-A">CSE-A</option>
              <option value="CSE-B">CSE-B</option>
              <option value="CSD-A">CSD-A</option>
            </select>
          )}
          
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['week', 'day', 'upcoming', 'list'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === view
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-success">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500/10">
              <BookOpen className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Total Subjects</p>
              <p className="text-2xl font-bold text-black dark:text-white">{getAllSubjects().length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Hours/Week</p>
              <p className="text-2xl font-bold text-black dark:text-white">32</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg Attendance</p>
              <p className="text-2xl font-bold text-black dark:text-white">87%</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/10">
              <Video className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Lab Sessions</p>
              <p className="text-2xl font-bold text-black dark:text-white">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* List View */}
      {selectedView === 'list' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-primary-500" />
            All Classes
          </h3>
          
          <div className="space-y-3">
            {getFilteredClasses().map((class_, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${getSubjectColor(class_.subject)} hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white bg-opacity-50 flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{class_.subject}</h4>
                      <p className="text-sm opacity-75">{class_.subjectCode} • {class_.credits} Credits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{class_.day}</p>
                    <p className="text-sm opacity-75">{class_.time}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{class_.faculty}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{class_.room}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className={getAttendanceColor(class_.attendance)}>{class_.attendance}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">{class_.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      {selectedView === 'upcoming' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary-500" />
            Upcoming Classes
          </h3>
          
          <div className="space-y-4">
            {getUpcomingClasses().map((class_, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${getSubjectColor(class_.subject)} hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-white bg-opacity-50 flex items-center justify-center">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{class_.subject}</h4>
                      <p className="text-sm opacity-75">{class_.subjectCode} • {class_.credits} Credits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{class_.time}</p>
                    <p className="text-sm opacity-75">{class_.type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{class_.faculty}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{class_.room}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className={getAttendanceColor(class_.attendance)}>{class_.attendance}% Attendance</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Next: {class_.nextTopic}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {getUpcomingClasses().length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No more classes today</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Day View */}
      {selectedView === 'day' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-500" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {getCurrentDayClasses().map((class_, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${getSubjectColor(class_.subject)} hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-white bg-opacity-50 flex items-center justify-center">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{class_.subject}</h4>
                      <p className="text-sm opacity-75">{class_.subjectCode} • {class_.credits} Credits</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-sm font-medium">
                    {class_.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-sm">{class_.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-semibold">Faculty</p>
                      <p className="text-sm">{class_.faculty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-semibold">Room</p>
                      <p className="text-sm">{class_.room}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-semibold">Attendance</p>
                      <p className={`text-sm font-medium ${getAttendanceColor(class_.attendance)}`}>
                        {class_.attendance}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {class_.nextTopic && (
                  <div className="mt-4 p-3 bg-white bg-opacity-30 rounded-lg">
                    <p className="text-sm font-medium">Next Topic: {class_.nextTopic}</p>
                  </div>
                )}
              </div>
            ))}
            
            {getCurrentDayClasses().length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No classes scheduled for today</p>
                <p className="text-sm">Enjoy your free day!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly Timetable */}
      {selectedView === 'week' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Schedule</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                Week {currentWeek + 1}
              </span>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white w-24">
                    Time
                  </th>
                  {days.map((day) => (
                    <th key={day} className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-48">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                      {timeSlot}
                    </td>
                    {days.map((day) => {
                      const dayClasses = timetableData[selectedClass]?.[day] || [];
                      const classForSlot = dayClasses.find(c => c.time === timeSlot);
                      
                      return (
                        <td key={`${day}-${timeSlot}`} className="py-2 px-4">
                          {classForSlot ? (
                            <div className={`p-3 rounded-lg border-2 ${getSubjectColor(classForSlot.subject)} hover:shadow-md transition-all cursor-pointer group relative`}>
                              <div className="font-semibold text-sm mb-1">{classForSlot.subject}</div>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {classForSlot.faculty}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {classForSlot.room}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="inline-block px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs">
                                    {classForSlot.type}
                                  </span>
                                  <span className={`text-xs font-medium ${getAttendanceColor(classForSlot.attendance)}`}>
                                    {classForSlot.attendance}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-600">
                              <span className="text-xs">Free</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTimetable;