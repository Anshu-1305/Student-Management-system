import React, { useState, useEffect } from 'react';
import { Video, Calendar, Plus, Users, Clock, Link, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuth from './GoogleAuth';
import ClassCalendar from './ClassCalendar';

const VirtualClassroom = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [students, setStudents] = useState([]);

  const mockClasses = [
    {
      id: 1,
      title: 'Data Structures - Binary Trees',
      subject: 'Data Structures',
      date: '2024-01-25',
      time: '10:00',
      duration: 60,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      students: 45,
      status: 'scheduled',
      createdBy: 'Sumalatha'
    },
    {
      id: 2,
      title: 'Database Management - Normalization',
      subject: 'Database Management',
      date: '2024-01-26',
      time: '14:00',
      duration: 90,
      meetLink: 'https://meet.google.com/xyz-uvwx-yzab',
      students: 42,
      status: 'completed',
      createdBy: 'Sumalatha'
    }
  ];

  useEffect(() => {
    setClasses(mockClasses);
    // Load students for notifications
    setStudents([
      { email: 'anshu.kumar@student.edu', name: 'Anshu Kumar' },
      { email: 'priya.sharma@student.edu', name: 'Priya Sharma' },
      { email: 'rahul.reddy@student.edu', name: 'Rahul Reddy' }
    ]);
    
    // Load Google token
    const token = localStorage.getItem('google_access_token');
    if (token) setGoogleToken(token);
  }, []);

  const ScheduleClassModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      subject: '',
      date: '',
      time: '',
      duration: 60,
      description: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!googleToken) {
        alert('Please connect Google Calendar first');
        return;
      }
      
      setLoading(true);
      try {
        // Create Google Calendar event with Meet link
        const response = await fetch('/api/virtual-classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${googleToken}`
          },
          body: JSON.stringify({
            ...formData,
            attendees: students.map(s => s.email)
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setClasses([...classes, result]);
          setShowScheduleModal(false);
          alert(`Class scheduled! Meet link: ${result.meetLink}\nNotifications sent to ${students.length} students.`);
          setFormData({ title: '', subject: '', date: '', time: '', duration: 60, description: '' });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        alert('Failed to schedule class: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Schedule Virtual Class</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Class Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              required
            />
            
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select Subject</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Database Management">Database Management</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="input-field"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>

            <textarea
              placeholder="Class Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field h-20 resize-none"
            />

            <div className="flex space-x-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Scheduling...' : 'Schedule Class'}
              </button>
              <button type="button" onClick={() => setShowScheduleModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const canSchedule = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Video className="h-5 w-5 mr-2 text-[#22c55e]" />
          Virtual Classroom
        </h3>
        {canSchedule && (
          <button 
            onClick={() => setShowScheduleModal(true)} 
            disabled={!googleToken}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Class
          </button>
        )}
      </div>
      
      {/* Google Authentication */}
      {canSchedule && (
        <GoogleAuth onAuthSuccess={(token) => setGoogleToken(token)} />
      )}

      {/* Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.filter(c => c.status === 'scheduled').map((classItem) => (
          <div key={classItem.id} className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">{classItem.title}</h4>
                <p className="text-[#22c55e] font-medium">{classItem.subject}</p>
              </div>
              <span className="bg-[#22c55e]/10 text-[#22c55e] px-3 py-1 rounded-full text-sm font-medium">
                {classItem.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-black dark:text-white">
                <Calendar className="h-4 w-4 mr-2 text-[#22c55e]" />
                {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
              </div>
              <div className="flex items-center text-sm text-black dark:text-white">
                <Clock className="h-4 w-4 mr-2 text-[#22c55e]" />
                {classItem.duration} minutes
              </div>
              <div className="flex items-center text-sm text-black dark:text-white">
                <Users className="h-4 w-4 mr-2 text-[#22c55e]" />
                {classItem.students} students enrolled
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.open(classItem.meetLink, '_blank')}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(classItem.meetLink)}
                className="bg-white border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Link className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Classes */}
      {classes.filter(c => c.status === 'completed').length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Recent Classes</h4>
          <div className="space-y-3">
            {classes.filter(c => c.status === 'completed').map((classItem) => (
              <div key={classItem.id} className="bg-white dark:bg-black border border-[#A5D6A7] rounded-lg p-4 opacity-75">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">{classItem.title}</h5>
                    <p className="text-sm text-[#333333] dark:text-gray-300">{classItem.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black dark:text-white">{new Date(classItem.date).toLocaleDateString()}</p>
                    <span className="text-xs text-[#66BB6A]">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showScheduleModal && <ScheduleClassModal />}
      
      {/* Calendar View */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Class Calendar</h4>
        <ClassCalendar classes={classes} />
      </div>
    </div>
  );
};

export default VirtualClassroom;