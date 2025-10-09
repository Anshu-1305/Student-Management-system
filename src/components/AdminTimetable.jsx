import React, { useState } from 'react';
import { Calendar, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { syllabusData } from '../data/syllabusData';

const AdminTimetable = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedYear, setSelectedYear] = useState('4');
  const [selectedSemester, setSelectedSemester] = useState('1');

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const sections = ['A', 'B', 'C'];
  const years = ['1', '2', '3', '4'];
  const semesters = ['1', '2'];

  const timeSlots = [
    '09:20 – 10:20', '10:20 – 11:20', '11:20 – 12:20',
    '12:20 – 01:00', '01:00 – 02:00', '02:00 – 03:00', '03:00 – 04:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getSyllabusBasedTimetable = (dept, section, year, semester) => {
    const semesterKey = `${year}-${semester}`;
    const syllabusSubjects = syllabusData[semesterKey]?.subjects || [];
    
    const theorySubjects = syllabusSubjects.filter(s => s.L > 0 && s.type !== 'lab');
    const labSubjects = syllabusSubjects.filter(s => s.type === 'lab');
    const projectSubjects = syllabusSubjects.filter(s => s.type === 'project');
    
    // Different timetable patterns for each department
    const deptPatterns = {
      'CSE': {
        'Monday': [0, 1, 2, 'LUNCH', 3, 'lab0', 'lab0'],
        'Tuesday': ['lab1', 'lab1', 4, 'LUNCH', 0, 1, 'Sports'],
        'Wednesday': ['lab2', 'lab2', 2, 'LUNCH', 3, 'Tutorial', 'Tutorial'],
        'Thursday': [1, 0, 3, 'LUNCH', 2, 'project0', 'project0'],
        'Friday': [3, 2, 0, 'LUNCH', 4, 'Library', 'Library'],
        'Saturday': [1, 3, 4, 'LUNCH', 'Remedial', 'Seminar', 'Seminar']
      },
      'ECE': {
        'Monday': [1, 0, 3, 'LUNCH', 2, 'lab1', 'lab1'],
        'Tuesday': ['lab0', 'lab0', 4, 'LUNCH', 1, 3, 'Sports'],
        'Wednesday': [0, 2, 'lab2', 'LUNCH', 'lab2', 'Tutorial', 'Tutorial'],
        'Thursday': [2, 1, 0, 'LUNCH', 3, 'project0', 'project0'],
        'Friday': [0, 3, 1, 'LUNCH', 4, 'Library', 'Library'],
        'Saturday': [3, 0, 2, 'LUNCH', 'Remedial', 'Seminar', 'Seminar']
      },
      'EEE': {
        'Monday': [2, 1, 0, 'LUNCH', 3, 'lab2', 'lab2'],
        'Tuesday': [0, 3, 'lab0', 'LUNCH', 'lab0', 2, 'Sports'],
        'Wednesday': ['lab1', 'lab1', 1, 'LUNCH', 0, 'Tutorial', 'Tutorial'],
        'Thursday': [3, 2, 1, 'LUNCH', 0, 'project0', 'project0'],
        'Friday': [1, 0, 3, 'LUNCH', 4, 'Library', 'Library'],
        'Saturday': [0, 1, 4, 'LUNCH', 'Remedial', 'Seminar', 'Seminar']
      },
      'MECH': {
        'Monday': [0, 2, 1, 'LUNCH', 3, 'lab0', 'lab0'],
        'Tuesday': [3, 0, 'lab1', 'LUNCH', 'lab1', 1, 'Sports'],
        'Wednesday': [1, 'lab2', 'lab2', 'LUNCH', 2, 'Tutorial', 'Tutorial'],
        'Thursday': [2, 3, 0, 'LUNCH', 1, 'project0', 'project0'],
        'Friday': [3, 1, 2, 'LUNCH', 4, 'Library', 'Library'],
        'Saturday': [2, 0, 4, 'LUNCH', 'Remedial', 'Seminar', 'Seminar']
      },
      'CIVIL': {
        'Monday': [1, 3, 0, 'LUNCH', 2, 'lab1', 'lab1'],
        'Tuesday': [2, 'lab0', 'lab0', 'LUNCH', 3, 0, 'Sports'],
        'Wednesday': [0, 1, 'lab2', 'LUNCH', 'lab2', 'Tutorial', 'Tutorial'],
        'Thursday': [3, 0, 2, 'LUNCH', 1, 'project0', 'project0'],
        'Friday': [2, 3, 1, 'LUNCH', 4, 'Library', 'Library'],
        'Saturday': [1, 2, 4, 'LUNCH', 'Remedial', 'Seminar', 'Seminar']
      }
    };
    
    const pattern = deptPatterns[dept] || deptPatterns['CSE'];
    const result = {};
    
    Object.keys(pattern).forEach(day => {
      result[day] = pattern[day].map(slot => {
        if (slot === 'LUNCH' || typeof slot === 'string') return slot;
        if (typeof slot === 'string' && slot.startsWith('lab')) {
          const labIndex = parseInt(slot.replace('lab', ''));
          return labSubjects[labIndex]?.title || `Lab ${labIndex + 1}`;
        }
        if (typeof slot === 'string' && slot.startsWith('project')) {
          const projIndex = parseInt(slot.replace('project', ''));
          return projectSubjects[projIndex]?.title || 'Project Work';
        }
        return theorySubjects[slot]?.title || `Subject ${slot + 1}`;
      });
    });
    
    return result;
  };

  const getCurrentTimetable = () => {
    return getSyllabusBasedTimetable(selectedDepartment, selectedSection, selectedYear, selectedSemester);
  };

  const getSubjectColor = (subject) => {
    if (subject === 'LUNCH') return 'bg-[#E8F5E8] text-black';
    if (subject.includes('LAB')) return 'bg-[#4CAF50] text-white';
    if (subject.includes('Project') || subject.includes('Seminar')) return 'bg-[#66BB6A] text-white';
    if (subject.includes('CRT') || subject.includes('Tutorial')) return 'bg-[#81C784] text-black';
    if (subject.includes('Sports') || subject.includes('Library')) return 'bg-[#A5D6A7] text-black';
    return 'bg-[#2E7D32] text-white';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-[#22c55e]" />
          Department Timetables
        </h3>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#27ae60] mb-2">Department</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
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

          <div className="flex items-end">
            <button className="btn-secondary w-full flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Current Selection Info */}
      <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-[#27ae60]">
          {selectedDepartment} - Section {selectedSection} - Year {selectedYear} - Semester {selectedSemester}
        </h4>
        <p className="text-sm text-[#333333] dark:text-gray-300">
          Academic Year 2024-25 | {selectedYear}-{selectedSemester} Semester | Subjects from Syllabus
        </p>
      </div>

      {/* Timetable */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20]">
                <th className="p-4 text-left text-white font-semibold border-r border-[#1B5E20]">
                  Day / Time
                </th>
                {timeSlots.map((time, index) => (
                  <th key={index} className="p-4 text-center text-white font-semibold border-r border-[#1B5E20] last:border-r-0">
                    <div className="text-sm">{time}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={day} className="border-b border-[#A5D6A7]/20 hover:bg-[#F1F8E9] transition-colors duration-200">
                  <td className="p-4 font-semibold text-black dark:text-white bg-[#A5D6A7] border-r border-[#81C784]">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#2E7D32] mr-3"></div>
                      {day}
                    </div>
                  </td>
                  {getCurrentTimetable()[day]?.map((subject, periodIndex) => (
                    <td key={periodIndex} className="p-2 border-r border-[#A5D6A7]/20 last:border-r-0">
                      <div className={`${getSubjectColor(subject)} p-3 rounded-lg text-center transition-all duration-300 hover:scale-105 cursor-pointer min-h-[60px] flex flex-col justify-center relative group`}>
                        <div className="font-semibold text-sm leading-tight">
                          {subject}
                        </div>
                        
                        {/* Admin Actions */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex space-x-1">
                            <button className="p-1 bg-white/20 rounded hover:bg-white/40">
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="p-1 bg-white/20 rounded hover:bg-white/40">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">6</div>
          <div className="text-sm text-[#333333] dark:text-gray-300">Theory Classes</div>
        </div>
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">4</div>
          <div className="text-sm text-[#333333] dark:text-gray-300">Lab Sessions</div>
        </div>
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">30</div>
          <div className="text-sm text-[#333333] dark:text-gray-300">Hours/Week</div>
        </div>
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">5</div>
          <div className="text-sm text-[#333333] dark:text-gray-300">Subjects</div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimetable;