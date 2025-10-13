import React, { useState, useEffect } from 'react';
import { User, Users, Calendar, BookOpen, TrendingUp, Bell, Award, UserCheck, BarChart3, Video, Settings, FileText, Upload, Clock } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useBranding } from '../context/BrandingContext';
import DashboardSection from '../components/DashboardSection';

import ProfileSettings from '../components/ProfileSettings';
import ReportAnalysis from '../components/ReportAnalysis';
import AttendanceMarker from '../components/AttendanceMarker';
import AssignmentManager from '../components/AssignmentManager';
import MaterialsManager from '../components/MaterialsManager';
import { dataService } from '../services/dataService';

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="card-success bounce-in">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary-500/10 float hover:bg-primary-500/20 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-sm text-primary-600 dark:text-primary-400">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

const FacultyDashboard = ({ showChatOnly, setShowChatOnly }) => {
  const { activeSection } = useDashboard();
  const { branding } = useBranding();
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showReportAnalysis, setShowReportAnalysis] = useState(false);
  const [showAttendanceMarker, setShowAttendanceMarker] = useState(false);
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [showMaterialsManager, setShowMaterialsManager] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [myStudents, setMyStudents] = useState([]);

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = () => {
    const students = dataService.getStudents();
    const analytics = dataService.getAnalytics();
    
    setMyStudents(students.slice(0, 25)); // Faculty's students
    setFacultyData({
      totalStudents: students.length,
      totalSubjects: 3,
      avgAttendance: analytics.avgAttendance,
      pendingAssignments: 12
    });
  };

  if (showChatOnly) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Faculty Communication</h2>
        <p>Chat functionality coming soon...</p>
        <button 
          onClick={() => setShowChatOnly(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
              <p className="text-blue-100">Welcome back, Prof. Sumalatha!</p>
            </div>
          </div>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
        Today is {new Date().toLocaleDateString()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          title="My Students"
          value={facultyData?.totalStudents || "0"}
          subtitle="Active students"
        />
        <StatCard
          icon={BookOpen}
          title="Subjects"
          value={facultyData?.totalSubjects || "0"}
          subtitle="Teaching"
        />
        <StatCard
          icon={UserCheck}
          title="Attendance"
          value={`${Math.round(facultyData?.avgAttendance || 0)}%`}
          subtitle="Average"
        />
        <StatCard
          icon={Award}
          title="Assignments"
          value={facultyData?.pendingAssignments || "0"}
          subtitle="Pending review"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowAttendanceMarker(true)}
          className="btn-primary flex items-center justify-center"
        >
          <UserCheck className="h-5 w-5 mr-2" />
          Mark Attendance
        </button>
        <button 
          onClick={() => setShowAssignmentManager(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <FileText className="h-5 w-5 mr-2" />
          Assignments
        </button>
        <button 
          onClick={() => setShowMaterialsManager(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Upload className="h-5 w-5 mr-2" />
          Materials
        </button>
        <button 
          onClick={() => alert('Opening Virtual Classroom...')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Video className="h-5 w-5 mr-2" />
          Virtual Class
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Today's Classes */}
        <div id="timetable" className="card fade-in">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Today's Classes
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">Data Structures</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">CSE-B Section</p>
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">9:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Database Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CSE-B Section</p>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">11:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Software Engineering</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CSE-B Section</p>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">2:00 PM</span>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div id="results" className="card fade-in">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Submissions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Database Project</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Anshu Kumar</p>
              </div>
              <div className="text-right">
                <span className="badge-warning">Pending</span>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Algorithm Assignment</p>
                <p className="text-sm text-green-600 dark:text-green-400">Rahul Kumar</p>
              </div>
              <div className="text-right">
                <span className="badge-success">Graded: A</span>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <DashboardSection isActive={activeSection === 'students'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Students</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {myStudents.slice(0, 6).map((student, index) => (
              <div key={index} className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {student.name ? student.name.charAt(0) : 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-primary-900 dark:text-primary-100">
                      {student.name || `Student ${index + 1}`}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {student.rollNumber || `Roll: ${1000 + index}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => alert('Opening detailed student list...')}
              className="btn-primary"
            >
              View All Students
            </button>
            <button 
              onClick={() => setShowAttendanceMarker(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Mark Attendance
            </button>
          </div>
        </div>
      </DashboardSection>

      {/* Attendance Section */}
      <DashboardSection isActive={activeSection === 'attendance'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Attendance Tracking</h3>
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                  {Math.round(facultyData?.avgAttendance || 0)}%
                </p>
                <p className="text-primary-600 dark:text-primary-400">Average Class Attendance</p>
              </div>
              <div className="h-16 w-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">Today</p>
              <p className="text-sm text-blue-600">Mark Attendance</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">Weekly</p>
              <p className="text-sm text-green-600">View Reports</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">Monthly</p>
              <p className="text-sm text-purple-600">Analytics</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAttendanceMarker(true)}
            className="btn-primary flex items-center"
          >
            <Clock className="h-4 w-4 mr-2" />
            Mark Today's Attendance
          </button>
        </div>
      </DashboardSection>

      {/* Other sections */}
      <div id="materials" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Materials</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage and share course materials with students</p>
        <button className="btn-primary">Manage Materials</button>
      </div>

      <div id="reports" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Reports</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Generate detailed performance reports</p>
        <button className="btn-primary">Generate Report</button>
      </div>

      <div id="virtual" className="card bounce-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Virtual Classroom</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Host virtual classes and sessions</p>
        <div className="flex space-x-2">
          <button className="btn-primary flex items-center">
            <Video className="h-4 w-4 mr-2" />
            Start Session
          </button>
          <button className="btn-secondary">Schedule Class</button>
        </div>
      </div>

      <div id="notifications" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Assignment Reminder</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Database project submission deadline approaching</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">1 day left</p>
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4">View All Notifications</button>
      </div>

      <div id="chat" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Communicate with students and colleagues</p>
        <button 
          onClick={() => setShowChatOnly && setShowChatOnly(true)}
          className="btn-primary"
        >
          Open Chat
        </button>
      </div>
      
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userRole="faculty"
      />
      
      <ReportAnalysis
        isOpen={showReportAnalysis}
        onClose={() => setShowReportAnalysis(false)}
        userRole="faculty"
      />
      
      <AttendanceMarker
        isOpen={showAttendanceMarker}
        onClose={() => setShowAttendanceMarker(false)}
        classData={{ department: 'CSE', section: 'B', subject: 'Data Structures' }}
      />
      
      <AssignmentManager
        isOpen={showAssignmentManager}
        onClose={() => setShowAssignmentManager(false)}
        userRole="faculty"
      />
      
      <MaterialsManager
        isOpen={showMaterialsManager}
        onClose={() => setShowMaterialsManager(false)}
        userRole="faculty"
      />
    </div>
  );
};

export default FacultyDashboard;
