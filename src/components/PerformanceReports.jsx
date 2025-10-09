import React, { useState } from 'react';
import { BarChart3, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const PerformanceReports = ({ userRole = 'student' }) => {
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [compareType, setCompareType] = useState('semester');

  const performanceData = [
    { subject: 'Data Structures vs Database Mgmt', sem1: 85, sem2: 92, improvement: 7, comparison: 'DS (3-2) vs DBMS (4-1)' },
    { subject: 'Software Engg vs Machine Learning', sem1: 90, sem2: 88, improvement: -2, comparison: 'SE (3-2) vs ML (4-1)' },
    { subject: 'Compiler Design vs Cryptography', sem1: 82, sem2: 90, improvement: 8, comparison: 'CD (4-1) vs CNS (4-1)' },
    { subject: 'Operating Systems vs Computer Networks', sem1: 78, sem2: 85, improvement: 7, comparison: 'OS (2-2) vs CN (3-1)' }
  ];

  const subjectAnalysis = [
    { subject: 'Data Structures', avgMarks: 86.5, weakAreas: ['Trees', 'Graphs'], strongAreas: ['Arrays', 'Stacks'] },
    { subject: 'Database Management', avgMarks: 85, weakAreas: ['Normalization'], strongAreas: ['SQL', 'ER Diagrams'] }
  ];

  const generateReport = () => {
    alert('Performance report generated and downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Performance Reports
        </h3>
        <button onClick={generateReport} className="btn-primary flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userRole !== 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Student
              </label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="input-field">
                <option value="1">Anshu Kumar</option>
                <option value="2">Priya Sharma</option>
                <option value="3">Rahul Reddy</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compare By
            </label>
            <select value={compareType} onChange={(e) => setCompareType(e.target.value)} className="input-field">
              <option value="semester">Semester Wise</option>
              <option value="exam">Exam Wise</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Academic Year
            </label>
            <select className="input-field">
              <option value="2025">2025-26</option>
              <option value="2024">2024-25</option>
              <option value="2023">2023-24</option>
              <option value="2022">2022-23</option>
              <option value="2021">2021-22</option>
              <option value="2020">2020-21</option>
              <option value="2019">2019-20</option>
              <option value="2018">2018-19</option>
              <option value="2017">2017-18</option>
              <option value="2016">2016-17</option>
              <option value="2015">2015-16</option>
            </select>
          </div>
        </div>
      </div>



      {/* Improvement Analysis */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Improvement Analysis
        </h4>
        <div className="space-y-4">
          {performanceData.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.comparison}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {subject.sem1} vs {subject.sem2} marks
                </p>
              </div>
              <div className="flex items-center">
                {subject.improvement > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className={`font-semibold ${subject.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {subject.improvement > 0 ? '+' : ''}{subject.improvement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Analysis for Faculty */}
      {userRole === 'faculty' && (
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subject-wise Analysis
          </h4>
          <div className="space-y-4">
            {subjectAnalysis.map((subject, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h5>
                  <span className="text-lg font-bold text-blue-600">{subject.avgMarks}%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">Weak Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {subject.weakAreas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Strong Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {subject.strongAreas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReports;