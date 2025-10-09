import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Users, UserCheck, GraduationCap, BarChart3, Bell, Settings, Calendar, BookOpen, Home, TrendingUp, Award, FileText, Video, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, onClose, showChatOnly, setShowChatOnly, setCurrentView }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hoveredItem, setHoveredItem] = useState(null);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', section: 'dashboard', color: 'text-primary-500' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Students', section: 'students', color: 'text-blue-500', badge: '60' },
          { icon: UserCheck, label: 'Faculty', section: 'faculty', color: 'text-purple-500', badge: '12' },
          { icon: Calendar, label: 'Timetable', section: 'timetable', color: 'text-orange-500' },
          { icon: BookOpen, label: 'Syllabus', section: 'syllabus', color: 'text-indigo-500' },
          { icon: GraduationCap, label: 'Classes', section: 'classes', color: 'text-green-500' },
          { icon: BarChart3, label: 'Analytics', section: 'analytics', color: 'text-pink-500' },
          { icon: TrendingUp, label: 'Reports', section: 'reports', color: 'text-cyan-500' },
          { icon: Bell, label: 'Notifications', section: 'notifications', color: 'text-red-500', badge: '3' },
          { icon: Settings, label: 'Settings', section: 'settings', color: 'text-gray-500' },
          { icon: MessageCircle, label: 'Chat', section: 'chat', color: 'text-emerald-500', isChat: true, badge: '2' },
        ];
      case 'faculty':
        return [
          ...baseItems,
          { icon: Users, label: 'My Students', section: 'students', color: 'text-blue-500', badge: '25' },
          { icon: UserCheck, label: 'Attendance', section: 'attendance', color: 'text-green-500' },
          { icon: Calendar, label: 'My Timetable', section: 'timetable', color: 'text-orange-500' },
          { icon: BookOpen, label: 'Course Materials', section: 'materials', color: 'text-indigo-500' },
          { icon: Award, label: 'Exam Results', section: 'results', color: 'text-yellow-500' },
          { icon: FileText, label: 'Reports', section: 'reports', color: 'text-cyan-500' },
          { icon: Bell, label: 'Notifications', section: 'notifications', color: 'text-red-500', badge: '5' },
          { icon: Video, label: 'Virtual Class', section: 'virtual', color: 'text-purple-500' },
          { icon: MessageCircle, label: 'Chat', section: 'chat', color: 'text-emerald-500', isChat: true, badge: '8' },
        ];
      case 'student':
        return [
          ...baseItems,
          { icon: Calendar, label: 'My Timetable', section: 'timetable', color: 'text-orange-500' },
          { icon: BookOpen, label: 'Syllabus', section: 'syllabus', color: 'text-indigo-500' },
          { icon: UserCheck, label: 'My Attendance', section: 'attendance', color: 'text-green-500' },
          { icon: Award, label: 'My Results', section: 'results', color: 'text-yellow-500' },
          { icon: FileText, label: 'My Reports', section: 'reports', color: 'text-cyan-500' },
          { icon: Video, label: 'Virtual Class', section: 'virtual', color: 'text-purple-500' },
          { icon: Bell, label: 'Notifications', section: 'notifications', color: 'text-red-500', badge: '2' },
          { icon: Settings, label: 'Profile', section: 'profile', color: 'text-gray-500' },
          { icon: MessageCircle, label: 'Chat', section: 'chat', color: 'text-emerald-500', isChat: true, badge: '12' },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (item) => {
    setActiveSection(item.section);
    if (item.isChat) {
      setShowChatOnly && setShowChatOnly(true);
    } else {
      setShowChatOnly && setShowChatOnly(false);
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    onClose();
  };

  const getRoleDisplayInfo = (role) => {
    switch (role) {
      case 'admin':
        return { title: 'Administrator', color: 'bg-red-500', emoji: '👨‍💼' };
      case 'faculty':
        return { title: 'Faculty Member', color: 'bg-blue-500', emoji: '👨‍🏫' };
      case 'student':
        return { title: 'Student', color: 'bg-primary-500', emoji: '👨‍🎓' };
      default:
        return { title: 'User', color: 'bg-gray-500', emoji: '👤' };
    }
  };

  const roleInfo = getRoleDisplayInfo(user?.role);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64 lg:shadow-none lg:bg-white lg:dark:bg-black ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-gray-200/50 dark:border-gray-800/50`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Navigation</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Smart SMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="touch-target lg:hidden btn-ghost p-2 rounded-xl hover:rotate-90 transition-transform duration-200"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* User info card */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-primary-200/50 dark:border-primary-800/50">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${roleInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  {roleInfo.title}
                </p>
              </div>
              <span className="text-2xl">{roleInfo.emoji}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = activeSection === item.section;
              const isHovered = hoveredItem === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`nav-item group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  } ${isActive ? 'active' : ''}`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Background gradient for hover effect */}
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/10 dark:to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                  )}
                  
                  <div className="relative flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 shadow-lg' 
                          : 'group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-md'
                      }`}>
                        <item.icon className={`h-5 w-5 transition-all duration-200 ${
                          isActive
                            ? 'text-white'
                            : `${item.color} group-hover:scale-110`
                        }`} />
                      </div>
                      <span className={`font-medium transition-all duration-200 ${
                        isActive ? 'font-semibold text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      
                      {!isActive && (
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
                          isHovered ? 'transform translate-x-1 text-gray-600 dark:text-gray-300' : ''
                        }`} />
                      )}
                    </div>
                  </div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-75">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl transform scale-0 group-active:scale-100 transition-transform duration-200" />
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Smart Student Management System
            </p>
            <p className="text-2xs text-gray-400 dark:text-gray-500">
              v2.0.0 • Made with ❤️
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
