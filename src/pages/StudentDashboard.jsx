import { Award, Bell, BookOpen, Calendar, TrendingUp, UserCheck, FileText, Upload, Download, CheckCircle, Clock, AlertCircle, Code, Trophy, Play, Brain, Medal, Star, Plus, MessageCircle, User, Settings, BarChart3 } from 'lucide-react';
import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useBranding } from '../context/BrandingContext';
import { useAuth } from '../context/AuthContext';
import { getCurrentInstitute } from '../utils/instituteConfig';
import DashboardSection from '../components/DashboardSection';

import UploadModal from '../components/UploadModal';
import ReportAnalysis from '../components/ReportAnalysis';

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="card-success bounce-in">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary-500/10 float hover:bg-primary-500/20 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{title}</p>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-sm text-primary-600 dark:text-primary-400">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

const StudentDashboard = ({ showChatOnly, setShowChatOnly }) => {
  const { activeSection } = useDashboard();
  const { branding } = useBranding();
  const { user } = useAuth();
  const currentInstitute = getCurrentInstitute();
  const [uploadModal, setUploadModal] = useState({ isOpen: false, title: '', type: '', maxSize: 10 });
  const [showReportAnalysis, setShowReportAnalysis] = useState(false);

  if (showChatOnly) {
    return (
      <div className="p-6 card">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <p>Chat functionality coming soon...</p>
        <button 
          onClick={() => setShowChatOnly(false)}
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div 
        className={`bg-gradient-to-r ${currentInstitute.branding.gradientFrom} ${currentInstitute.branding.gradientTo} rounded-xl p-6 text-white mb-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={currentInstitute.logo} 
              alt={currentInstitute.name}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
              </div>
              <p className="text-lg opacity-90">Welcome back, {user?.displayName || user?.name || 'Student'}!</p>
              <p className="text-white/75 text-sm">{currentInstitute.name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowReportAnalysis(true)}
              className="bg-white/10 border border-white/30 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </button>
          </div>
        </div>
      </div>
      
      <div id="dashboard" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Today is {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats */}
      {/* Quick action buttons - clicking changes active section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={TrendingUp}
          title="Overall GPA"
          value="8.9"
          subtitle="Excellent"
        />
        <StatCard
          icon={UserCheck}
          title="Attendance"
          value="92%"
          subtitle="Good standing"
        />
        <StatCard
          icon={BookOpen}
          title="Subjects"
          value="6"
          subtitle="This semester"
        />
        <StatCard
          icon={Award}
          title="Rank"
          value="#5"
          subtitle="In class"
        />
      </div>



      {/* Dashboard Sections with Animations */}
      <DashboardSection isActive={activeSection === 'dashboard'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Timetable</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Data Structures</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Prof. Sumalatha</p>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">9:00 AM</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Semester 4</p>
                  <p className="text-sm text-green-600 dark:text-green-400">SGPA: 8.8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'notifications'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Assignment Submission</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Software Engineering project due by Jan 25th</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'timetable'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Timetable & Attendance</h3>
          
          {/* Timetable Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Timetable</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Monday - Data Structures</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Prof. Sumalatha • 9:00-10:00 AM • Room: R203</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Present</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-100">Tuesday - Cloud Computing</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Prof. Tukaram • 10:00-11:00 AM • Room: R204</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Present</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-100">Wednesday - Computer Networks</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Prof. Murlidher • 11:15-12:15 PM • Room: R205</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Absent</span>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">92%</p>
                    <p className="text-blue-600 dark:text-blue-400">Overall Attendance</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">87</p>
                    <p className="text-green-600 dark:text-green-400">Classes Attended</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Data Structures</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">34/40 classes • 85% attendance</p>
                </div>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Cloud Computing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">35/38 classes • 92% attendance</p>
                </div>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Computer Networks</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">37/42 classes • 89% attendance</p>
                </div>
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'skills'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills Development Hub</h3>
          <div className="space-y-6">
            {/* Coding Tutorials */}
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Interactive Coding Tutorials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Python Fundamentals</h5>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Learn Python with interactive examples</p>
                  <button 
                    onClick={() => window.open('https://www.codecademy.com/learn/learn-python-3', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />Start Learning
                  </button>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">JavaScript Basics</h5>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">Interactive JavaScript tutorials</p>
                  <button 
                    onClick={() => window.open('https://javascript.info/', '_blank')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />Start Learning
                  </button>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">FreeCodeCamp</h5>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3">Free coding bootcamp with certificates</p>
                  <button 
                    onClick={() => window.open('https://www.freecodecamp.org/', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />Start Learning
                  </button>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Data Structures</h5>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">Visual data structure learning</p>
                  <button 
                    onClick={() => window.open('https://visualgo.net/en', '_blank')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />Start Learning
                  </button>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Algorithms</h5>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-3">Algorithm visualization and practice</p>
                  <button 
                    onClick={() => window.open('https://algorithm-visualizer.org/', '_blank')}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />Start Learning
                  </button>
                </div>
              </div>
            </div>

            {/* Coding Practice */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Coding Practice Platforms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">LeetCode</h5>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-3">Coding interview preparation</p>
                  <button 
                    onClick={() => window.open('https://leetcode.com/', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Practice Now
                  </button>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">HackerRank</h5>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">Programming challenges</p>
                  <button 
                    onClick={() => window.open('https://www.hackerrank.com/', '_blank')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Practice Now
                  </button>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h5 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">CodeChef</h5>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">Competitive programming</p>
                  <button 
                    onClick={() => window.open('https://www.codechef.com/', '_blank')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Practice Now
                  </button>
                </div>
              </div>
            </div>

            {/* Fun Quizzes */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Fun Programming Quizzes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h5 className="font-medium text-pink-900 dark:text-pink-100 mb-2">Programming Logic Quiz</h5>
                  <p className="text-sm text-pink-600 dark:text-pink-400 mb-3">Test your programming logic skills</p>
                  <button 
                    onClick={() => window.open('https://www.w3schools.com/quiztest/', '_blank')}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h5 className="font-medium text-teal-900 dark:text-teal-100 mb-2">CS Fundamentals Quiz</h5>
                  <p className="text-sm text-teal-600 dark:text-teal-400 mb-3">Computer science basics quiz</p>
                  <button 
                    onClick={() => window.open('https://www.geeksforgeeks.org/quiz-corner-gq/', '_blank')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Your Learning Progress</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">15</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tutorials Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">42</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'certificates'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Certificates</h3>
            <button 
              onClick={() => setUploadModal({ isOpen: true, title: 'Upload New Certificate', type: 'Certificate', maxSize: 5 })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />Upload Certificate
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Winner Certificates */}
            <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Winner Certificates
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">1st Place - Coding Competition</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">TechFest 2024 • Uploaded: Feb 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Viewing certificate: 1st Place Coding Competition')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert('Downloading certificate...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">2nd Place - Hackathon</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">CodeSprint 2024 • Uploaded: Jan 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Viewing certificate: 2nd Place Hackathon')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert('Downloading certificate...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Participant Certificates */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-blue-600" />
                Participant Certificates
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Web Development Workshop</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">JNTUH Workshop • Uploaded: March 5, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Viewing certificate: Web Development Workshop')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert('Downloading certificate...')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">AI/ML Seminar</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Tech Conference 2024 • Uploaded: Feb 28, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Viewing certificate: AI/ML Seminar')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert('Downloading certificate...')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Cloud Computing Course</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Online Certification • Uploaded: Jan 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Viewing certificate: Cloud Computing Course')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => alert('Downloading certificate...')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Statistics */}
            <div className="bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-yellow-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Certificate Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Winner Certificates</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participant Certificates</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'reports'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Academic Reports</h3>
          <div className="space-y-6">
            {/* Performance Report */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Academic Performance Report
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">8.9</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Current CGPA</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Class Rank</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Attendance</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Generating academic performance report...')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />Download Report
              </button>
            </div>

            {/* Attendance Report */}
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Attendance Report
              </h4>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-green-900 dark:text-green-100">Data Structures</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">85%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-green-900 dark:text-green-100">Cloud Computing</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-green-900 dark:text-green-100">Computer Networks</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">89%</span>
                </div>
              </div>
              <button 
                onClick={() => alert('Generating attendance report...')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />Download Report
              </button>
            </div>

            {/* Assignment Report */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Assignment & Lab Report
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Assignments Completed</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Lab Works Done</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Generating assignment & lab report...')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />Download Report
              </button>
            </div>

            {/* Overall Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Semester Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">5</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Subjects</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">87</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Classes Attended</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">20</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Assignments</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">5</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'syllabus'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">CSE Syllabus & Course Structure</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">R22 B.Tech CSE Course Structure & Syllabus</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">Complete syllabus for Computer Science Engineering</p>
              </div>
              <a 
                href="https://jntuh.ac.in/uploads/academics/R22B.Tech.CSECourseStructureSyllabus2.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Open PDF
              </a>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">PDF Viewer</h4>
              <div className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <iframe
                  src="https://jntuh.ac.in/uploads/academics/R22B.Tech.CSECourseStructureSyllabus2.pdf"
                  className="w-full h-full"
                  title="CSE Syllabus PDF"
                  frameBorder="0"
                >
                  <p className="p-4 text-gray-600 dark:text-gray-400">
                    Your browser does not support PDFs. 
                    <a 
                      href="https://jntuh.ac.in/uploads/academics/R22B.Tech.CSECourseStructureSyllabus2.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download the PDF
                    </a>
                  </p>
                </iframe>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium text-green-900 dark:text-green-100">Current Semester: 5</h5>
                <p className="text-sm text-green-600 dark:text-green-400">Regulation: R22</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-medium text-purple-900 dark:text-purple-100">Branch: CSE</h5>
                <p className="text-sm text-purple-600 dark:text-purple-400">Computer Science Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'assignments'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assignments - Subject Wise</h3>
          <div className="space-y-4">
            {/* Compiler Design */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Compiler Design</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Assignment 1: Lexical Analyzer</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Due: March 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading Lexical Analyzer assignment PDF...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Download
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit Lexical Analyzer Assignment', type: 'Assignment', maxSize: 5 })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">Assignment 2: Parser Implementation</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Submitted • Grade: A</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Cloud Computing */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Cloud Computing</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Assignment 1: AWS Services Report</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Due: March 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading AWS Services Report assignment...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Download
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit AWS Services Report', type: 'Assignment', maxSize: 10 })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Computer Networks */}
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Computer Networks</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">Assignment 1: Network Protocols</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Overdue: March 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading Network Protocols assignment...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Download
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit Network Protocols Assignment (Late)', type: 'Assignment', maxSize: 5 })}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit Late
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'labwork'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lab Work - Subject Wise</h3>
          <div className="space-y-4">
            {/* Compiler Design Lab */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Compiler Design Lab</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Lab 5: Lex Tool Implementation</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Due: March 18, 2024 • Lab Session: Monday 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading Lex Tool lab manual...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Manual
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit Lex Tool Lab Work', type: 'Lab Work', maxSize: 15 })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">Lab 4: First and Follow Sets</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Completed • Grade: A</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Cloud Computing Lab */}
            <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Cloud Computing Lab</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Lab 3: AWS EC2 Instance Setup</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Due: March 22, 2024 • Lab Session: Wednesday 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading AWS EC2 lab manual...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Manual
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit AWS EC2 Lab Work', type: 'Lab Work', maxSize: 20 })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Computer Networks Lab */}
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Computer Networks Lab</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Lab 4: Socket Programming</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Due: March 16, 2024 • Lab Session: Monday 1:00 PM</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert('Downloading Socket Programming lab manual...')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-1" />Manual
                    </button>
                    <button 
                      onClick={() => setUploadModal({ isOpen: true, title: 'Submit Socket Programming Lab', type: 'Lab Work', maxSize: 10 })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'results'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Report</h3>
          
          {/* Academic Results */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Results</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Semester 4 Results</p>
                  <p className="text-sm text-green-600 dark:text-green-400">SGPA: 8.8 • CGPA: 8.9 • Rank: 5th</p>
                  <p className="text-xs text-green-500 dark:text-green-300 mt-1">Published: March 10, 2024</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                  View Details
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Semester 3 Results</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">SGPA: 8.6 • CGPA: 8.7 • Rank: 7th</p>
                  <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">Published: November 15, 2023</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Mentors */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Mentors</h4>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">Prof. Sumalatha</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Academic Mentor • Data Structures</p>
                      <p className="text-xs text-purple-500 dark:text-purple-300">Available: Mon-Fri 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Opening chat with Prof. Sumalatha...')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />Chat
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">Prof. Tukaram</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">Project Mentor • Cloud Computing</p>
                      <p className="text-xs text-orange-500 dark:text-orange-300">Available: Tue-Thu 2:00 PM - 6:00 PM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Opening chat with Prof. Tukaram...')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />Chat
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-teal-900 dark:text-teal-100">Dr. Murlidher</p>
                      <p className="text-sm text-teal-600 dark:text-teal-400">Career Counselor • Computer Networks</p>
                      <p className="text-xs text-teal-500 dark:text-teal-300">Available: Wed-Fri 11:00 AM - 3:00 PM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Opening chat with Dr. Murlidher...')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'reports'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Reports</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Track your academic progress</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Generate Report</button>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'virtual'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Virtual Classroom</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Join online classes and sessions</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Join Session</button>
        </div>
      </DashboardSection>

      <DashboardSection isActive={activeSection === 'profile'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">A</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Anshu Kumar</p>
              <p className="text-gray-600 dark:text-gray-400">226F1A05A4 - CSE-B</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowReportAnalysis(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </button>
          </div>
        </div>
      </DashboardSection>

      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ ...uploadModal, isOpen: false })}
        title={uploadModal.title}
        type={uploadModal.type}
        maxSizeMB={uploadModal.maxSize}
      />
      
      <ReportAnalysis
        isOpen={showReportAnalysis}
        onClose={() => setShowReportAnalysis(false)}
        userRole="student"
      />
    </div>
  );
};

export default StudentDashboard;
