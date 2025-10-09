import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ModernTimetable from './ModernTimetable';

const TimetableView = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 mr-3"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Timetable</h1>
        </div>
      </div>
      
      <div className="p-6">
        <ModernTimetable />
      </div>
    </div>
  );
};

export default TimetableView;