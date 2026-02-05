import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Users, UserCheck, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your courses, assignments, and academic records',
      icon: GraduationCap,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      lightText: 'text-blue-600',
      darkText: 'dark:text-blue-400'
    },
    {
      id: 'faculty',
      title: 'Faculty',
      description: 'Manage classes, students, and course materials',
      icon: UserCheck,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      lightText: 'text-green-600',
      darkText: 'dark:text-green-400'
    },
    {
      id: 'parent',
      title: 'Parent',
      description: 'Monitor your child\'s progress and activities',
      icon: Users,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      lightText: 'text-purple-600',
      darkText: 'dark:text-purple-400'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/login/${selectedRole}`);
    }
  };

  const handleAdminLogin = () => {
    navigate('/login/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Student Management System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Select your role to continue with secure authentication
          </p>
          
          {/* Admin Login Link */}
          <div className="flex justify-center">
            <button
              onClick={handleAdminLogin}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center space-x-1"
            >
              <span>Admin Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {role.description}
                </p>

                {/* Selected Badge */}
                {isSelected && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
              ${selectedRole
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <span>Continue to Login</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select your role to ensure secure and appropriate access to the system
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
