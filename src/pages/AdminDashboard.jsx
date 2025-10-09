import React, { useState } from 'react';
import { Users, UserCheck, GraduationCap, TrendingUp, Search, Plus, Edit, Trash2, BarChart3, Bell, Settings, Calendar, BookOpen } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change }) => (
  <div className="card-success bounce-in">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary-500/10 float hover:bg-primary-500/20 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        {change && (
          <p className="text-sm text-primary-600 dark:text-primary-400">+{change}% from last month</p>
        )}
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ showChatOnly, setShowChatOnly }) => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, Admin</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Today is {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => alert('Add New Student functionality')}
          className="btn-primary flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </button>
        <button 
          onClick={() => alert('Add New Faculty functionality')}
          className="btn-primary flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Faculty
        </button>
        <button 
          onClick={() => alert('Create Notification functionality')}
          className="btn-primary flex items-center justify-center"
        >
          <Bell className="h-5 w-5 mr-2" />
          Send Notification
        </button>
        <button 
          onClick={() => alert('Generate Report functionality')}
          className="btn-primary flex items-center justify-center"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value="60"
          change="12"
        />
        <StatCard
          icon={UserCheck}
          title="Total Faculty"
          value="3"
          change="5"
        />
        <StatCard
          icon={GraduationCap}
          title="Total Classes"
          value="8"
          change="8"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Attendance"
          value="89%"
          change="3"
        />
      </div>

      {/* Students Section */}
      <div id="students" className="card slide-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Student Management</h3>
          <button 
            onClick={() => alert('Add Student functionality - Form would open here')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sample student rows */}
              <tr className="table-row">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-300 font-medium">A</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Anshu Kumar</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">226f1a05a4@student.edu</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  226F1A05A4
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  CSE-B
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge-success">92%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  8.9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Edit student: Anshu Kumar')}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => alert('Delete student: Anshu Kumar')}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* More sample rows can be added */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other sections */}
      <div id="faculty" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Faculty Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage faculty members and their assignments</p>
        <button className="btn-primary">Manage Faculty</button>
      </div>

      <div id="timetable" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Timetable Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Create and manage class schedules</p>
        <button className="btn-primary">Manage Timetable</button>
      </div>

      <div id="syllabus" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Syllabus Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage course syllabus and materials</p>
        <button className="btn-primary">Manage Syllabus</button>
      </div>

      <div id="classes" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Class Management</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Organize classes and sections</p>
        <button className="btn-primary">Manage Classes</button>
      </div>

      <div id="analytics" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">View detailed analytics and insights</p>
        <button className="btn-primary">View Analytics</button>
      </div>

      <div id="reports" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reports</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Generate and view various reports</p>
        <button className="btn-primary">Generate Reports</button>
      </div>

      <div id="notifications" className="card bounce-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Send notifications to students and faculty</p>
        <button className="btn-primary">Manage Notifications</button>
      </div>

      <div id="settings" className="card fade-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Settings</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Configure system settings and preferences</p>
        <button className="btn-secondary">Open Settings</button>
      </div>

      <div id="chat" className="card slide-in">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Communication Hub</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage communications and messages</p>
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

export default AdminDashboard;
