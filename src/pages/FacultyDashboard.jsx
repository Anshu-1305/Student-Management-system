import React, { useState } from 'react';
import { User, Users, Calendar, BookOpen, TrendingUp, Bell, Award, UserCheck, BarChart3, Video } from 'lucide-react';

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
  if (showChatOnly) {
    return (
      <div className="p-6 card">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <p>Chat functionality coming soon...</p>
        <button 
          onClick={() => setShowChatOnly(false)}
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div id="dashboard" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, Prof. Sumalatha!</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Today is {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          title="My Students"
          value="25"
          subtitle="Active students"
        />
        <StatCard
          icon={BookOpen}
          title="Subjects"
          value="3"
          subtitle="Teaching"
        />
        <StatCard
          icon={UserCheck}
          title="Attendance"
          value="89%"
          subtitle="Average"
        />
        <StatCard
          icon={Award}
          title="Assignments"
          value="12"
          subtitle="Pending review"
        />
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
      <div id="students" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Students</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-medium">A</span>
              </div>
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">Anshu Kumar</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">GPA: 8.9</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium">R</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Rahul Kumar</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">GPA: 8.5</p>
              </div>
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4">View All Students</button>
      </div>

      {/* Attendance Section */}
      <div id="attendance" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Attendance Tracking</h3>
        <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">89%</p>
              <p className="text-primary-600 dark:text-primary-400">Average Class Attendance</p>
            </div>
            <div className="h-16 w-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4">Track Attendance</button>
      </div>

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
    </div>
  );
};

export default FacultyDashboard;
