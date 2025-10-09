import React, { useState } from 'react';
import { Award, Download, Eye, Plus, Calendar, User } from 'lucide-react';

const Certifications = ({ userRole = 'student' }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: '',
    description: ''
  });

  const certifications = [
    {
      id: 1,
      title: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024-01-15',
      description: 'Cloud computing fundamentals and AWS services',
      status: 'Completed',
      studentName: 'Anshu Kumar'
    },
    {
      id: 2,
      title: 'React Developer Certification',
      issuer: 'Meta',
      date: '2024-02-20',
      description: 'Advanced React.js development skills',
      status: 'In Progress',
      studentName: 'Priya Sharma'
    },
    {
      id: 3,
      title: 'Python Programming',
      issuer: 'Python Institute',
      date: '2024-03-10',
      description: 'Python programming fundamentals',
      status: 'Completed',
      studentName: 'Rahul Reddy'
    }
  ];

  const handleAddCertification = (e) => {
    e.preventDefault();
    alert('Certification added successfully!');
    setNewCert({ title: '', issuer: '', date: '', description: '' });
    setShowAddModal(false);
  };

  const AddCertificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Add Certification</h3>
        <form onSubmit={handleAddCertification} className="space-y-4">
          <input
            type="text"
            placeholder="Certification Title"
            value={newCert.title}
            onChange={(e) => setNewCert({...newCert, title: e.target.value})}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Issuing Organization"
            value={newCert.issuer}
            onChange={(e) => setNewCert({...newCert, issuer: e.target.value})}
            className="input-field"
            required
          />
          <input
            type="date"
            value={newCert.date}
            onChange={(e) => setNewCert({...newCert, date: e.target.value})}
            className="input-field"
            required
          />
          <textarea
            placeholder="Description"
            value={newCert.description}
            onChange={(e) => setNewCert({...newCert, description: e.target.value})}
            className="input-field h-20 resize-none"
          />
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary flex-1">Add Certification</button>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Award className="h-5 w-5 mr-2 text-[#22c55e]" />
          Certifications
        </h3>
        {userRole === 'faculty' && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#22c55e]/10 rounded-full">
                <Award className="h-6 w-6 text-[#22c55e]" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                cert.status === 'Completed' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {cert.status}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-black dark:text-white mb-2">{cert.title}</h4>
            <p className="text-[#22c55e] font-medium mb-2">{cert.issuer}</p>
            
            {userRole === 'faculty' && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <User className="h-4 w-4 mr-1" />
                {cert.studentName}
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(cert.date).toLocaleDateString()}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{cert.description}</p>

            <div className="flex space-x-2">
              <button className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button className="flex-1 bg-white border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddCertificationModal />}
    </div>
  );
};

export default Certifications;