import React, { useState } from 'react';
import { UserCheck, Plus, Search, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';

const FacultyManagement = ({ userRole = 'admin' }) => {
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      department: "Computer Science",
      subjects: ["Data Structures", "Algorithms"],
      phone: "+1234567893",
      experience: "10 years",
      status: 'active'
    },
    {
      id: 2,
      name: "Prof. Robert Brown",
      email: "robert.brown@university.edu",
      department: "Mathematics",
      subjects: ["Calculus", "Linear Algebra"],
      phone: "+1234567894",
      experience: "15 years",
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: '',
    phone: '',
    experience: ''
  });

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, facultyMember = null) => {
    setModalType(type);
    setSelectedFaculty(facultyMember);
    if (facultyMember) {
      setFormData({
        name: facultyMember.name,
        email: facultyMember.email,
        department: facultyMember.department,
        subjects: facultyMember.subjects.join(', '),
        phone: facultyMember.phone,
        experience: facultyMember.experience
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: '',
        subjects: '',
        phone: '',
        experience: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      const newFaculty = {
        id: Date.now(),
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()),
        status: 'active'
      };
      setFaculty([...faculty, newFaculty]);
    } else if (modalType === 'edit') {
      setFaculty(faculty.map(f => 
        f.id === selectedFaculty.id ? { 
          ...f, 
          ...formData,
          subjects: formData.subjects.split(',').map(s => s.trim())
        } : f
      ));
    }
    setShowModal(false);
  };

  const deleteFaculty = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFaculty(faculty.filter(f => f.id !== id));
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Faculty Management
        </h3>
        {userRole === 'admin' && (
          <button 
            onClick={() => openModal('add')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Faculty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subjects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFaculty.map((facultyMember) => (
              <tr key={facultyMember.id} className="table-row">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-300 font-medium">
                        {facultyMember.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {facultyMember.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {facultyMember.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {facultyMember.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex flex-wrap gap-1">
                    {facultyMember.subjects.map((subject, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {subject}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {facultyMember.experience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert(`Faculty Details:\nName: ${facultyMember.name}\nDepartment: ${facultyMember.department}\nPhone: ${facultyMember.phone}`)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <button 
                          onClick={() => openModal('edit', facultyMember)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteFaculty(facultyMember.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
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
              {modalType === 'add' ? 'Add New Faculty' : 'Edit Faculty'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                required
              />
              
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="input-field"
                required
              />
              
              <input
                type="text"
                placeholder="Subjects (comma separated)"
                value={formData.subjects}
                onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                className="input-field"
                required
              />
              
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="input-field"
                required
              />
              
              <input
                type="text"
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="input-field"
                required
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {modalType === 'add' ? 'Add Faculty' : 'Update Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;