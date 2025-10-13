import React, { useState, useEffect } from 'react';
import { Building, Users, Shield, BarChart3, Plus, Eye, Edit, Trash2, Globe, CheckCircle, AlertCircle, Palette, Settings, Download, MessageSquare, Bell, Activity } from 'lucide-react';
import InstituteRegistration from '../components/InstituteRegistration';
import InstituteCustomization from '../components/InstituteCustomization';
import { getAllInstitutes, getSystemStats, updateInstituteStatus, deleteInstitute } from '../utils/multiTenant';
import { dataService } from '../services/dataService';

const SuperAdminDashboard = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [institutes, setInstitutes] = useState([]);
  const [stats, setStats] = useState({});
  const [announcement, setAnnouncement] = useState({ title: '', message: '', targetInstitutes: [] });
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const instituteData = getAllInstitutes();
    const systemStats = getSystemStats();
    setInstitutes(instituteData);
    setStats(systemStats);
    setPendingApprovals(instituteData.filter(inst => inst.status === 'pending'));
  };

  const handleStatusChange = (instituteId, newStatus) => {
    if (updateInstituteStatus(instituteId, newStatus)) {
      loadData();
    }
  };

  const handleDeleteInstitute = (instituteId) => {
    if (window.confirm('Are you sure you want to delete this institute? This action cannot be undone.')) {
      if (deleteInstitute(instituteId)) {
        loadData();
      }
    }
  };

  const handleCustomizeInstitute = (institute) => {
    setSelectedInstitute(institute);
    setShowCustomizationModal(true);
  };

  const handleSendAnnouncement = () => {
    const targetInstitutes = announcement.targetInstitutes.length > 0 ? announcement.targetInstitutes : institutes.map(i => i.id);
    
    targetInstitutes.forEach(instituteId => {
      dataService.addNotification(instituteId, {
        title: announcement.title,
        message: announcement.message,
        type: 'announcement',
        priority: 'high',
        sender: 'Super Admin',
        recipients: ['all'],
        timestamp: new Date().toISOString()
      });
    });

    setShowAnnouncementModal(false);
    setAnnouncement({ title: '', message: '', targetInstitutes: [] });
    alert('Announcement sent successfully!');
  };

  const exportAnalytics = (format) => {
    const analyticsData = institutes.map(institute => ({
      institute: institute.name,
      students: institute.students || 0,
      faculty: institute.faculty || 0,
      status: institute.status,
      createdAt: institute.createdAt || new Date().toISOString()
    }));

    if (format === 'csv') {
      const csv = [Object.keys(analyticsData[0]).join(','), ...analyticsData.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'super_admin_analytics.csv';
      a.click();
    }
  };

  const handleApproval = (instituteId, action) => {
    handleStatusChange(instituteId, action === 'approve' ? 'active' : 'rejected');
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-${color}-100 dark:border-${color}-800 p-6`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <div className="ml-4">
          <p className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>{title}</p>
          <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
          {subtitle && <p className={`text-sm text-${color}-600 dark:text-${color}-400`}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-indigo-100">College Portal Management System</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register Institute
            </button>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Announcement
            </button>
            <button
              onClick={() => setShowAnalyticsModal(true)}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Building}
            title="Total Institutes"
            value={stats.totalInstitutes}
            subtitle="Registered"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Active Institutes"
            value={stats.activeInstitutes}
            subtitle="Currently Active"
            color="green"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            subtitle="Across all institutes"
            color="purple"
          />
          <StatCard
            icon={Shield}
            title="Total Faculty"
            value={stats.totalFaculty}
            subtitle="Teaching staff"
            color="orange"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Institute Overview', icon: Building },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'settings', label: 'System Settings', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Institutes</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={loadData}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Refresh
                    </button>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {institutes.length} institutes registered
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Institute</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Admin</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Portal URL</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Stats</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutes.map((institute) => (
                        <tr key={institute.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                {institute.branding?.logo ? (
                                  <img src={institute.branding.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{institute.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{institute.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{institute.admin}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{institute.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a
                                href={`https://${institute.subdomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-mono"
                              >
                                {institute.subdomain}
                              </a>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p className="text-gray-900 dark:text-white">{institute.students} Students</p>
                              <p className="text-gray-600 dark:text-gray-400">{institute.faculty} Faculty</p>
                              <p className="text-gray-600 dark:text-gray-400">{institute.departments} Departments</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={institute.status}
                              onChange={(e) => handleStatusChange(institute.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                                institute.status === 'active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => window.open(`https://${institute.subdomain}`, '_blank')}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
                                title="View Portal"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleCustomizeInstitute(institute)}
                                className="p-1 text-purple-600 hover:bg-purple-100 rounded" 
                                title="Customize Branding"
                              >
                                <Palette className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-1 text-green-600 hover:bg-green-100 rounded" 
                                title="Settings"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteInstitute(institute.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded" 
                                title="Delete"
                              >
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
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Registration Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">January 2024</span>
                        <span className="text-sm font-medium">1 institute</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">February 2024</span>
                        <span className="text-sm font-medium">1 institute</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">March 2024</span>
                        <span className="text-sm font-medium">1 institute</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Institute Types</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Engineering Colleges</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Universities</span>
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Domain Configuration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Base Domain: collegeportal.in</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">SSL Certificate: Active</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security Settings</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Data Isolation: Enabled</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Multi-tenant Security: Active</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <InstituteRegistration
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          loadData();
        }}
      />
      
      <InstituteCustomization
        isOpen={showCustomizationModal}
        onClose={() => {
          setShowCustomizationModal(false);
          setSelectedInstitute(null);
          loadData();
        }}
        instituteData={selectedInstitute}
      />
    </div>
  );
};

export default SuperAdminDashboard;