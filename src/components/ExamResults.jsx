import React, { useState } from 'react';
import { Upload, Users, BookOpen, Plus } from 'lucide-react';

const ExamResults = () => {
  const [newResult, setNewResult] = useState({
    studentId: '',
    subject: '',
    marks: '',
    totalMarks: 100
  });

  const students = [
    { id: 36, name: 'ANSHU KUMAR', rollNumber: '21B01A05G0' },
    { id: 37, name: 'PRIYA SHARMA', rollNumber: '21B01A05G1' },
    { id: 38, name: 'RAHUL REDDY', rollNumber: '21B01A05G2' }
  ];

  const examResults = [
    { id: 1, studentId: 36, subject: 'Data Structures', marks: 85, totalMarks: 100, grade: 'A' },
    { id: 2, studentId: 37, subject: 'Database Management', marks: 92, totalMarks: 100, grade: 'A+' },
    { id: 3, studentId: 38, subject: 'Software Engineering', marks: 78, totalMarks: 100, grade: 'B+' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Exam result added successfully!');
    setNewResult({ studentId: '', subject: '', marks: '', totalMarks: 100 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white flex items-center">
          <Upload className="h-5 w-5 mr-2 text-[#22c55e]" />
          Upload Exam Results
        </h3>
      </div>

      {/* Upload Form */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newResult.studentId}
            onChange={(e) => setNewResult({...newResult, studentId: e.target.value})}
            className="input-field"
            required
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Subject"
            value={newResult.subject}
            onChange={(e) => setNewResult({...newResult, subject: e.target.value})}
            className="input-field"
            required
          />
          
          <input
            type="number"
            placeholder="Marks Obtained"
            value={newResult.marks}
            onChange={(e) => setNewResult({...newResult, marks: e.target.value})}
            className="input-field"
            required
          />
          
          <button type="submit" className="btn-primary flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Result
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#22c55e]/20">
            <thead className="bg-[#22c55e]/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#27ae60] uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22c55e]/10">
              {examResults.map((result) => {
                const student = students.find(s => s.id === result.studentId);
                return (
                  <tr key={result.id} className="hover:bg-[#22c55e]/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                      {student?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                      {result.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                      {result.marks}/{result.totalMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        result.grade === 'A+' || result.grade === 'A' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                        result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;