import React from 'react';
import { Loader } from 'lucide-react';

const LoadingOverlay = ({ 
  isLoading, 
  message = 'Loading...', 
  transparent = false,
  size = 'md' // sm, md, lg
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = transparent 
    ? 'fixed inset-0 bg-black/30 backdrop-blur-sm z-50'
    : 'fixed inset-0 bg-black/50 backdrop-blur-md z-50';

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          {/* Loading spinner */}
          <div className="relative">
            <div className={`${sizeClasses[size]} border-4 border-white/20 rounded-full`}></div>
            <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-white rounded-full border-t-transparent animate-spin`}></div>
          </div>
          
          {/* Loading message */}
          <div className="space-y-2">
            <p className="text-white font-medium animate-pulse">
              {message}
            </p>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
