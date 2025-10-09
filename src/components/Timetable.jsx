import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const mockTimetable = {
  'Monday': {
    '9:00 AM': { subject: 'Data Structures', teacher: 'Sumalatha', room: 'CSE-Lab1' },
    '10:00 AM': { subject: 'Machine Learning', teacher: 'Dr. Sai Hareesh', room: 'CSE-301' },
    '11:00 AM': { subject: 'Database Management', teacher: 'Sumalatha', room: 'CSE-302' },
    '2:00 PM': { subject: 'Software Engineering', teacher: 'Sumalatha', room: 'CSE-303' },
    '3:00 PM': { subject: 'Computer Networks', teacher: 'Dr. Rajesh Kumar', room: 'CSE-304' }
  },
  'Tuesday': {
    '9:00 AM': { subject: 'Database Lab', teacher: 'Sumalatha', room: 'CSE-Lab2' },
    '10:00 AM': { subject: 'Data Structures', teacher: 'Sumalatha', room: 'CSE-301' },
    '11:00 AM': { subject: 'Operating Systems', teacher: 'Dr. Rajesh Kumar', room: 'CSE-302' },
    '2:00 PM': { subject: 'Machine Learning', teacher: 'Dr. Sai Hareesh', room: 'CSE-303' },
    '3:00 PM': { subject: 'Software Engineering Lab', teacher: 'Sumalatha', room: 'CSE-Lab1' }
  },
  'Wednesday': {
    '9:00 AM': { subject: 'Software Engineering', teacher: 'Sumalatha', room: 'CSE-301' },
    '10:00 AM': { subject: 'Database Management', teacher: 'Sumalatha', room: 'CSE-302' },
    '11:00 AM': { subject: 'Machine Learning Lab', teacher: 'Dr. Sai Hareesh', room: 'CSE-Lab3' },
    '2:00 PM': { subject: 'Computer Networks', teacher: 'Dr. Rajesh Kumar', room: 'CSE-303' },
    '3:00 PM': { subject: 'Data Structures Lab', teacher: 'Sumalatha', room: 'CSE-Lab1' }
  },
  'Thursday': {
    '9:00 AM': { subject: 'Operating Systems', teacher: 'Dr. Rajesh Kumar', room: 'CSE-301' },
    '10:00 AM': { subject: 'Software Engineering', teacher: 'Sumalatha', room: 'CSE-302' },
    '11:00 AM': { subject: 'Machine Learning', teacher: 'Dr. Sai Hareesh', room: 'CSE-303' },
    '2:00 PM': { subject: 'Database Management', teacher: 'Sumalatha', room: 'CSE-304' },
    '3:00 PM': { subject: 'Computer Networks Lab', teacher: 'Dr. Rajesh Kumar', room: 'CSE-Lab2' }
  },
  'Friday': {
    '9:00 AM': { subject: 'Data Structures', teacher: 'Sumalatha', room: 'CSE-301' },
    '10:00 AM': { subject: 'Database Management', teacher: 'Sumalatha', room: 'CSE-302' },
    '11:00 AM': { subject: 'Software Engineering', teacher: 'Sumalatha', room: 'CSE-303' },
    '2:00 PM': { subject: 'Machine Learning', teacher: 'Dr. Sai Hareesh', room: 'CSE-304' },
    '3:00 PM': { subject: 'Project Work', teacher: 'Dr. Sai Hareesh', room: 'CSE-Lab3' }
  }
};

const Timetable = ({ userRole = 'student', onAddClass, onEditClass, onDeleteClass }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: '',
    time: ''
  });

  const handleSlotClick = (day, time, classData) => {
    if (userRole === 'admin' || userRole === 'faculty') {
      setSelectedSlot({ day, time, classData });
      if (classData) {
        setModalType('edit');
        setFormData({
          subject: classData.subject,
          teacher: classData.teacher,
          room: classData.room,
          day,
          time
        });
      } else {
        setModalType('add');
        setFormData({
          subject: '',
          teacher: '',
          room: '',
          day,
          time
        });
      }
      setShowModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddClass?.(formData);
    } else {
      onEditClass?.(formData);
    }
    setShowModal(false);
    setFormData({ subject: '', teacher: '', room: '', day: '', time: '' });
  };

  const handleDelete = () => {
    onDeleteClass?.(selectedSlot);
    setShowModal(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Class Timetable
        </h3>
        {(userRole === 'admin' || userRole === 'faculty') && (
          <button 
            onClick={() => {
              setModalType('add');
              setFormData({ subject: '', teacher: '', room: '', day: '', time: '' });
              setShowModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                Time
              </th>
              {days.map(day => (
                <th key={day} className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="border border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                  {time}
                </td>
                {days.map(day => {
                  const classData = mockTimetable[day]?.[time];
                  return (
                    <td 
                      key={`${day}-${time}`}
                      className={`border border-gray-300 dark:border-gray-600 p-2 h-20 ${
                        classData ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                      } ${(userRole === 'admin' || userRole === 'faculty') ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
                      onClick={() => handleSlotClick(day, time, classData)}
                    >
                      {classData && (
                        <div className="text-xs">
                          <div className="font-semibold text-blue-600 dark:text-blue-400">
                            {classData.subject}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {classData.teacher}
                          </div>
                          <div className="text-gray-500 dark:text-gray-500">
                            {classData.room}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-90vw modal-content">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {modalType === 'add' ? 'Add Class' : 'Edit Class'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teacher
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {modalType === 'add' ? 'Add' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
                
                {modalType === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;