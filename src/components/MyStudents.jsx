import React, { useState } from 'react';
import { Users, Search, Filter, User, Mail, Phone } from 'lucide-react';

const MyStudents = () => {
  const [selectedYear, setSelectedYear] = useState('4');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedSection, setSelectedSection] = useState('B');
  const [searchTerm, setSearchTerm] = useState('');

  const years = ['1', '2', '3', '4'];
  const semesters = ['1', '2'];
  const sections = ['A', 'B', 'C'];

  const allStudents = {
    '4-1-B': [
      { id: 36, name: 'ANSHU KUMAR', rollNumber: '21B01A05G0', email: 'anshu.kumar@student.edu', phone: '+91-9876543210', attendance: 92, cgpa: 8.9 },
      { id: 37, name: 'PRIYA SHARMA', rollNumber: '21B01A05G1', email: 'priya.sharma@student.edu', phone: '+91-9876543211', attendance: 88, cgpa: 8.5 },
      { id: 38, name: 'RAHUL REDDY', rollNumber: '21B01A05G2', email: 'rahul.reddy@student.edu', phone: '+91-9876543212', attendance: 85, cgpa: 8.2 },
      { id: 39, name: 'SNEHA PATEL', rollNumber: '21B01A05G3', email: 'sneha.patel@student.edu', phone: '+91-9876543213', attendance: 94, cgpa: 9.1 },
      { id: 40, name: 'ARJUN SINGH', rollNumber: '21B01A05G4', email: 'arjun.singh@student.edu', phone: '+91-9876543214', attendance: 90, cgpa: 8.7 },
      { id: 41, name: 'KAVYA KRISHNA', rollNumber: '21B01A05G5', email: 'kavya.krishna@student.edu', phone: '+91-9876543215', attendance: 87, cgpa: 8.4 },
      { id: 42, name: 'VIKRAM GUPTA', rollNumber: '21B01A05G6', email: 'vikram.gupta@student.edu', phone: '+91-9876543216', attendance: 91, cgpa: 8.8 },
      { id: 43, name: 'ANANYA RAO', rollNumber: '21B01A05G7', email: 'ananya.rao@student.edu', phone: '+91-9876543217', attendance: 89, cgpa: 8.6 },
      { id: 44, name: 'KARTHIK KUMAR', rollNumber: '21B01A05G8', email: 'karthik.kumar@student.edu', phone: '+91-9876543218', attendance: 86, cgpa: 8.3 },
      { id: 45, name: 'DIVYA MENON', rollNumber: '21B01A05G9', email: 'divya.menon@student.edu', phone: '+91-9876543219', attendance: 93, cgpa: 9.0 }
    ],
    '4-1-A': [
      { id: 1, name: 'ADITYA SHARMA', rollNumber: '21B01A05A0', email: 'aditya.sharma@student.edu', phone: '+91-9876543220', attendance: 88, cgpa: 8.5 },
      { id: 2, name: 'BHAVYA REDDY', rollNumber: '21B01A05A1', email: 'bhavya.reddy@student.edu', phone: '+91-9876543221', attendance: 91, cgpa: 8.8 },
      { id: 3, name: 'CHETAN KUMAR', rollNumber: '21B01A05A2', email: 'chetan.kumar@student.edu', phone: '+91-9876543222', attendance: 85, cgpa: 8.2 }
    ],
    '3-1-B': [
      { id: 46, name: 'ROHIT VERMA', rollNumber: '22B01A05G0', email: 'rohit.verma@student.edu', phone: '+91-9876543230', attendance: 87, cgpa: 8.1 },
      { id: 47, name: 'SANYA GUPTA', rollNumber: '22B01A05G1', email: 'sanya.gupta@student.edu', phone: '+91-9876543231', attendance: 92, cgpa: 8.9 }
    ]
  };

  const getCurrentStudents = () => {
    const key = `${selectedYear}-${selectedSemester}-${selectedSection}`;
    return allStudents[key] || [];
  };

  const filteredStudents = getCurrentStudents().filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-[#22c55e]" />
          My Students
        </h3>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#27ae60] mb-2">Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-field"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#27ae60] mb-2">Semester</label>
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#27ae60] mb-2">Section</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
            >
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#27ae60] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection Info */}
      <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-[#27ae60]">
          CSE - Year {selectedYear} - Semester {selectedSemester} - Section {selectedSection}
        </h4>
        <p className="text-sm text-[#333333] dark:text-gray-300">
          Total Students: {filteredStudents.length} | Academic Year 2024-25
        </p>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#22c55e]/20">
            <thead className="bg-[#22c55e]/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">CGPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22c55e]/10">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-[#22c55e]/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#22c55e]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black dark:text-white">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black dark:text-white">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 mr-1 text-[#22c55e]" />
                        {student.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-[#22c55e]" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      student.attendance >= 90 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 
                      student.attendance >= 75 ? 'bg-[#81C784]/10 text-[#66BB6A]' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black dark:text-white">
                    {student.cgpa}/10.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No students found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;