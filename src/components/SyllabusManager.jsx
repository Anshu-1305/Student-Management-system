import React, { useState } from 'react';
import { BookOpen, Calendar, BarChart3, Clock, Users, Download, Filter } from 'lucide-react';
import { syllabusData, getSemesterSummary, timeSlots, days } from '../data/syllabusData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SyllabusManager = () => {
  const [selectedSemester, setSelectedSemester] = useState('4-1');
  const [activeTab, setActiveTab] = useState('overview');
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  const semesterOptions = [
    { key: '1-1', label: 'I Year I Semester' },
    { key: '1-2', label: 'I Year II Semester' },
    { key: '2-1', label: 'II Year I Semester' },
    { key: '2-2', label: 'II Year II Semester' },
    { key: '3-1', label: 'III Year I Semester' },
    { key: '3-2', label: 'III Year II Semester' },
    { key: '4-1', label: 'IV Year I Semester' },
    { key: '4-2', label: 'IV Year II Semester' }
  ];

  const generateTimetable = () => {
    const semesterData = syllabusData[selectedSemester];
    if (!semesterData) return;

    // Simple timetable generation logic
    const subjects = semesterData.subjects.filter(s => s.L > 0 || s.P > 0);
    const timetable = {};
    
    days.forEach(day => {
      timetable[day] = [];
      let periodIndex = 0;
      
      subjects.forEach((subject, index) => {
        if (periodIndex >= 6) return; // Max 6 periods per day
        
        if (subject.P > 0 && subject.P >= 3) {
          // Lab sessions (2-3 periods)
          timetable[day].push({
            periods: [periodIndex, periodIndex + 1],
            subject: subject.title,
            code: subject.code,
            type: 'lab',
            room: subject.room || 'Lab'
          });
          periodIndex += 2;
        } else if (subject.L > 0) {
          // Theory classes (1 period)
          timetable[day].push({
            periods: [periodIndex],
            subject: subject.title,
            code: subject.code,
            type: 'theory',
            room: 'Classroom'
          });
          periodIndex += 1;
        }
      });
    });

    setGeneratedTimetable(timetable);
  };

  const currentSemester = syllabusData[selectedSemester];
  const summary = getSemesterSummary(selectedSemester);

  const creditChartData = summary ? [
    { name: 'Core', value: summary.creditDistribution.core, color: '#22c55e' },
    { name: 'Electives', value: summary.creditDistribution.electives, color: '#16a34a' },
    { name: 'Labs', value: summary.creditDistribution.labs, color: '#15803d' },
    { name: 'Projects', value: summary.creditDistribution.projects, color: '#166534' }
  ].filter(item => item.value > 0) : [];

  const typeDistribution = summary ? [
    { type: 'Core Subjects', count: summary.core.length },
    { type: 'Electives', count: summary.electives.length },
    { type: 'Lab Courses', count: summary.labs.length },
    { type: 'Projects', count: summary.projects.length },
    { type: 'Mandatory', count: summary.mandatory.length }
  ].filter(item => item.count > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="h-6 w-6 mr-3" />
          B.Tech CSE (R22) Syllabus Manager
        </h3>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="input-field w-auto"
        >
          {semesterOptions.map(option => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'timetable', label: 'Timetable Generator', icon: Calendar },
          { id: 'study-plan', label: 'Study Plan', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-[#22c55e] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-[#22c55e] dark:hover:text-[#2ecc71]'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && summary && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <BookOpen className="h-8 w-8 text-[#22c55e]" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-black dark:text-white">{summary.totalSubjects}</p>
                  <p className="text-sm text-[#27ae60] dark:text-[#2ecc71]">Total Subjects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <BarChart3 className="h-8 w-8 text-[#22c55e]" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-black dark:text-white">{summary.totalCredits}</p>
                  <p className="text-sm text-[#27ae60] dark:text-[#2ecc71]">Total Credits</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <Users className="h-8 w-8 text-[#22c55e]" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-black dark:text-white">{summary.core.length}</p>
                  <p className="text-sm text-[#27ae60] dark:text-[#2ecc71]">Core Subjects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-colors duration-300">
                  <Calendar className="h-8 w-8 text-[#22c55e]" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-black dark:text-white">{summary.labs.length}</p>
                  <p className="text-sm text-[#27ae60] dark:text-[#2ecc71]">Lab Courses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="text-lg font-semibold text-[#27ae60] dark:text-[#2ecc71] mb-4">
                Credit Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={creditChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {creditChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="text-lg font-semibold text-[#27ae60] dark:text-[#2ecc71] mb-4">
                Subject Type Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === 'subjects' && currentSemester && (
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-[#27ae60] dark:text-[#2ecc71]">
              {currentSemester.semester} - Subject Details
            </h4>
            <button className="btn-primary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Course Title</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">L</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">T</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">P</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Credits</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentSemester.subjects.map((subject, index) => (
                  <tr key={index} className="table-row">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#22c55e]">{subject.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{subject.title}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white">{subject.L}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white">{subject.T}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white">{subject.P}</td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900 dark:text-white">{subject.credits}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        subject.type === 'core' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20' :
                        subject.type === 'elective' ? 'bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20' :
                        subject.type === 'lab' ? 'bg-[#15803d]/10 text-[#15803d] border border-[#15803d]/20' :
                        subject.type === 'project' ? 'bg-[#166534]/10 text-[#166534] border border-[#166534]/20' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {subject.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Credits: {currentSemester.totalCredits}
            </p>
          </div>
        </div>
      )}

      {/* Timetable Generator Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-[#27ae60] dark:text-[#2ecc71]">
                Generate Timetable for {syllabusData[selectedSemester]?.semester}
              </h4>
              <button onClick={generateTimetable} className="btn-primary">
                Generate Timetable
              </button>
            </div>
            
            {generatedTimetable && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#22c55e] to-[#16a34a]">
                      <th className="p-4 text-left text-white font-semibold border-r border-[#16a34a]">Day / Time</th>
                      {timeSlots.map((slot, index) => (
                        <th key={index} className="p-4 text-center text-white font-semibold border-r border-[#16a34a]">
                          {slot.time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map(day => (
                      <tr key={day} className="border-b border-[#22c55e]/20">
                        <td className="p-4 font-semibold text-black dark:text-white bg-[#22c55e]/10">
                          {day}
                        </td>
                        {timeSlots.map((slot, slotIndex) => (
                          <td key={slotIndex} className="p-2 border-r border-[#22c55e]/20">
                            {slot.period === "LUNCH" ? (
                              <div className="bg-[#22c55e]/20 p-3 rounded text-center text-[#27ae60] font-medium">
                                LUNCH
                              </div>
                            ) : (
                              <div className="bg-[#22c55e]/10 hover:bg-[#22c55e]/20 p-3 rounded text-center min-h-[60px] flex flex-col justify-center transition-colors duration-200">
                                <div className="text-xs font-semibold text-[#27ae60]">
                                  Sample Subject
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Study Plan Tab */}
      {activeTab === 'study-plan' && currentSemester && (
        <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-[#27ae60] dark:text-[#2ecc71] mb-6">
            Study Plan - {currentSemester.semester}
          </h4>
          
          <div className="space-y-6">
            {['core', 'elective', 'lab', 'project'].map(type => {
              const subjects = currentSemester.subjects.filter(s => s.type === type);
              if (subjects.length === 0) return null;
              
              return (
                <div key={type} className="border border-[#22c55e]/30 rounded-lg p-4 bg-[#22c55e]/5">
                  <h5 className="text-md font-semibold text-[#27ae60] dark:text-[#2ecc71] mb-3 capitalize">
                    {type} Subjects ({subjects.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject, index) => (
                      <div key={index} className="bg-white dark:bg-black border border-[#22c55e]/20 p-3 rounded hover:shadow-md transition-shadow duration-200">
                        <div className="font-medium text-black dark:text-white">{subject.title}</div>
                        <div className="text-sm text-[#22c55e]">{subject.code}</div>
                        <div className="text-xs text-[#27ae60] dark:text-[#2ecc71] mt-1">
                          L:{subject.L} T:{subject.T} P:{subject.P} | {subject.credits} Credits
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusManager;