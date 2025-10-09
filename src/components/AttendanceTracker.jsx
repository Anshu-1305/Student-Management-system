import React, { useState } from 'react';
import { Users, Search, Check, X, Calendar } from 'lucide-react';

const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  const students = [
    { id: 36, name: 'ANSHU KUMAR', rollNumber: '21B01A05G0' },
    { id: 37, name: 'PRIYA SHARMA', rollNumber: '21B01A05G1' },
    { id: 38, name: 'RAHUL REDDY', rollNumber: '21B01A05G2' },
    { id: 39, name: 'SNEHA PATEL', rollNumber: '21B01A05G3' },
    { id: 40, name: 'ARJUN SINGH', rollNumber: '21B01A05G4' }
  ];

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    alert('Attendance saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-[#22c55e]" />
          Mark Attendance
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
          <button onClick={saveAttendance} className="btn-primary">
            Save Attendance
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#22c55e]/20">
            <thead className="bg-[#22c55e]/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Roll Number</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#27ae60] uppercase">Present</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#27ae60] uppercase">Absent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22c55e]/10">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-[#22c55e]/5">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={`p-2 rounded-full ${
                        attendance[student.id] === 'present'
                          ? 'bg-[#22c55e] text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={`p-2 rounded-full ${
                        attendance[student.id] === 'absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;