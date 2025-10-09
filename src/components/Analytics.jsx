import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', students: 1200, attendance: 85, performance: 78 },
    { month: 'Feb', students: 1234, attendance: 88, performance: 82 },
    { month: 'Mar', students: 1250, attendance: 92, performance: 85 },
    { month: 'Apr', students: 1280, attendance: 87, performance: 88 },
    { month: 'May', students: 1300, attendance: 90, performance: 90 },
    { month: 'Jun', students: 1320, attendance: 94, performance: 92 }
  ];

  const departmentData = [
    { name: 'Computer Science', students: 450, color: '#3B82F6' },
    { name: 'Mathematics', students: 320, color: '#10B981' },
    { name: 'Physics', students: 280, color: '#F59E0B' },
    { name: 'Chemistry', students: 200, color: '#EF4444' },
    { name: 'Biology', students: 150, color: '#8B5CF6' }
  ];

  const performanceData = [
    { grade: 'A+', count: 120, percentage: 15 },
    { grade: 'A', count: 200, percentage: 25 },
    { grade: 'B+', count: 180, percentage: 22.5 },
    { grade: 'B', count: 150, percentage: 18.75 },
    { grade: 'C+', count: 100, percentage: 12.5 },
    { grade: 'C', count: 50, percentage: 6.25 }
  ];

  const attendanceStats = [
    { range: '90-100%', count: 400, color: '#10B981' },
    { range: '80-89%', count: 350, color: '#F59E0B' },
    { range: '70-79%', count: 200, color: '#EF4444' },
    { range: 'Below 70%', count: 50, color: '#6B7280' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Analytics Dashboard
        </h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="input-field w-auto"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <Users className="h-8 w-8 mr-3" />
            <div>
              <p className="text-2xl font-bold">1,320</p>
              <p className="text-sm opacity-90">Total Students</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 mr-3" />
            <div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-sm opacity-90">Avg Attendance</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 mr-3" />
            <div>
              <p className="text-2xl font-bold">8.6</p>
              <p className="text-sm opacity-90">Avg CGPA</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mr-3" />
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm opacity-90">Active Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Growth */}
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Student Growth & Performance
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Students" />
              <Line type="monotone" dataKey="performance" stroke="#10B981" strokeWidth={2} name="Performance" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Students by Department
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="students"
                label={({name, value}) => `${name}: ${value}`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Grade Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Analysis */}
        <div className="card">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Distribution
          </h4>
          <div className="space-y-4">
            {attendanceStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{stat.range}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                    {stat.count} students
                  </span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: stat.color,
                        width: `${(stat.count / 1000) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Attendance Trends
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#3B82F6" name="Attendance %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;