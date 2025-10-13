// Centralized Data Service for all institute operations


class DataService {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('sms_data') || '{}');
  }

  saveData() {
    localStorage.setItem('sms_data', JSON.stringify(this.data));
  }

  getTenantData(tenantId = null) {
    const tenant = tenantId || 'default';
    if (!this.data[tenant]) {
      this.data[tenant] = {
        students: [],
        faculty: [],
        parents: [],
        timetables: {},
        attendance: {},
        results: {},
        assignments: {},
        materials: {},
        notifications: [],
        analytics: {}
      };
    }
    return this.data[tenant];
  }

  // Student Management
  addStudent(studentData) {
    const tenantData = this.getTenantData();
    const student = {
      id: Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString()
    };
    tenantData.students.push(student);
    this.saveData();
    return student;
  }

  getStudents() {
    return this.getTenantData().students;
  }

  updateStudent(id, updates) {
    const tenantData = this.getTenantData();
    const index = tenantData.students.findIndex(s => s.id === id);
    if (index !== -1) {
      tenantData.students[index] = { ...tenantData.students[index], ...updates };
      this.saveData();
      return tenantData.students[index];
    }
    return null;
  }

  // Faculty Management
  addFaculty(facultyData) {
    const tenantData = this.getTenantData();
    const faculty = {
      id: Date.now().toString(),
      ...facultyData,
      createdAt: new Date().toISOString()
    };
    tenantData.faculty.push(faculty);
    this.saveData();
    return faculty;
  }

  getFaculty() {
    return this.getTenantData().faculty;
  }

  // Attendance Management
  markAttendance(classId, date, attendanceData) {
    const tenantData = this.getTenantData();
    const key = `${classId}_${date}`;
    tenantData.attendance[key] = {
      classId,
      date,
      attendance: attendanceData,
      markedBy: 'current_faculty',
      markedAt: new Date().toISOString()
    };
    this.saveData();
    return tenantData.attendance[key];
  }

  getAttendance(classId, dateRange) {
    const tenantData = this.getTenantData();
    return Object.values(tenantData.attendance).filter(a => 
      a.classId === classId && 
      (!dateRange || (a.date >= dateRange.start && a.date <= dateRange.end))
    );
  }

  // Assignment Management
  addAssignment(assignmentData) {
    const tenantData = this.getTenantData();
    const assignment = {
      id: Date.now().toString(),
      ...assignmentData,
      createdAt: new Date().toISOString()
    };
    tenantData.assignments[assignment.id] = assignment;
    this.saveData();
    return assignment;
  }

  getAssignments(filters = {}) {
    const tenantData = this.getTenantData();
    let assignments = Object.values(tenantData.assignments);
    
    if (filters.subject) {
      assignments = assignments.filter(a => a.subject === filters.subject);
    }
    if (filters.faculty) {
      assignments = assignments.filter(a => a.faculty === filters.faculty);
    }
    
    return assignments;
  }

  // Course Materials
  addMaterial(materialData) {
    const tenantData = this.getTenantData();
    const material = {
      id: Date.now().toString(),
      ...materialData,
      uploadedAt: new Date().toISOString()
    };
    tenantData.materials[material.id] = material;
    this.saveData();
    return material;
  }

  getMaterials(subject = null) {
    const tenantData = this.getTenantData();
    let materials = Object.values(tenantData.materials);
    
    if (subject) {
      materials = materials.filter(m => m.subject === subject);
    }
    
    return materials;
  }

  // Notifications
  addNotification(notificationData) {
    const tenantData = this.getTenantData();
    const notification = {
      id: Date.now().toString(),
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false
    };
    tenantData.notifications.unshift(notification);
    this.saveData();
    return notification;
  }

  getNotifications(userId = null, role = null) {
    const tenantData = this.getTenantData();
    let notifications = tenantData.notifications;
    
    if (role) {
      notifications = notifications.filter(n => 
        !n.targetRole || n.targetRole === role || n.targetRole === 'all'
      );
    }
    
    return notifications;
  }

  // Chat Messages
  getChatMessages(senderId, recipientId) {
    const tenantData = this.getTenantData();
    if (!tenantData.chats) tenantData.chats = {};
    const key = [senderId, recipientId].sort().join('_');
    return tenantData.chats[key] || [];
  }

  addChatMessage(message) {
    const tenantData = this.getTenantData();
    if (!tenantData.chats) tenantData.chats = {};
    const key = [message.senderId, message.recipientId].sort().join('_');
    if (!tenantData.chats[key]) tenantData.chats[key] = [];
    
    const chatMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString()
    };
    
    tenantData.chats[key].push(chatMessage);
    this.saveData();
    return chatMessage;
  }

  // Parent-specific data
  getParentChildren(parentId) {
    const students = this.getStudents();
    return students.filter(student => student.parentId === parentId);
  }

  getStudentAttendance(studentId) {
    const tenantData = this.getTenantData();
    if (!tenantData.studentAttendance) tenantData.studentAttendance = {};
    
    return tenantData.studentAttendance[studentId] || {
      overall: 87,
      subjects: [
        { subject: 'Mathematics', attendance: 85, total: 40, present: 34, absent: 6 },
        { subject: 'Physics', attendance: 92, total: 38, present: 35, absent: 3 },
        { subject: 'Chemistry', attendance: 78, total: 35, present: 27, absent: 8 },
        { subject: 'English', attendance: 89, total: 42, present: 37, absent: 5 }
      ]
    };
  }

  getStudentResults(studentId) {
    const tenantData = this.getTenantData();
    if (!tenantData.studentResults) tenantData.studentResults = {};
    
    return tenantData.studentResults[studentId] || [
      { semester: 5, sgpa: 9.1, cgpa: 8.9, status: 'Current' },
      { semester: 4, sgpa: 8.8, cgpa: 8.8, status: 'Completed' },
      { semester: 3, sgpa: 8.9, cgpa: 8.9, status: 'Completed' },
      { semester: 2, sgpa: 9.0, cgpa: 9.0, status: 'Completed' },
      { semester: 1, sgpa: 8.7, cgpa: 8.7, status: 'Completed' }
    ];
  }

  getFeeStatus(studentId) {
    const tenantData = this.getTenantData();
    if (!tenantData.feeStatus) tenantData.feeStatus = {};
    
    return tenantData.feeStatus[studentId] || {
      totalAmount: 150000,
      paidAmount: 120000,
      pendingAmount: 30000,
      dueDate: '2024-03-15',
      status: 'Pending'
    };
  }

  updateFeeStatus(studentId, feeData) {
    const tenantData = this.getTenantData();
    if (!tenantData.feeStatus) tenantData.feeStatus = {};
    tenantData.feeStatus[studentId] = feeData;
    this.saveData();
    return feeData;
  }

  processPayment(studentId, amount) {
    const feeStatus = this.getFeeStatus(studentId);
    const updatedFees = {
      ...feeStatus,
      paidAmount: feeStatus.paidAmount + amount,
      pendingAmount: Math.max(0, feeStatus.pendingAmount - amount),
      status: (feeStatus.pendingAmount - amount) <= 0 ? 'Paid' : 'Pending'
    };
    return this.updateFeeStatus(studentId, updatedFees);
  }

  // Communication helpers
  getFacultyList() {
    return [
      { id: 'faculty1', name: 'Ms. Priya Sharma', role: 'Class Teacher', subject: 'Mathematics' },
      { id: 'faculty2', name: 'Mr. Rajesh Kumar', role: 'Subject Teacher', subject: 'Physics' },
      { id: 'faculty3', name: 'Dr. Sumalatha', role: 'HOD', subject: 'Computer Science' }
    ];
  }

  getAdminList() {
    return [
      { id: 'admin1', name: 'Admin Office', role: 'General Admin' },
      { id: 'fee_dept', name: 'Fee Department', role: 'Fee Admin' },
      { id: 'academic_office', name: 'Academic Office', role: 'Academic Admin' }
    ];
  }

  getCurrentInstitute() {
    const stored = localStorage.getItem('currentInstitute');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored institute:', e);
      }
    }
    return {
      name: 'Demo Institute',
      logo: '/api/placeholder/40/40',
      primaryColor: '#059669',
      shortName: 'DI'
    };
  }

  // Timetable Management
  getTimetable(type = 'student') {
    const tenantData = this.getTenantData();
    if (!tenantData.timetables[type]) {
      tenantData.timetables[type] = {
        Monday: [
          { time: '9:00-10:00', subject: 'Mathematics', faculty: 'Ms. Priya', room: 'R101' },
          { time: '10:00-11:00', subject: 'Physics', faculty: 'Mr. Rajesh', room: 'R102' }
        ],
        Tuesday: [
          { time: '9:00-10:00', subject: 'Chemistry', faculty: 'Dr. Sumalatha', room: 'R103' }
        ]
      };
    }
    return tenantData.timetables[type];
  }

  // Analytics
  getAnalytics() {
    const tenantData = this.getTenantData();
    const students = tenantData.students;
    const faculty = tenantData.faculty;
    const attendance = Object.values(tenantData.attendance);
    
    return {
      totalStudents: students.length,
      totalFaculty: faculty.length,
      avgAttendance: attendance.length > 0 ? 
        attendance.reduce((sum, a) => sum + (Object.values(a.attendance).filter(Boolean).length / Object.keys(a.attendance).length * 100), 0) / attendance.length : 0,
      activeClasses: new Set(attendance.map(a => a.classId)).size,
      recentActivity: [
        ...students.slice(-5).map(s => ({ type: 'student_added', data: s })),
        ...faculty.slice(-3).map(f => ({ type: 'faculty_added', data: f }))
      ]
    };
  }
}

export const dataService = new DataService();