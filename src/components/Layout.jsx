import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EnhancedChat from './EnhancedChat';
import NotificationCenter from './NotificationCenter';
import VirtualClassroom from './VirtualClassroom';
import iPhoneStyleLoader from './iPhoneStyleLoader';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import realTimeService from '../services/realTimeService';
import { dataService } from '../services/dataService';

const Layout = ({ children, showChatOnly, setShowChatOnly, setCurrentView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVirtualClass, setShowVirtualClass] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { isDark } = useTheme();
  const { user, dashboardLoading } = useAuth();

  // Initialize real-time services and load data
  useEffect(() => {
    if (user) {
      loadContacts();
      updateUnreadCounts();
      
      realTimeService.on('newNotification', updateUnreadCounts);
      realTimeService.on('newMessage', updateUnreadCounts);
      
      return () => {
        realTimeService.off('newNotification', updateUnreadCounts);
        realTimeService.off('newMessage', updateUnreadCounts);
      };
    }
  }, [user]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    
    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [sidebarOpen]);

  const loadContacts = () => {
    if (!user) return;
    
    try {
      const contactList = realTimeService.getContacts(user.role, user.email, user.instituteId || 'default');
      setContacts(contactList);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    }
  };

  const updateUnreadCounts = () => {
    if (!user) return;
    
    try {
      const notificationCount = realTimeService.getUnreadCount(user.role, user.email);
      setUnreadNotifications(notificationCount);
      
      let messageCount = 0;
      contacts.forEach(contact => {
        const chatId = [user.email, contact.email].sort().join('-');
        messageCount += realTimeService.getChatUnreadCount(chatId);
      });
      setUnreadMessages(messageCount);
    } catch (error) {
      console.error('Error updating unread counts:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* iPhone-style loading overlay */}
      {dashboardLoading && <iPhoneStyleLoader />}
      
      <div className="flex h-screen bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          showChatOnly={showChatOnly}
          setShowChatOnly={setShowChatOnly}
          setCurrentView={setCurrentView}
          onChatClick={() => setShowChat(true)}
          onNotificationClick={() => setShowNotifications(true)}
          onVirtualClassClick={() => setShowVirtualClass(true)}
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
        />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          onChatClick={() => setShowChat(true)}
          onNotificationClick={() => setShowNotifications(true)}
          onVirtualClassClick={() => setShowVirtualClass(true)}
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
        />
        
        {/* Main content */}
        <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-full blur-3xl opacity-50 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
          </div>
          
          {/* Scrollable content container */}
          <div className="relative h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              {/* Content wrapper with animations */}
              <div className="fade-in-up space-y-6 md:space-y-8">
                {children}
              </div>
              
              {/* Bottom spacing for mobile */}
              <div className="h-16 md:h-8"></div>
            </div>
          </div>
          
          {/* Mobile bottom navigation spacer */}
          <div className="lg:hidden h-16 bg-gradient-to-t from-white/80 to-transparent dark:from-black/80 pointer-events-none absolute bottom-0 left-0 right-0"></div>
        </main>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Enhanced Chat */}
      <EnhancedChat
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        contacts={contacts}
      />
      
      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      {/* Virtual Classroom */}
      <VirtualClassroom
        isOpen={showVirtualClass}
        onClose={() => setShowVirtualClass(false)}
      />
      
      {/* Keyboard navigation support */}
      <div 
        className="sr-only"
        role="region"
        aria-live="polite"
        aria-label="Main content area"
      >
        Content loaded
      </div>
      </div>
    </>
  );
};

export default Layout;
