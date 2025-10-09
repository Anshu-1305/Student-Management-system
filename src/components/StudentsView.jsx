import { ArrowLeft } from 'lucide-react';
import MyStudents from './MyStudents';

const StudentsView = ({ onBack }) => {
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Students</h1>
        </div>
      </div>
      
      <div className="p-6">
        <MyStudents />
        {/* Exams Update Button and Subsections */}
        <div className="mt-8">
          <button className="bg-[#22c55e] text-white px-6 py-3 rounded-xl shadow-lg font-semibold flex items-center mb-4 transition-all duration-300 hover:bg-[#16a34a]">
            Exams Update
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mid Exam Section */}
            <div className="bg-white border border-[#22c55e] rounded-xl p-4 shadow-md">
              <h4 className="text-lg font-bold text-[#22c55e] mb-2">Mid Exam</h4>
              <p className="text-gray-700">View and manage mid exam details for students.</p>
            </div>
            {/* Semester Exam Section */}
            <div className="bg-white border border-[#22c55e] rounded-xl p-4 shadow-md">
              <h4 className="text-lg font-bold text-[#22c55e] mb-2">Semester Exam</h4>
              <p className="text-gray-700">View and manage semester exam details for students.</p>
            </div>
            {/* Assignments Section (Editable for Admin/Faculty) */}
            <div className="bg-white border border-[#22c55e] rounded-xl p-4 shadow-md">
              <h4 className="text-lg font-bold text-[#22c55e] mb-2">Assignments</h4>
              <p className="text-gray-700 mb-2">Edit and manage assignments. Only Admins and Faculty can modify.</p>
              {/* Assignment Management UI (simplified) */}
              <button className="bg-[#22c55e] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-[#16a34a] transition-all duration-300">Edit Assignments</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsView;