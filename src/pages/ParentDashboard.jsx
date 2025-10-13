import React, { useState, useEffect } from 'react';
import { User, Calendar, BookOpen, TrendingUp, Bell, Mail, Phone, MessageCircle, Award, Clock, Users, AlertTriangle, CheckCircle, Eye, Download, Settings, BarChart3, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useBranding } from '../context/BrandingContext';
import DashboardSection from '../components/DashboardSection';

import ProfileSettings from '../components/ProfileSettings';
import ReportAnalysis from '../components/ReportAnalysis';

import { dataService } from '../services/dataService';

const ParentDashboard = ({ showChatOnly, setShowChatOnly }) => {
  const { user } = useAuth();
  const { activeSection } = useDashboard();
  const { branding } = useBranding();
  const [selectedChild, setSelectedChild] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showReportAnalysis, setShowReportAnalysis] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  // Mock child data
  const mockChildData = {
    id: 'STU001',
    name: 'Anshu Kumar',
    rollNumber: '226F1A05A4',
    branch: 'CSE',
    section: 'A',
    year: 3,
    semester: 5,
    regulation: 'R22',
    profilePicture: null,
    contact: {
      email: 'anshu@demo.com',
      phone: '9876543215'
    },
    academic: {
      cgpa: 8.9,
      sgpa: 9.1,
      totalCredits: 160,
      completedCredits: 120,
      rank: 5,
      totalStudents: 60
    },
    attendance: {
      overall: 87,
      subjects: [
        { subject: 'Compiler Design', attendance: 85, total: 40, present: 34, absent: 6 },
        { subject: 'Cloud Computing', attendance: 92, total: 38, present: 35, absent: 3 },
        { subject: 'Cryptography', attendance: 78, total: 35, present: 27, absent: 8 },
        { subject: 'Computer Networks', attendance: 89, total: 42, present: 37, absent: 5 },
        { subject: 'Entrepreneurship', attendance: 90, total: 30, present: 27, absent: 3 }
      ]
    },
    results: [
      { semester: 5, sgpa: 9.1, cgpa: 8.9, status: 'Current' },
      { semester: 4, sgpa: 8.8, cgpa: 8.8, status: 'Completed' },
      { semester: 3, sgpa: 8.9, cgpa: 8.9, status: 'Completed' },
      { semester: 2, sgpa: 9.0, cgpa: 9.0, status: 'Completed' },
      { semester: 1, sgpa: 8.7, cgpa: 8.7, status: 'Completed' }
    ],
    fees: {
      totalFee: 150000,
      paidAmount: 120000,
      pendingAmount: 30000,
      dueDate: '2024-03-15',
      status: 'Pending'
    },
    timetable: {
      Monday: [
        { time: '9:00-10:00', subject: 'Compiler Design', faculty: 'Sumalatha', room: 'R203' },
        { time: '10:00-11:00', subject: 'Cloud Computing', faculty: 'Tukaram', room: 'R204' },
        { time: '11:15-12:15', subject: 'Cryptography', faculty: 'Murlidher', room: 'R205' }
      ],
      Tuesday: [
        { time: '9:00-10:00', subject: 'Cloud Computing', faculty: 'Tukaram', room: 'R204' },
        { time: '10:00-11:00', subject: 'Computer Networks', faculty: 'Murlidher', room: 'R205' }
      ]
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'fee',
      title: 'Fee Payment Reminder',
      message: 'Semester fee payment of ₹30,000 is due on March 15, 2024',
      date: '2024-02-28',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Low Attendance Alert',
      message: 'Attendance in Cryptography is below 80% (78%)',
      date: '2024-02-27',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'academic',
      title: 'Exam Schedule Released',
      message: 'Mid-semester exam schedule has been published',
      date: '2024-02-26',
      priority: 'medium',
      read: true
    },
    {
      id: 4,
      type: 'general',
      title: 'Parent-Teacher Meeting',
      message: 'Parent-teacher meeting scheduled for March 10, 2024',
      date: '2024-02-25',
      priority: 'low',
      read: true
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setChildData(mockChildData);
      setNotifications(mockNotifications);
      setSelectedChild(mockChildData.id);
      setLoading(false);
    }, 1000);
  }, []);

  if (showChatOnly) {
    return (
      <div className="p-6 card">
        <h2 className="text-2xl font-bold mb-4">Parent Communication</h2>
        <p>Chat with faculty and admin...</p>
        <button 
          onClick={() => setShowChatOnly(false)}
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600 dark:text-green-400';
    if (attendance >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'fee': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'attendance': return <Users className="h-5 w-5 text-yellow-500" />;
      case 'academic': return <BookOpen className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-purple-100">Monitor your child's academic progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReportAnalysis(true)}
              className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </button>
            <button
              onClick={() => setShowProfileSettings(true)}
              className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </button>
            <div className="text-sm text-white/80">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Child Info Card */}
      <div className="card-success">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black dark:text-white">{childData?.name}</h3>
            <p className="text-primary-600 dark:text-primary-400">
              {childData?.rollNumber} • {childData?.branch}-{childData?.section} • Semester {childData?.semester}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Regulation: {childData?.regulation} • Year: {childData?.year}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {childData?.academic.cgpa}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Current SGPA</p>
              <p className="text-2xl font-bold text-black dark:text-white">{childData?.academic.sgpa}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Class Rank</p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {childData?.academic.rank}/{childData?.academic.totalStudents}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Attendance</p>
              <p className={`text-2xl font-bold ${getAttendanceColor(childData?.attendance.overall)}`}>
                {childData?.attendance.overall}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Pending Fees</p>
              <p className="text-2xl font-bold text-black dark:text-white">
                ₹{childData?.fees.pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div>

        {/* Child Progress Tab */}
        <DashboardSection isActive={activeSection === 'progress'}>
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Child Progress Overview</h4>
            
            {/* Academic Progress Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Semester-wise CGPA Trend</h5>
                <div className="space-y-3">
                  {[...childData?.results].reverse().map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {result.semester}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Semester {result.semester}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{result.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{result.cgpa}</p>
                        <p className="text-xs text-gray-500">CGPA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Performance */}
              <div className="card">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Current Semester Performance</h5>
                <div className="space-y-3">
                  {childData?.attendance.subjects.map((subject, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{subject.subject}</p>
                        <span className={`text-sm font-bold ${getAttendanceColor(subject.attendance)}`}>
                          {subject.attendance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            subject.attendance >= 90 ? 'bg-green-500' :
                            subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${subject.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Academic Trend</p>
                  <p className="text-lg font-bold text-green-800 dark:text-green-300">Improving</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+0.3 from last semester</p>
                </div>
              </div>
              
              <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Class Position</p>
                  <p className="text-lg font-bold text-blue-800 dark:text-blue-300">5th Rank</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Out of 60 students</p>
                </div>
              </div>
              
              <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Attendance Status</p>
                  <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300">Good</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">87% overall</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <h5 className="text-md font-semibold text-primary-800 dark:text-primary-300 mb-3">Recommendations</h5>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <p className="text-sm text-primary-700 dark:text-primary-300">Improve attendance in Cryptography (currently 78%)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <p className="text-sm text-primary-700 dark:text-primary-300">Maintain excellent performance in Cloud Computing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <p className="text-sm text-primary-700 dark:text-primary-300">Focus on practical sessions for better understanding</p>
                </div>
              </div>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'dashboard' || activeSection === 'overview'}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Performance */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Performance</h4>
                <div className="space-y-3">
                  {childData?.results.slice(0, 3).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Semester {result.semester}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{result.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600 dark:text-primary-400">SGPA: {result.sgpa}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">CGPA: {result.cgpa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Summary</h4>
                <div className="space-y-3">
                  {childData?.attendance.subjects.slice(0, 3).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{subject.subject}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.present}/{subject.total} classes
                        </p>
                      </div>
                      <div className={`text-right font-bold ${getAttendanceColor(subject.attendance)}`}>
                        {subject.attendance}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <button 
                  onClick={() => {
                    setChatRecipient({ id: 'faculty1', name: 'Class Teacher', role: 'faculty' });
                    setShowChat(true);
                  }}
                  className="btn-primary flex items-center justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Faculty
                </button>
                <button className="btn-secondary flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </button>
                <button 
                  onClick={() => {
                    setChatRecipient({ id: 'admin1', name: 'Admin Office', role: 'admin' });
                    setShowChat(true);
                  }}
                  className="btn-outline flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open Chat
                </button>
                <button 
                  onClick={() => setShowProfileSettings(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </button>
                <button 
                  onClick={() => setShowReportAnalysis(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </button>
              </div>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'attendance'}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Subject-wise Attendance</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall: <span className={`font-bold ${getAttendanceColor(childData?.attendance.overall)}`}>
                  {childData?.attendance.overall}%
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {childData?.attendance.subjects.map((subject, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-900 dark:text-white">{subject.subject}</h5>
                    <span className={`font-bold text-lg ${getAttendanceColor(subject.attendance)}`}>
                      {subject.attendance}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">Total Classes</p>
                      <p className="font-bold text-gray-900 dark:text-white">{subject.total}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">Present</p>
                      <p className="font-bold text-green-600 dark:text-green-400">{subject.present}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">Absent</p>
                      <p className="font-bold text-red-600 dark:text-red-400">{subject.absent}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.attendance >= 90 ? 'bg-green-500' :
                        subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.attendance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'results'}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Results</h4>
              <button className="btn-secondary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {childData?.results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Semester {result.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.sgpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {result.cgpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.status === 'Current' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'timetable'}>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Timetable</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                      Day
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                      Schedule
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(childData?.timetable || {}).map(([day, classes]) => (
                    <tr key={day} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium text-gray-900 dark:text-white">
                        {day}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <div className="space-y-2">
                          {classes.map((class_, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {class_.time}
                              </span>
                              <span className="mx-2 text-gray-600 dark:text-gray-400">•</span>
                              <span className="text-gray-900 dark:text-white">{class_.subject}</span>
                              <span className="mx-2 text-gray-600 dark:text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-400">{class_.faculty}</span>
                              <span className="mx-2 text-gray-600 dark:text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-400">{class_.room}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'fees'}>
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Fee Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Fee</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{childData?.fees.totalFee.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{childData?.fees.paidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₹{childData?.fees.pendingAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {childData?.fees.pendingAmount > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Payment Due</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Fee payment of ₹{childData.fees.pendingAmount.toLocaleString()} is due on {childData.fees.dueDate}
                    </p>
                  </div>
                </div>
                <button className="mt-3 btn-primary">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'notifications'}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h4>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Mark all as read
              </button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-l-4 rounded-lg ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'border-l-4' : 'border-l-2 opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            New
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardSection>

        <DashboardSection isActive={activeSection === 'chat'}>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Communication Center</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Faculty Communication */}
              <div className="card">
                <h5 className="font-medium text-gray-900 dark:text-white mb-4">Faculty Communication</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Ms. Priya Sharma</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Class Teacher</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setChatRecipient({ id: 'teacher1', name: 'Ms. Priya Sharma', role: 'faculty' });
                          setShowChat(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                        <Video className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Mr. Rajesh Kumar</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Math Teacher</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setChatRecipient({ id: 'teacher2', name: 'Mr. Rajesh Kumar', role: 'faculty' });
                          setShowChat(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                        <Video className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Communication */}
              <div className="card">
                <h5 className="font-medium text-gray-900 dark:text-white mb-4">Administrative Support</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Admin Office</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">General Queries</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setChatRecipient({ id: 'admin1', name: 'Admin Office', role: 'admin' });
                          setShowChat(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Fee Department</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fee Related Queries</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setChatRecipient({ id: 'fee_dept', name: 'Fee Department', role: 'admin' });
                          setShowChat(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardSection>
      </div>
      
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userRole="parent"
      />
      
      <ReportAnalysis
        isOpen={showReportAnalysis}
        onClose={() => setShowReportAnalysis(false)}
        userRole="parent"
      />
      
      {/* Chat Modal */}
      {showChat && chatRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl h-[600px] flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat with {chatRecipient.name}</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded p-4">
              <p className="text-gray-600 dark:text-gray-400">Chat functionality will be available soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;