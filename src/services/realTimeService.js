// Real-time service for chat, notifications, and virtual classes
class RealTimeService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.onlineUsers = new Set();
    this.messageStatus = new Map();
    this.chatHistory = new Map();
    this.notifications = [];
    this.virtualClasses = [];
    this.init();
  }

  init() {
    // Simulate WebSocket connection
    this.connect();
    this.loadStoredData();
  }

  connect() {
    // Simulate WebSocket connection
    console.log('Real-time service connected');
    this.simulateOnlineUsers();
  }

  simulateOnlineUsers() {
    // Simulate random online users
    setInterval(() => {
      const users = ['admin@demo.com', 'faculty@demo.com', 'student@demo.com', 'parent@demo.com'];
      this.onlineUsers.clear();
      users.forEach(user => {
        if (Math.random() > 0.3) this.onlineUsers.add(user);
      });
      this.emit('onlineUsersUpdate', Array.from(this.onlineUsers));
    }, 30000);
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Chat functionality
  sendMessage(chatId, message, sender, recipient) {
    const messageData = {
      id: Date.now().toString(),
      chatId,
      content: message.content,
      type: message.type || 'text',
      sender,
      recipient,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: message.attachments || []
    };

    // Store message
    if (!this.chatHistory.has(chatId)) {
      this.chatHistory.set(chatId, []);
    }
    this.chatHistory.get(chatId).push(messageData);

    // Update status after delay
    setTimeout(() => {
      messageData.status = 'delivered';
      this.emit('messageStatusUpdate', { messageId: messageData.id, status: 'delivered' });
    }, 1000);

    setTimeout(() => {
      messageData.status = 'seen';
      this.emit('messageStatusUpdate', { messageId: messageData.id, status: 'seen' });
    }, 3000);

    this.emit('newMessage', messageData);
    this.saveToStorage();
    return messageData;
  }

  getChatHistory(chatId) {
    return this.chatHistory.get(chatId) || [];
  }

  getContacts(userRole, userEmail, instituteId) {
    const contacts = [];
    
    // Role-based contact filtering
    if (userRole === 'admin') {
      contacts.push(
        { email: 'faculty1@demo.com', name: 'Dr. Smith', role: 'faculty', online: this.onlineUsers.has('faculty1@demo.com') },
        { email: 'student1@demo.com', name: 'John Doe', role: 'student', online: this.onlineUsers.has('student1@demo.com') },
        { email: 'parent1@demo.com', name: 'Jane Doe', role: 'parent', online: this.onlineUsers.has('parent1@demo.com') }
      );
    } else if (userRole === 'faculty') {
      contacts.push(
        { email: 'admin@demo.com', name: 'Admin', role: 'admin', online: this.onlineUsers.has('admin@demo.com') },
        { email: 'student1@demo.com', name: 'John Doe', role: 'student', online: this.onlineUsers.has('student1@demo.com') },
        { email: 'parent1@demo.com', name: 'Jane Doe', role: 'parent', online: this.onlineUsers.has('parent1@demo.com') }
      );
    } else if (userRole === 'student' || userRole === 'parent') {
      contacts.push(
        { email: 'admin@demo.com', name: 'Admin', role: 'admin', online: this.onlineUsers.has('admin@demo.com') },
        { email: 'faculty1@demo.com', name: 'Dr. Smith', role: 'faculty', online: this.onlineUsers.has('faculty1@demo.com') }
      );
    }

    return contacts;
  }

  // Notification system
  sendNotification(notification) {
    const notificationData = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      priority: notification.priority || 'medium',
      recipients: notification.recipients || [],
      sender: notification.sender,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: notification.attachments || [],
      expiryDate: notification.expiryDate
    };

    this.notifications.unshift(notificationData);
    this.emit('newNotification', notificationData);
    this.saveToStorage();
    return notificationData;
  }

  getNotifications(userRole, userEmail) {
    return this.notifications.filter(notification => {
      if (notification.recipients.includes('all')) return true;
      if (notification.recipients.includes(userRole)) return true;
      if (notification.recipients.includes(userEmail)) return true;
      return false;
    });
  }

  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.emit('notificationRead', notificationId);
      this.saveToStorage();
    }
  }

  // Virtual classroom
  scheduleClass(classData) {
    const virtualClass = {
      id: Date.now().toString(),
      subject: classData.subject,
      faculty: classData.faculty,
      date: classData.date,
      time: classData.time,
      duration: classData.duration || 60,
      section: classData.section,
      meetLink: classData.meetLink || this.generateMeetLink(),
      status: 'scheduled',
      attendees: [],
      materials: classData.materials || [],
      timestamp: new Date().toISOString()
    };

    this.virtualClasses.push(virtualClass);

    // Send notification to students and parents
    this.sendNotification({
      title: `Virtual Class Scheduled: ${classData.subject}`,
      message: `Class scheduled for ${classData.date} at ${classData.time}`,
      type: 'class',
      priority: 'high',
      recipients: ['student', 'parent'],
      sender: classData.faculty
    });

    this.emit('classScheduled', virtualClass);
    this.saveToStorage();
    return virtualClass;
  }

  joinClass(classId, userEmail, userName) {
    const virtualClass = this.virtualClasses.find(c => c.id === classId);
    if (virtualClass) {
      if (!virtualClass.attendees.find(a => a.email === userEmail)) {
        virtualClass.attendees.push({
          email: userEmail,
          name: userName,
          joinTime: new Date().toISOString()
        });
        this.emit('userJoinedClass', { classId, userEmail, userName });
        this.saveToStorage();
      }
    }
    return virtualClass;
  }

  getVirtualClasses(userRole, userEmail) {
    if (userRole === 'admin') return this.virtualClasses;
    if (userRole === 'faculty') {
      return this.virtualClasses.filter(c => c.faculty === userEmail);
    }
    return this.virtualClasses.filter(c => {
      const now = new Date();
      const classDate = new Date(c.date + ' ' + c.time);
      return classDate >= now || c.attendees.find(a => a.email === userEmail);
    });
  }

  generateMeetLink() {
    const meetId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${meetId}`;
  }

  // Storage
  saveToStorage() {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(Array.from(this.chatHistory.entries())));
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      localStorage.setItem('virtualClasses', JSON.stringify(this.virtualClasses));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  loadStoredData() {
    try {
      const chatHistory = localStorage.getItem('chatHistory');
      if (chatHistory) {
        this.chatHistory = new Map(JSON.parse(chatHistory));
      }

      const notifications = localStorage.getItem('notifications');
      if (notifications) {
        this.notifications = JSON.parse(notifications);
      }

      const virtualClasses = localStorage.getItem('virtualClasses');
      if (virtualClasses) {
        this.virtualClasses = JSON.parse(virtualClasses);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }

  // Utility methods
  getUnreadCount(userRole, userEmail) {
    return this.getNotifications(userRole, userEmail).filter(n => !n.read).length;
  }

  getChatUnreadCount(chatId) {
    const messages = this.getChatHistory(chatId);
    return messages.filter(m => m.status !== 'seen').length;
  }

  isUserOnline(userEmail) {
    return this.onlineUsers.has(userEmail);
  }

  getLastSeen(userEmail) {
    // Simulate last seen data
    const lastSeenTimes = {
      'admin@demo.com': new Date(Date.now() - 5 * 60000),
      'faculty@demo.com': new Date(Date.now() - 15 * 60000),
      'student@demo.com': new Date(Date.now() - 30 * 60000),
      'parent@demo.com': new Date(Date.now() - 60 * 60000)
    };
    return lastSeenTimes[userEmail] || new Date(Date.now() - 24 * 60 * 60000);
  }
}

// Create singleton instance
const realTimeService = new RealTimeService();
export default realTimeService;