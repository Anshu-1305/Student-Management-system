import React, { useState } from 'react';
import { FileText, Upload, Download, Folder, Search, Plus, Eye } from 'lucide-react';

const CourseMaterial = ({ userRole = 'student' }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const materials = [
    {
      id: 1,
      title: 'Data Structures - Unit 1 Notes',
      subject: 'Data Structures',
      type: 'notes',
      uploadedBy: 'Sumalatha',
      uploadDate: '2024-01-15',
      size: '2.5 MB',
      downloads: 45
    },
    {
      id: 2,
      title: 'Database Assignment - ER Diagrams',
      subject: 'Database Management',
      type: 'assignment',
      uploadedBy: 'Sumalatha',
      uploadDate: '2024-01-18',
      size: '1.2 MB',
      downloads: 32
    },
    {
      id: 3,
      title: 'Machine Learning Slides - Chapter 3',
      subject: 'Machine Learning',
      type: 'slides',
      uploadedBy: 'Dr. Sai Hareesh',
      uploadDate: '2024-01-20',
      size: '5.8 MB',
      downloads: 28
    },
    {
      id: 4,
      title: 'Software Engineering Project Guidelines',
      subject: 'Software Engineering',
      type: 'guidelines',
      uploadedBy: 'Sumalatha',
      uploadDate: '2024-01-22',
      size: '800 KB',
      downloads: 15
    }
  ];

  const subjects = ['Data Structures', 'Database Management', 'Machine Learning', 'Software Engineering'];

  const filteredMaterials = materials.filter(material => {
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notes': return '📝';
      case 'assignment': return '📋';
      case 'slides': return '📊';
      case 'guidelines': return '📖';
      default: return '📄';
    }
  };

  const handleUpload = () => {
    alert('File upload functionality - would open file picker');
    setShowUploadModal(false);
  };

  const handleDownload = (material) => {
    alert(`Downloading: ${material.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Course Materials
        </h3>
        {(userRole === 'admin' || userRole === 'faculty') && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Material
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <div key={material.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getTypeIcon(material.type)}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {material.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {material.subject}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Uploaded by:</span>
                <span className="font-medium">{material.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{material.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Downloads:</span>
                <span>{material.downloads}</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => alert(`Viewing: ${material.title}`)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-xs flex items-center justify-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </button>
              <button
                onClick={() => handleDownload(material)}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-xs flex items-center justify-center"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 modal-content">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Course Material
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input type="text" className="input-field" placeholder="Enter material title" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select className="input-field">
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select className="input-field">
                  <option value="notes">Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="slides">Slides</option>
                  <option value="guidelines">Guidelines</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterial;