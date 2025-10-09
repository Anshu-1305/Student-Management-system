import React, { useState } from 'react';
import { Users, CreditCard, Calendar, TrendingUp, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ParentalPortal = () => {
  const [selectedChild, setSelectedChild] = useState('1');

  const childData = {
    1: {
      name: 'Anshu Kumar',
      class: 'CSE-B',
      year: '4-1',
      rollNumber: 'CSE001'
    }
  };

  const feeData = {
    total: 85000,
    paid: 60000,
    due: 25000,
    nextDueDate: '2024-02-15',
    breakdown: [
      { category: 'Tuition Fee', amount: 50000, paid: 40000 },
      { category: 'Lab Fee', amount: 15000, paid: 10000 },
      { category: 'Library Fee', amount: 5000, paid: 5000 },
      { category: 'Exam Fee', amount: 8000, paid: 5000 },
      { category: 'Miscellaneous', amount: 7000, paid: 0 }
    ]
  };

  const attendanceData = [
    { subject: 'Data Structures', present: 28, total: 32, percentage: 87.5 },
    { subject: 'Database Management', present: 30, total: 32, percentage: 93.8 },
    { subject: 'Software Engineering', present: 26, total: 30, percentage: 86.7 },
    { subject: 'Machine Learning', present: 24, total: 28, percentage: 85.7 }
  ];

  const examSchedule = [
    { subject: 'Data Structures', date: '2024-02-05', time: '10:00 AM', room: 'CSE-301' },
    { subject: 'Database Management', date: '2024-02-07', time: '2:00 PM', room: 'CSE-302' },
    { subject: 'Software Engineering', date: '2024-02-10', time: '10:00 AM', room: 'CSE-303' },
    { subject: 'Machine Learning', date: '2024-02-12', time: '2:00 PM', room: 'CSE-304' }
  ];

  const performanceData = [
    { subject: 'Data Structures', marks: 88, grade: 'A' },
    { subject: 'Database Management', marks: 92, grade: 'A+' },
    { subject: 'Software Engineering', marks: 85, grade: 'A' },
    { subject: 'Machine Learning', marks: 90, grade: 'A+' }
  ];

  const facultyContacts = [
    { name: 'Sumalatha', designation: 'Assistant Professor', subjects: ['Data Structures', 'Database Management'], phone: '+91-9876543221', email: 'sumalatha@university.edu' },
    { name: 'Dr. Sai Hareesh', designation: 'Head of Department', subjects: ['Machine Learning'], phone: '+91-9876543220', email: 'sai.hareesh@university.edu' }
  ];

  const remarks = [
    { date: '2024-01-20', faculty: 'Sumalatha', subject: 'Data Structures', remark: 'Excellent performance in lab assignments. Keep up the good work!', type: 'positive' },
    { date: '2024-01-18', faculty: 'Dr. Sai Hareesh', subject: 'Machine Learning', remark: 'Need to improve attendance. Please ensure regular class participation.', type: 'warning' },
    { date: '2024-01-15', faculty: 'Sumalatha', subject: 'Software Engineering', remark: 'Good understanding of concepts. Submitted project on time.', type: 'positive' }
  ];

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Parental Portal
        </h3>
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="input-field w-auto"
        >
          <option value="1">Anshu Kumar - CSE-B</option>
        </select>
      </div>

      {/* Student Info Card */}
      <div className="card">
        <div className="flex items-center">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {childData[selectedChild].name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {childData[selectedChild].name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {childData[selectedChild].rollNumber} | {childData[selectedChild].class} | {childData[selectedChild].year}
            </p>
          </div>
        </div>
      </div>

      {/* Fee Management */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Fee Management
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Fee</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{feeData.total.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">Paid</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{feeData.paid.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">Due</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">₹{feeData.due.toLocaleString()}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Due: {feeData.nextDueDate}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {feeData.breakdown.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600">₹{item.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-600">₹{(item.amount - item.paid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attendance Overview
        </h4>
        <div className="space-y-4">
          {attendanceData.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.present}/{subject.total} classes attended
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getAttendanceColor(subject.percentage)}`}>
                  {subject.percentage}%
                </p>
                {subject.percentage < 75 && (
                  <div className="flex items-center text-red-600 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below 75%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Schedule */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Exams
        </h4>
        <div className="space-y-3">
          {examSchedule.map((exam, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">{exam.subject}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Room: {exam.room}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">{exam.date}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Reports */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance Reports
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="marks" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Faculty Contacts */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Faculty Contacts
        </h4>
        <div className="space-y-4">
          {facultyContacts.map((faculty, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{faculty.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faculty.designation}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Subjects: {faculty.subjects.join(', ')}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-900 dark:text-white">{faculty.phone}</p>
                  <p className="text-gray-600 dark:text-gray-400">{faculty.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remarks Section */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Faculty Remarks
        </h4>
        <div className="space-y-4">
          {remarks.map((remark, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              remark.type === 'positive' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
              'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{remark.subject}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">by {remark.faculty}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{remark.date}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{remark.remark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentalPortal;