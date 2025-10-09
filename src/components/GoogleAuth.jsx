import React, { useState, useEffect } from 'react';
import { Calendar, Video, Shield } from 'lucide-react';

const GoogleAuth = ({ onAuthSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('google_access_token');
    if (token) {
      setIsAuthenticated(true);
      onAuthSuccess && onAuthSuccess(token);
    }
  }, []);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Simulate OAuth2.0 flow - In production, use Google OAuth2.0
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem('google_access_token', mockToken);
      localStorage.setItem('google_refresh_token', `refresh_${mockToken}`);
      
      setIsAuthenticated(true);
      onAuthSuccess && onAuthSuccess(mockToken);
      
      alert('Google Calendar connected successfully!');
    } catch (error) {
      alert('Failed to connect Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-[#22c55e] mr-2" />
          <span className="text-sm text-[#27ae60]">Google Calendar Connected</span>
        </div>
        <button onClick={handleDisconnect} className="text-xs text-red-600 hover:text-red-800">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-4">
      <div className="text-center">
        <Calendar className="h-8 w-8 text-[#22c55e] mx-auto mb-2" />
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Connect Google Calendar
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Required to create Google Meet links and sync schedules
        </p>
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="btn-primary w-full text-sm py-2"
        >
          {loading ? 'Connecting...' : 'Connect Google Calendar'}
        </button>
      </div>
    </div>
  );
};

export default GoogleAuth;