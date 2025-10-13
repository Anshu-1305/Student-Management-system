import React, { useState } from 'react';
import { Users, UserCheck, GraduationCap, TrendingUp, Search, Plus, Edit, Trash2, BarChart3, Bell, Settings, Calendar, BookOpen, Shield, Upload, Eye, Phone, Mail, Palette, User } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useBranding } from '../context/BrandingContext';
import { getCurrentInstitute, getInstituteClasses } from '../utils/instituteConfig';
import DashboardSection from '../components/DashboardSection';
import AddUserModal from '../components/AddUserModal';
import BulkStudentUpload from '../components/BulkStudentUpload';
import TimetableEditor from '../components/TimetableEditor';
import InstituteCustomization from '../components/InstituteCustomization';
import ProfileSettings from '../components/ProfileSettings';
import ReportAnalysis from '../components/ReportAnalysis';

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
  const { activeSection } = useDashboard();
  const { branding, instituteData } = useBranding();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showTimetableEditor, setShowTimetableEditor] = useState(false);
  const [timetableType, setTimetableType] = useState('student');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showReportAnalysis, setShowReportAnalysis] = useState(false);
  const [facultyView, setFacultyView] = useState('total');
  
  const currentTenant = localStorage.getItem('currentTenant') || 'default';
  const currentInstitute = getCurrentInstitute();

  const mockFaculty = {
    total: [
      { id: 1, name: 'Prof. Sumalatha', email: 'sumalatha@institute.edu', phone: '9876543210', dept: 'CSE', subjects: ['Data Structures', 'Algorithms'], status: 'Active' },
      { id: 2, name: 'Prof. Tukaram', email: 'tukaram@institute.edu', phone: '9876543211', dept: 'CSE', subjects: ['Cloud Computing', 'Web Tech'], status: 'Active' },
      { id: 3, name: 'Dr. Murlidher', email: 'murlidher@institute.edu', phone: '9876543212', dept: 'CSE', subjects: ['Computer Networks', 'OS'], status: 'Active' },
      { id: 4, name: 'Prof. Rajesh', email: 'rajesh@institute.edu', phone: '9876543213', dept: 'CSE', subjects: ['Compiler Design'], status: 'On Leave' }
    ],
    active: [],
    onLeave: []
  };

  // Filter faculty based on status
  mockFaculty.active = mockFaculty.total.filter(f => f.status === 'Active');
  mockFaculty.onLeave = mockFaculty.total.filter(f => f.status === 'On Leave');

  const mockUsers = [
    { id: 1, name: 'Prof. Sumalatha', email: 'sumalatha@institute.edu', role: 'Faculty', department: 'CSE', status: 'Active' },
    { id: 2, name: 'Anshu Kumar', email: 'anshu@student.edu', role: 'Student', department: 'CSE', status: 'Active' },
    { id: 3, name: 'Dr. Murlidher', email: 'murlidher@institute.edu', role: 'HOD', department: 'CSE', status: 'Active' },
    { id: 4, name: 'Ms. Priya', email: 'priya@institute.edu', role: 'Librarian', department: 'Library', status: 'Active' }
  ];

  if (showChatOnly) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Admin Communication</h2>
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
      {/* Institute Banner */}
      <div className={`bg-gradient-to-r ${currentInstitute.branding.gradientFrom} ${currentInstitute.branding.gradientTo} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={currentInstitute.logo} 
              alt={currentInstitute.name}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-bold">{currentInstitute.name}</h1>
              <p className="text-white/90">{currentInstitute.affiliation} • Est. {currentInstitute.established}</p>
              <p className="text-white/75 text-sm">{currentInstitute.tagline}</p>
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
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setShowCustomizationModal(true)}
              className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </button>
          </div>
        </div>
      </div>

      <div id="dashboard" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {currentInstitute.adminCredentials?.name || 'Administrator'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {currentInstitute.adminCredentials?.designation || 'System Administrator'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tenant: {currentTenant}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Today is {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="btn-primary flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add User
        </button>
        <button 
          onClick={() => setShowBulkUpload(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Upload className="h-5 w-5 mr-2" />
          Bulk Upload
        </button>
        <button 
          onClick={() => alert('Send Notification functionality')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Bell className="h-5 w-5 mr-2" />
          Send Notification
        </button>
        <button 
          onClick={() => alert('Generate Report functionality')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
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

      {/* Dashboard Sections */}
      <DashboardSection isActive={activeSection === 'dashboard'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-900 dark:text-blue-100">New student registered</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-900 dark:text-green-100">Faculty added to CSE</span>
                <span className="text-sm text-green-600 dark:text-green-400">5 hours ago</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Server</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'students'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Manage all institute users and their roles</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button 
              onClick={() => setShowBulkUpload(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">45</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm">Faculty</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">1,250</p>
                <p className="text-green-600 dark:text-green-400 text-sm">Students</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</p>
                <p className="text-purple-600 dark:text-purple-400 text-sm">Staff</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">8</p>
                <p className="text-orange-600 dark:text-orange-400 text-sm">Admins</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'faculty'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Faculty Management</h3>
          
          {/* Faculty Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => setFacultyView('total')}
              className={`p-4 rounded-lg border transition-colors text-left ${
                facultyView === 'total' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Total Faculty</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockFaculty.total.length}</p>
            </button>
            <button 
              onClick={() => setFacultyView('active')}
              className={`p-4 rounded-lg border transition-colors text-left ${
                facultyView === 'active' 
                  ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700' 
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              <h4 className="font-semibold text-green-900 dark:text-green-100">Active</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{mockFaculty.active.length}</p>
            </button>
            <button 
              onClick={() => setFacultyView('onLeave')}
              className={`p-4 rounded-lg border transition-colors text-left ${
                facultyView === 'onLeave' 
                  ? 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
              }`}
            >
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">On Leave</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mockFaculty.onLeave.length}</p>
            </button>
          </div>

          {/* Faculty Details Table */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              {facultyView === 'total' ? 'All Faculty' : 
               facultyView === 'active' ? 'Active Faculty' : 'Faculty on Leave'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subjects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFaculty[facultyView].map((faculty) => (
                    <tr key={faculty.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{faculty.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{faculty.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{faculty.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3 mr-1" />
                            {faculty.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-3 w-3 mr-1" />
                            {faculty.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{faculty.dept}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {faculty.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faculty.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {faculty.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />Add Faculty
          </button>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'timetable'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Timetable Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Manage schedules by category and department</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setTimetableType('student'); setShowTimetableEditor(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <GraduationCap className="h-4 w-4 mr-1" />Student
              </button>
              <button 
                onClick={() => { setTimetableType('faculty'); setShowTimetableEditor(true); }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <UserCheck className="h-4 w-4 mr-1" />Faculty
              </button>
              <button 
                onClick={() => { setTimetableType('lab'); setShowTimetableEditor(true); }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <Settings className="h-4 w-4 mr-1" />Lab
              </button>
            </div>
          </div>

          {/* Timetable Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Student Timetables */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Student Timetables</h4>
              </div>
              <div className="space-y-2">
                {['CSE-A', 'CSE-B', 'ECE-A', 'EEE-A'].map(section => (
                  <div key={section} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{section}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Year 3 • 30 periods</p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => { setTimetableType('student'); setShowTimetableEditor(true); }}
                        className="p-1 text-green-600 hover:bg-green-100 rounded" 
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Timetables */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Faculty Timetables</h4>
              </div>
              <div className="space-y-2">
                {['Prof. Sumalatha', 'Prof. Tukaram', 'Dr. Murlidher', 'Prof. Rajesh'].map(faculty => (
                  <div key={faculty} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">{faculty}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">CSE Dept • 18 periods</p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="View">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => setShowTimetableEditor(true)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded" 
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Timetables */}
            <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-orange-600 mr-2" />
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Lab Timetables</h4>
              </div>
              <div className="space-y-2">
                {['DS Lab', 'CN Lab', 'Web Tech Lab', 'DBMS Lab'].map(lab => (
                  <div key={lab} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">{lab}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">Lab-1 • 6 periods</p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-orange-600 hover:bg-orange-100 rounded" title="View">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => setShowTimetableEditor(true)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded" 
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">📅 Timetable Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
              <div>
                <p className="font-medium">Student Timetables:</p>
                <p>Class-wise schedules visible to students and faculty</p>
              </div>
              <div>
                <p className="font-medium">Faculty Timetables:</p>
                <p>Individual faculty schedules across departments</p>
              </div>
              <div>
                <p className="font-medium">Lab Timetables:</p>
                <p>Laboratory session schedules and equipment allocation</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'syllabus'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Syllabus Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Computer Science</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">5 subjects • Updated 2 days ago</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Manage</button>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'classes'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Class Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
              <h4 className="font-bold text-2xl text-blue-600 dark:text-blue-400">8</h4>
              <p className="text-blue-900 dark:text-blue-100">Total Classes</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'analytics'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Attendance Trends</h4>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">89.5%</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'reports'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reports</h3>
          <button className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-left hover:bg-blue-100 transition-colors">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Student Performance Report</h4>
          </button>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'notifications'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">System Maintenance</h4>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'settings'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Academic Year</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current: 2024-25</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
      />
      
      <BulkStudentUpload 
        isOpen={showBulkUpload} 
        onClose={() => setShowBulkUpload(false)} 
      />
      
      <TimetableEditor 
        isOpen={showTimetableEditor} 
        onClose={() => setShowTimetableEditor(false)}
        timetableType={timetableType}
      />
      

      
      <InstituteCustomization
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        instituteData={currentInstitute}
      />
      
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        userRole="admin"
      />
      
      <ReportAnalysis
        isOpen={showReportAnalysis}
        onClose={() => setShowReportAnalysis(false)}
        userRole="admin"
      />
    </div>
  );
};

export default AdminDashboard;
