import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit, Trash2, Eye, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const mockResults = [
    { id: 1, studentId: 36, studentName: 'ANSHU KUMAR', subject: 'Data Structures', marks: 88, totalMarks: 100, grade: 'A', semester: '4-1', examType: 'Mid-Term' },
    { id: 2, studentId: 36, studentName: 'ANSHU KUMAR', subject: 'Database Management', marks: 92, totalMarks: 100, grade: 'A+', semester: '4-1', examType: 'End-Term' },
    { id: 3, studentId: 36, studentName: 'ANSHU KUMAR', subject: 'Software Engineering', marks: 85, totalMarks: 100, grade: 'A', semester: '4-1', examType: 'Mid-Term' }
  ];

  useEffect(() => {
    if (user?.role === 'student') {
      setResults(mockResults.filter(r => r.studentId === user.id));
    } else {
      setResults(mockResults);
    }
  }, [user]);

  const canEdit = user?.role === 'admin';
  const canView = ['admin', 'faculty', 'student'].includes(user?.role);

  const AddResultModal = () => {
    const [formData, setFormData] = useState({
      studentId: '', subject: '', marks: '', totalMarks: 100, examType: 'Mid-Term', semester: '4-1'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const grade = calculateGrade(formData.marks, formData.totalMarks);
      const newResult = { ...formData, id: Date.now(), grade, marks: parseInt(formData.marks) };
      setResults([...results, newResult]);
      setShowAddModal(false);
      setFormData({ studentId: '', subject: '', marks: '', totalMarks: 100, examType: 'Mid-Term', semester: '4-1' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Add Result</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="input-field" required>
              <option value="">Select Student</option>
              <option value="36">ANSHU KUMAR</option>
              <option value="1">SRI RAHUL KUMAR RANA</option>
            </select>
            <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="input-field" required />
            <input type="number" placeholder="Marks" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} className="input-field" required />
            <select value={formData.examType} onChange={(e) => setFormData({...formData, examType: e.target.value})} className="input-field">
              <option value="Mid-Term">Mid-Term</option>
              <option value="End-Term">End-Term</option>
              <option value="Assignment">Assignment</option>
            </select>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary flex-1">Add Result</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const calculateGrade = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    return 'C';
  };

  if (!canView) {
    return (
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 text-center">
        <Lock className="h-12 w-12 text-[#22c55e] mx-auto mb-4" />
        <p className="text-black dark:text-white">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Award className="h-5 w-5 mr-2 text-[#22c55e]" />
          My Results
        </h3>
        {canEdit && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Result
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#22c55e]/20">
            <thead className="bg-[#22c55e]/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Exam Type</th>
                {canEdit && <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22c55e]/10">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-[#22c55e]/5">
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{result.studentName}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{result.subject}</td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{result.marks}/{result.totalMarks}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      result.grade === 'A+' || result.grade === 'A' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#81C784]/10 text-[#66BB6A]'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black dark:text-white">{result.examType}</td>
                  {canEdit && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="text-[#22c55e] hover:text-[#16a34a]">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddResultModal />}
    </div>
  );
};

export default MyResults;