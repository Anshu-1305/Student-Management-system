import React, { useState } from 'react';
import { Bell, Plus, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const NotificationPanel = ({ userRole = 'student' }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Assignment Due',
      message: 'Data Structures assignment due tomorrow',
      type: 'warning',
      date: '2024-01-20',
      read: false
    },
    {
      id: 2,
      title: 'Exam Schedule',
      message: 'Mid-term exams start from February 1st',
      type: 'info',
      date: '2024-01-18',
      read: true
    },
    {
      id: 3,
      title: 'Holiday Notice',
      message: 'University closed on January 26th',
      type: 'success',
      date: '2024-01-15',
      read: false
    },
    {
      id: 4,
      title: 'Fee Payment',
      message: 'Semester fee payment deadline approaching',
      type: 'error',
      date: '2024-01-14',
      read: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'success':
        return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const addNotification = (e) => {
    e.preventDefault();
    const notification = {
      id: Date.now(),
      ...newNotification,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info' });
    setShowAddModal(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </h3>
        {(userRole === 'admin' || userRole === 'faculty') && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Notification
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg border-l-4 ${getBorderColor(notification.type)} ${
              !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {getIcon(notification.type)}
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(notification.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notification Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-90vw modal-content">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Notification
            </h3>
            
            <form onSubmit={addNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="input-field h-20 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="input-field"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;