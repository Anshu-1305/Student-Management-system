import React, { useState, useEffect } from 'react';
import { X, Video, Calendar, Clock, Users, Plus, ExternalLink, Download, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import realTimeService from '../services/realTimeService';

const VirtualClassroom = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: '',
    date: '',
    time: '',
    duration: 60,
    section: '',
    meetLink: '',
    materials: []
  });

  const getCurrentInstitute = () => {
    try {
      const stored = localStorage.getItem('currentInstitute');
      if (stored && stored.startsWith('{')) {
        return JSON.parse(stored);
      }
      return {
        name: 'JNTUH',
        logo: '/api/placeholder/40/40',
        primaryColor: '#059669'
      };
    } catch (error) {
      return {
        name: 'JNTUH',
        logo: '/api/placeholder/40/40',
        primaryColor: '#059669'
      };
    }
  };
  
  const currentInstitute = getCurrentInstitute();

  useEffect(() => {
    if (isOpen) {
      loadVirtualClasses();
      setupRealTimeListeners();
    }
    return () => {
      realTimeService.off('classScheduled', handleClassScheduled);
      realTimeService.off('userJoinedClass', handleUserJoinedClass);
    };
  }, [isOpen, user]);

  const loadVirtualClasses = () => {
    const classes = realTimeService.getVirtualClasses(user.role, user.email);
    setVirtualClasses(classes);
  };

  const setupRealTimeListeners = () => {
    realTimeService.on('classScheduled', handleClassScheduled);
    realTimeService.on('userJoinedClass', handleUserJoinedClass);
  };

  const handleClassScheduled = (classData) => {
    setVirtualClasses(prev => [classData, ...prev]);
  };

  const handleUserJoinedClass = ({ classId, userEmail, userName }) => {
    setVirtualClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, attendees: [...cls.attendees, { email: userEmail, name: userName, joinTime: new Date().toISOString() }] }
        : cls
    ));
  };

  const scheduleClass = () => {
    if (!newClass.subject.trim() || !newClass.date || !newClass.time) return;

    const classData = {
      ...newClass,
      faculty: user.email,
      meetLink: newClass.meetLink || realTimeService.generateMeetLink()
    };

    realTimeService.scheduleClass(classData);
    setNewClass({
      subject: '',
      date: '',
      time: '',
      duration: 60,
      section: '',
      meetLink: '',
      materials: []
    });
    setShowScheduleModal(false);
  };

  const joinClass = (classId) => {
    const virtualClass = realTimeService.joinClass(classId, user.email, user.name || user.email);
    if (virtualClass?.meetLink) {
      window.open(virtualClass.meetLink, '_blank');
    }
  };

  const getFilteredClasses = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return virtualClasses.filter(cls => {
          const classDateTime = new Date(cls.date + ' ' + cls.time);
          return classDateTime > now;
        });
      case 'ongoing':
        return virtualClasses.filter(cls => {
          const classDateTime = new Date(cls.date + ' ' + cls.time);
          const endTime = new Date(classDateTime.getTime() + cls.duration * 60000);
          return classDateTime <= now && now <= endTime;
        });
      case 'completed':
        return virtualClasses.filter(cls => {
          const classDateTime = new Date(cls.date + ' ' + cls.time);
          const endTime = new Date(classDateTime.getTime() + cls.duration * 60000);
          return endTime < now;
        });
      default:
        return virtualClasses;
    }
  };

  const formatDateTime = (date, time) => {
    const dateTime = new Date(date + ' ' + time);
    return {
      date: dateTime.toLocaleDateString(),
      time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: dateTime.toLocaleString()
    };
  };

  const getTimeUntilClass = (date, time) => {
    const classDateTime = new Date(date + ' ' + time);
    const now = new Date();
    const diffInMinutes = Math.floor((classDateTime - now) / (1000 * 60));
    
    if (diffInMinutes < 0) return 'Started';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const canScheduleClasses = user.role === 'admin' || user.role === 'faculty';
  const filteredClasses = getFilteredClasses();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <img 
              src={currentInstitute.logo} 
              alt={currentInstitute.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Virtual Classroom
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentInstitute.name} - Online Learning Platform
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canScheduleClasses && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Schedule Class
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-1">
            {['upcoming', 'ongoing', 'completed', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'ongoing' && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Classes List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <Video className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No classes found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'upcoming' ? 'No upcoming classes scheduled' : `No ${activeTab} classes`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls) => {
                const dateTime = formatDateTime(cls.date, cls.time);
                const timeUntil = getTimeUntilClass(cls.date, cls.time);
                const isOngoing = activeTab === 'ongoing' || timeUntil === 'Started';
                
                return (
                  <div
                    key={cls.id}
                    className={`p-6 rounded-lg border transition-all ${
                      isOngoing 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {cls.subject}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cls.section && `Section: ${cls.section}`}
                        </p>
                      </div>
                      {isOngoing && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {dateTime.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {dateTime.time} ({cls.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {cls.attendees?.length || 0} attendees
                        </span>
                      </div>
                    </div>

                    {cls.materials?.length > 0 && (
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Materials:
                        </h4>
                        <div className="space-y-1">
                          {cls.materials.map((material, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              <Download className="w-3 h-3" />
                              <span>{material.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        {timeUntil !== 'Started' && (
                          <span className={`text-sm font-medium ${
                            timeUntil.includes('m') && !timeUntil.includes('h') && !timeUntil.includes('d')
                              ? 'text-orange-500'
                              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {timeUntil === 'Started' ? 'In Progress' : `Starts in ${timeUntil}`}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => joinClass(cls.id)}
                        disabled={!isOngoing && timeUntil !== 'Started'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isOngoing || timeUntil === 'Started'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4 inline mr-1" />
                        {isOngoing || timeUntil === 'Started' ? 'Join Now' : 'Join Class'}
                      </button>
                    </div>

                    {user.role === 'parent' && (
                      <div className={`mt-3 pt-3 border-t text-xs ${
                        isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                      }`}>
                        View-only access for parent monitoring
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Class Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className={`w-full max-w-2xl rounded-lg shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Schedule Virtual Class
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter subject name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={newClass.time}
                    onChange={(e) => setNewClass(prev => ({ ...prev, time: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newClass.duration}
                    onChange={(e) => setNewClass(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="15"
                    max="180"
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Section/Class
                  </label>
                  <input
                    type="text"
                    value={newClass.section}
                    onChange={(e) => setNewClass(prev => ({ ...prev, section: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="e.g., CSE-A, Grade 10"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Google Meet Link (Optional)
                </label>
                <input
                  type="url"
                  value={newClass.meetLink}
                  onChange={(e) => setNewClass(prev => ({ ...prev, meetLink: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Leave empty to auto-generate"
                />
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end space-x-3 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowScheduleModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={scheduleClass}
                disabled={!newClass.subject.trim() || !newClass.date || !newClass.time}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualClassroom;