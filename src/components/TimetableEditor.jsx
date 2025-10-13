import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Edit } from 'lucide-react';

const TimetableEditor = ({ isOpen, onClose, timetableType = 'student' }) => {
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedRoom, setSelectedRoom] = useState('Lab-1');
  const [selectedFaculty, setSelectedFaculty] = useState('Prof. Sumalatha');
  const [editMode, setEditMode] = useState(false);
  
  const getInitialTimetable = () => {
    if (timetableType === 'faculty') {
      return {
        Monday: [
          { time: '9:00-10:00', subject: 'Data Structures', deptSection: 'CSE-A', room: 'R203', type: 'Theory' },
          { time: '10:15-11:15', subject: 'Algorithms', deptSection: 'CSE-B', room: 'R204', type: 'Theory' }
        ],
        Tuesday: [
          { time: '9:00-10:00', subject: 'Data Structures', deptSection: 'CSE-A', room: 'R203', type: 'Theory' }
        ],
        Wednesday: [],
        Thursday: [
          { time: '9:00-12:00', subject: 'DS Lab', deptSection: 'CSE-A', room: 'Lab-1', type: 'Lab' }
        ],
        Friday: [
          { time: '10:15-11:15', subject: 'Algorithms', deptSection: 'CSE-B', room: 'R204', type: 'Theory' }
        ],
        Saturday: []
      };
    } else if (timetableType === 'lab') {
      return {
        Monday: [
          { time: '9:00-12:00', subject: 'DS Lab', deptSection: 'CSE-A', faculty: 'Prof. Sumalatha', type: 'Lab' },
          { time: '1:00-4:00', subject: 'CN Lab', deptSection: 'CSE-B', faculty: 'Dr. Murlidher', type: 'Lab' }
        ],
        Tuesday: [
          { time: '9:00-12:00', subject: 'Web Tech Lab', deptSection: 'CSE-A', faculty: 'Prof. Tukaram', type: 'Lab' }
        ],
        Wednesday: [],
        Thursday: [
          { time: '1:00-4:00', subject: 'DBMS Lab', deptSection: 'CSE-B', faculty: 'Prof. Rajesh', type: 'Lab' }
        ],
        Friday: [
          { time: '9:00-12:00', subject: 'OS Lab', deptSection: 'CSE-A', faculty: 'Dr. Murlidher', type: 'Lab' }
        ],
        Saturday: []
      };
    } else {
      return {
        Monday: [
          { time: '9:00-10:00', subject: 'Data Structures', faculty: 'Prof. Sumalatha', room: 'R203', type: 'Theory' },
          { time: '10:15-11:15', subject: 'Cloud Computing', faculty: 'Prof. Tukaram', room: 'R204', type: 'Theory' }
        ],
        Tuesday: [
          { time: '9:00-10:00', subject: 'Compiler Design', faculty: 'Prof. Rajesh', room: 'R203', type: 'Theory' }
        ],
        Wednesday: [],
        Thursday: [
          { time: '9:00-12:00', subject: 'DS Lab', faculty: 'Prof. Sumalatha', room: 'Lab-1', type: 'Lab' }
        ],
        Friday: [
          { time: '9:00-10:00', subject: 'Cloud Computing', faculty: 'Prof. Tukaram', room: 'R204', type: 'Theory' }
        ],
        Saturday: []
      };
    }
  };

  const [timetable, setTimetable] = useState(getInitialTimetable());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const departments = ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const sections = ['A', 'B', 'C'];
  const years = ['1', '2', '3', '4'];
  const rooms = ['Lab-1', 'Lab-2', 'Lab-3', 'R203', 'R204', 'R205'];
  const facultyList = ['Prof. Sumalatha', 'Prof. Tukaram', 'Dr. Murlidher', 'Prof. Rajesh'];
  const deptSections = ['CSE-A', 'CSE-B', 'ECE-A', 'ECE-B', 'EEE-A', 'MECH-A'];

  const addPeriod = (day) => {
    let newPeriod;
    if (timetableType === 'faculty') {
      newPeriod = { time: '', subject: '', deptSection: '', room: '', type: 'Theory' };
    } else if (timetableType === 'lab') {
      newPeriod = { time: '', subject: '', deptSection: '', faculty: '', type: 'Lab' };
    } else {
      newPeriod = { time: '', subject: '', faculty: '', room: '', type: 'Theory' };
    }
    setTimetable(prev => ({
      ...prev,
      [day]: [...prev[day], newPeriod]
    }));
  };

  const removePeriod = (day, index) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updatePeriod = (day, index, field, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].map((period, i) => 
        i === index ? { ...period, [field]: value } : period
      )
    }));
  };

  const saveTimetable = () => {
    let message;
    if (timetableType === 'faculty') {
      message = `Faculty timetable saved for ${selectedFaculty}!\nVisible to: Faculty, HoD, and Admin`;
    } else if (timetableType === 'lab') {
      message = `Lab timetable saved for ${selectedRoom}!\nVisible to: Lab Incharge, HoD, and Admin`;
    } else {
      message = `Student timetable saved for ${selectedDept}-${selectedSection} Year ${selectedYear}!\nVisible to: Students, Faculty, and Admin`;
    }
    alert(message);
    setEditMode(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {timetableType === 'faculty' ? 'Faculty Timetable' : 
             timetableType === 'lab' ? 'Lab Timetable' : 'Student Timetable'} Management
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Selection Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {timetableType === 'faculty' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {facultyList.map(faculty => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : timetableType === 'lab' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lab/Room</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="flex items-end">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  editMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Edit className="h-4 w-4 mr-2" />
                {editMode ? 'Cancel Edit' : 'Edit Mode'}
              </button>
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              {timetableType === 'faculty' ? `Faculty: ${selectedFaculty} (${selectedDept})` :
               timetableType === 'lab' ? `Lab: ${selectedRoom} (${selectedDept})` :
               `Class: ${selectedDept}-${selectedSection} Year ${selectedYear}`}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {timetableType === 'faculty' ? 'Visible to: Faculty, HoD, and Admin' :
               timetableType === 'lab' ? 'Visible to: Lab Incharge, HoD, and Admin' :
               'Visible to: Students, Faculty, and Admin'}
            </p>
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                    Day
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                    Schedule
                  </th>
                  {editMode && (
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
                      {day}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                      <div className="space-y-2">
                        {timetable[day].map((period, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  placeholder="Time"
                                  value={period.time}
                                  onChange={(e) => updatePeriod(day, index, 'time', e.target.value)}
                                  className="w-20 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Subject"
                                  value={period.subject}
                                  onChange={(e) => updatePeriod(day, index, 'subject', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                />
                                {timetableType === 'faculty' ? (
                                  <>
                                    <select
                                      value={period.deptSection || ''}
                                      onChange={(e) => updatePeriod(day, index, 'deptSection', e.target.value)}
                                      className="w-20 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    >
                                      <option value="">Dept-Sec</option>
                                      {deptSections.map(ds => <option key={ds} value={ds}>{ds}</option>)}
                                    </select>
                                    <input
                                      type="text"
                                      placeholder="Room"
                                      value={period.room}
                                      onChange={(e) => updatePeriod(day, index, 'room', e.target.value)}
                                      className="w-16 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    />
                                  </>
                                ) : timetableType === 'lab' ? (
                                  <>
                                    <select
                                      value={period.deptSection || ''}
                                      onChange={(e) => updatePeriod(day, index, 'deptSection', e.target.value)}
                                      className="w-20 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    >
                                      <option value="">Dept-Sec</option>
                                      {deptSections.map(ds => <option key={ds} value={ds}>{ds}</option>)}
                                    </select>
                                    <select
                                      value={period.faculty || ''}
                                      onChange={(e) => updatePeriod(day, index, 'faculty', e.target.value)}
                                      className="w-24 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    >
                                      <option value="">Faculty</option>
                                      {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                  </>
                                ) : (
                                  <>
                                    <input
                                      type="text"
                                      placeholder="Faculty"
                                      value={period.faculty}
                                      onChange={(e) => updatePeriod(day, index, 'faculty', e.target.value)}
                                      className="w-24 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Room"
                                      value={period.room}
                                      onChange={(e) => updatePeriod(day, index, 'room', e.target.value)}
                                      className="w-16 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                    />
                                  </>
                                )}
                                <select
                                  value={period.type}
                                  onChange={(e) => updatePeriod(day, index, 'type', e.target.value)}
                                  className="w-20 px-2 py-1 text-xs border rounded dark:bg-gray-600 dark:text-white"
                                >
                                  <option value="Theory">Theory</option>
                                  <option value="Lab">Lab</option>
                                  <option value="Tutorial">Tutorial</option>
                                </select>
                                <button
                                  onClick={() => removePeriod(day, index)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </>
                            ) : (
                              <div className="text-sm text-gray-900 dark:text-white">
                                <span className="font-medium">{period.time}</span> - 
                                <span className="ml-1">{period.subject}</span> 
                                {timetableType === 'faculty' ? (
                                  <>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">({period.deptSection})</span>
                                    <span className="text-gray-500 dark:text-gray-500 ml-1">[{period.room}]</span>
                                  </>
                                ) : timetableType === 'lab' ? (
                                  <>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">({period.deptSection})</span>
                                    <span className="text-gray-500 dark:text-gray-500 ml-1">[{period.faculty}]</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">({period.faculty})</span>
                                    <span className="text-gray-500 dark:text-gray-500 ml-1">[{period.room}]</span>
                                  </>
                                )}
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                  period.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 
                                  period.type === 'Tutorial' ? 'bg-orange-100 text-orange-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {period.type}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {editMode && (
                          <button
                            onClick={() => addPeriod(day)}
                            className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                          >
                            <Plus className="h-4 w-4 mx-auto" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          {editMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveTimetable}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Timetable
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableEditor;