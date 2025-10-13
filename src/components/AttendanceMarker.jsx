import React, { useState, useEffect } from 'react';
import { Users, Check, X, Save, Calendar } from 'lucide-react';
import { dataService } from '../services/dataService';

const AttendanceMarker = ({ isOpen, onClose, classData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = () => {
    const allStudents = dataService.getStudents();
    const classStudents = allStudents.filter(s => 
      s.section === classData?.section && s.department === classData?.department
    );
    setStudents(classStudents);
    
    // Initialize attendance
    const initialAttendance = {};
    classStudents.forEach(student => {
      initialAttendance[student.id] = true; // Default present
    });
    setAttendance(initialAttendance);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendance(allAbsent);
  };

  const saveAttendance = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dataService.markAttendance(
      `${classData.department}_${classData.section}`,
      selectedDate,
      attendance
    );
    
    alert('Attendance marked successfully!');
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = students.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Mark Attendance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {classData?.department}-{classData?.section} • {classData?.subject}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{presentCount}/{totalCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                All Absent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {students.map((student) => (
              <div
                key={student.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  attendance[student.id]
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                }`}
                onClick={() => toggleAttendance(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.rollNumber}</p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    attendance[student.id] ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {attendance[student.id] ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={saveAttendance}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMarker;