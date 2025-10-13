import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Award, Users, BookOpen, Clock } from 'lucide-react';

const ReportAnalysis = ({ isOpen, onClose, userRole = 'student' }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  useEffect(() => {
    if (isOpen) {
      loadReportData();
    }
  }, [isOpen, selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = {
      student: {
        academic: { cgpa: 8.9, sgpa: 9.1, rank: 5, totalStudents: 60 },
        attendance: { overall: 87, trend: '+3%' },
        subjects: [
          { name: 'Compiler Design', grade: 'A', attendance: 85, marks: 92 },
          { name: 'Cloud Computing', grade: 'A+', attendance: 92, marks: 95 },
          { name: 'Cryptography', grade: 'B+', attendance: 78, marks: 88 }
        ],
        trends: { improving: 2, declining: 1, stable: 2 }
      },
      faculty: {
        classes: { total: 25, completed: 22, pending: 3 },
        students: { total: 120, active: 115, lowAttendance: 8 },
        performance: { avgGrade: 8.2, passRate: 94, topPerformers: 15 },
        subjects: ['Data Structures', 'Algorithms', 'Database Systems']
      },
      admin: {
        overview: { totalStudents: 1250, totalFaculty: 45, departments: 6 },
        performance: { avgCGPA: 8.1, passRate: 92, topRankers: 25 },
        attendance: { overall: 89, belowThreshold: 45 },
        trends: { enrollment: '+12%', performance: '+5%', satisfaction: '94%' }
      },
      parent: {
        child: { name: 'Anshu Kumar', cgpa: 8.9, rank: 5, attendance: 87 },
        subjects: [
          { name: 'Compiler Design', performance: 'Good', attendance: 85 },
          { name: 'Cloud Computing', performance: 'Excellent', attendance: 92 }
        ],
        recommendations: ['Improve Cryptography attendance', 'Maintain excellent performance']
      }
    };

    setReportData(mockData[userRole]);
    setLoading(false);
  };

  const generateReport = () => {
    alert(`Generating ${selectedPeriod} report for ${userRole}...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Report Analysis</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="semester">This Semester</option>
              <option value="year">Academic Year</option>
              <option value="month">This Month</option>
            </select>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading report data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Student Report */}
              {userRole === 'student' && reportData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                        <Award className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{reportData.academic.cgpa}</p>
                          <p className="text-sm text-blue-600">CGPA</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-green-600">{reportData.academic.rank}</p>
                          <p className="text-sm text-green-600">Class Rank</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{reportData.attendance.overall}%</p>
                          <p className="text-sm text-yellow-600">Attendance</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{reportData.subjects.length}</p>
                          <p className="text-sm text-purple-600">Subjects</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Subject Performance</h4>
                    <div className="space-y-2">
                      {reportData.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                          <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Grade: {subject.grade}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Marks: {subject.marks}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Attendance: {subject.attendance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Faculty Report */}
              {userRole === 'faculty' && reportData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Classes</h4>
                      <p className="text-2xl font-bold text-blue-600">{reportData.classes.completed}/{reportData.classes.total}</p>
                      <p className="text-sm text-blue-600">Completed</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Students</h4>
                      <p className="text-2xl font-bold text-green-600">{reportData.students.active}</p>
                      <p className="text-sm text-green-600">Active Students</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Performance</h4>
                      <p className="text-2xl font-bold text-purple-600">{reportData.performance.avgGrade}</p>
                      <p className="text-sm text-purple-600">Avg Grade</p>
                    </div>
                  </div>
                </>
              )}

              {/* Admin Report */}
              {userRole === 'admin' && reportData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{reportData.overview.totalStudents}</p>
                          <p className="text-sm text-blue-600">Students</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-green-600">{reportData.overview.totalFaculty}</p>
                          <p className="text-sm text-green-600">Faculty</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-8 w-8 text-yellow-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{reportData.performance.avgCGPA}</p>
                          <p className="text-sm text-yellow-600">Avg CGPA</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{reportData.attendance.overall}%</p>
                          <p className="text-sm text-purple-600">Attendance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Parent Report */}
              {userRole === 'parent' && reportData && (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Child Progress Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{reportData.child.cgpa}</p>
                        <p className="text-sm text-blue-600">CGPA</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{reportData.child.rank}</p>
                        <p className="text-sm text-green-600">Class Rank</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{reportData.child.attendance}%</p>
                        <p className="text-sm text-yellow-600">Attendance</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {reportData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={generateReport}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;