import React, { useState } from 'react';
import { User, Calendar, BookOpen, TrendingUp, Bell, Award, GraduationCap, Users, UserCheck } from 'lucide-react';

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

const StudentDashboard = ({ showChatOnly, setShowChatOnly }) => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, Anshu Kumar!</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Today is {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={TrendingUp}
          title="Overall GPA"
          value="8.9"
          subtitle="Excellent"
        />
        <StatCard
          icon={UserCheck}
          title="Attendance"
          value="92%"
          subtitle="Good standing"
        />
        <StatCard
          icon={BookOpen}
          title="Subjects"
          value="6"
          subtitle="This semester"
        />
        <StatCard
          icon={Award}
          title="Rank"
          value="#5"
          subtitle="In class"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Timetable Section */}
        <div id="timetable" className="card fade-in">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Today's Timetable
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">Data Structures</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">Prof. Sumalatha</p>
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">9:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Database Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Sumalatha</p>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">11:00 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Machine Learning</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dr. Sai Hareesh</p>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">2:00 PM</span>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div id="results" className="card fade-in">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Results
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Database Management</p>
                <p className="text-sm text-green-600 dark:text-green-400">Mid-term Exam</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-900 dark:text-green-100">92/100</p>
                <span className="badge-success">A+</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Data Structures</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Assignment 3</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-900 dark:text-blue-100">88/100</p>
                <span className="badge-info">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div id="notifications" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Notifications
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900 dark:text-yellow-100">Assignment Submission</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Software Engineering project due by Jan 25th</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">2 days ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Semester Exam Schedule</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">4-1 Semester exams start from February 5th</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections placeholders */}
      <div id="attendance" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Attendance Overview</h3>
        <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">92%</p>
              <p className="text-primary-600 dark:text-primary-400">Overall Attendance</p>
            </div>
            <div className="h-16 w-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      <div id="syllabus" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Syllabus & Materials</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Access your course materials and syllabus</p>
        <button className="btn-primary">
          View All Materials
        </button>
      </div>

      <div id="reports" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Reports</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Track your academic progress</p>
        <button className="btn-primary">
          Generate Report
        </button>
      </div>

      <div id="virtual" className="card bounce-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Virtual Classroom</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Join online classes and sessions</p>
        <button className="btn-primary">
          Join Session
        </button>
      </div>

      <div id="profile" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">A</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Anshu Kumar</p>
            <p className="text-gray-600 dark:text-gray-400">226F1A05A4 - CSE-B</p>
          </div>
        </div>
        <button className="btn-secondary">
          Edit Profile
        </button>
      </div>

      <div id="chat" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Chat with faculty and classmates</p>
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

export default StudentDashboard;
