import React, { useState } from 'react';
import { X, Upload, Download, Users, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const BulkStudentUpload = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
    } else {
      alert('Please select a CSV or Excel file');
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Student Name,Roll Number,Email,Phone,Department,Section,Year,Parent Name,Parent Email,Parent Phone,Parent Relation,Address
Anshu Kumar,226F1A05A4,anshu@student.edu,9876543210,CSE,B,3,Mr. Kumar,kumar@parent.com,9876543211,Father,Hyderabad
Priya Sharma,226F1A05B2,priya@student.edu,9876543212,CSE,B,3,Mrs. Sharma,sharma@parent.com,9876543213,Mother,Mumbai`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockResults = {
        total: 45,
        successful: 43,
        failed: 2,
        students: [
          { name: 'Anshu Kumar', rollNumber: '226F1A05A4', status: 'success' },
          { name: 'Priya Sharma', rollNumber: '226F1A05B2', status: 'success' },
          { name: 'Invalid Entry', rollNumber: '', status: 'failed', error: 'Missing roll number' }
        ]
      };
      
      setResults(mockResults);
      setUploading(false);
      
      alert(`Upload Complete!\n${mockResults.successful} students created successfully\n${mockResults.failed} entries failed\n\nBoth student and parent accounts have been created automatically.`);
    }, 3000);
  };

  const resetForm = () => {
    setFile(null);
    setResults(null);
    setUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bulk Student Upload</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Instructions</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Download the template CSV file and fill in student details</li>
              <li>• Each row creates both student and parent accounts automatically</li>
              <li>• Roll numbers must be unique (format: 226F1A05A4)</li>
              <li>• Passwords will be auto-generated for all accounts</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Download Template</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get the CSV template with sample data</p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Student Data File
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-file-upload"
                accept=".csv,.xlsx"
              />
              <label htmlFor="bulk-file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  CSV or Excel files only (Max 5MB)
                </p>
              </label>
            </div>
            {file && (
              <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-2" />
                Selected: {file.name}
              </div>
            )}
          </div>

          {/* Upload Results */}
          {results && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Upload Results</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{results.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{results.successful}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {results ? 'Close' : 'Cancel'}
            </button>
            {!results && (
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Upload Students
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkStudentUpload;