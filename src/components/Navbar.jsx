import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, Moon, Sun, LogOut, Search, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('#profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleNotificationClick = () => {
    // Mock notification handling - in real app this would open notifications panel
    setNotificationCount(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock search functionality
      alert(`Searching for: ${searchQuery}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getUserRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'faculty': return 'bg-blue-500';
      case 'student': return 'bg-primary-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="touch-target lg:hidden btn-ghost p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Smart SMS
              </h1>
              <h1 className="sm:hidden text-lg font-bold text-gray-800 dark:text-white">
                SMS
              </h1>
            </div>
          </div>

          {/* Center section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="input-group">
                <Search className="input-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, faculty, classes..."
                  className="input-field has-icon pr-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-black"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile search button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="touch-target md:hidden btn-ghost p-2 rounded-xl"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="touch-target btn-ghost p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500 animate-bounce-in" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 animate-bounce-in" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={handleNotificationClick}
              className="touch-target btn-ghost p-2 rounded-xl relative transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User profile menu */}
            <div className="relative" id="profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="touch-target flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                aria-expanded={showProfileMenu}
                aria-label="User menu"
              >
                <div className="relative">
                  <div className={`w-10 h-10 ${getUserRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                    <span className="text-white font-bold text-sm">
                      {getUserInitials(user?.name || 'User')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getUserRoleColor(user?.role)} rounded-full border-2 border-white dark:border-black flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">
                    {user?.role || 'Role'}
                  </p>
                </div>
                
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 z-60 animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getUserRoleColor(user?.role)} text-white`}>
                      {user?.role || 'Role'}
                    </span>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3">
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3">
                      <Settings className="w-4 h-4" />
                      <span>Preferences</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 animate-slide-in">
          <form onSubmit={handleSearch} className="relative">
            <div className="input-group">
              <Search className="input-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="input-field has-icon"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
