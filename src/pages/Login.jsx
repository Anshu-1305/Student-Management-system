import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, GraduationCap, Loader, Lock, Mail, Moon, Sun, User, UserCog, Users, Building, Phone, Calendar, MapPin, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllInstitutes, setCurrentInstitute, applyInstituteTheme } from '../utils/instituteConfig';
import LoadingOverlay from '../components/LoadingOverlay';
import useNetworkStatus from '../hooks/useNetworkStatus';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'student',
    institute: '',
    branch: '',
    year: '',
    phone: '',
    gender: '',
    age: '',
    address: '',
    rememberMe: false
  });
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowInstituteDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { login, signUp } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isOnline, networkError } = useNetworkStatus();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.institute) {
      newErrors.institute = 'Please select an institute';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Additional validation for signup
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
      
      if (!formData.age) {
        newErrors.age = 'Age is required';
      } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
        newErrors.age = 'Age must be between 16 and 100';
      }
      
      if (formData.role === 'student' && !formData.branch) {
        newErrors.branch = 'Branch is required for students';
      }
      
      if (formData.role === 'student' && !formData.year) {
        newErrors.year = 'Year is required for students';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setErrors({});
    
    try {
      // Set selected institute
      setCurrentInstitute(formData.institute);
      applyInstituteTheme(formData.institute);
      
      let result;
      
      if (isLogin) {
        // For admin role, check hardcoded credentials first
        if (formData.role === 'admin') {
          if (formData.email !== 'ak1305.anshukumar@gmail.com' || formData.password !== 'AdminSMS@PEC') {
            setErrors({ general: 'Invalid admin credentials. Only the hardcoded admin credentials are allowed.' });
            return;
          }
        }
        
        // Login with Firebase (includes role validation)
        result = await login(formData.email, formData.password);
        
        // Check if logged in user role matches selected role
        if (result.success && result.user) {
          if (result.user.role !== formData.role) {
            // Force logout if roles don't match
            await login('logout@temp.com', 'temp'); // This will clear the session
            setErrors({ 
              general: `This email is registered as a ${result.user.role}. Please select the correct role to login.` 
            });
            return;
          }
        }
      } else {
        // Sign up with Firebase
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          institute: formData.institute,
          branch: formData.branch,
          year: formData.year,
          phone: formData.phone,
          gender: formData.gender,
          age: formData.age,
          address: formData.address,
          rememberMe: formData.rememberMe
        };
        result = await signUp(userData);
      }
      
      if (result.success) {
        setShowSuccess(true);
        // Navigation will be handled by the AuthContext and protected routes
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: isLogin ? 'Login failed. Please try again.' : 'Signup failed. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <UserCog className="h-5 w-5" />;
      case 'faculty': return <User className="h-5 w-5" />;
      case 'student': return <GraduationCap className="h-5 w-5" />;
      case 'parent': return <Users className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'faculty': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'student': return 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800';
      case 'parent': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-950 dark:via-black dark:to-primary-950/20 transition-colors duration-500" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-10 btn-ghost p-3 rounded-xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30 dark:border-gray-700/30"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Network status indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-2 rounded-xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30 dark:border-gray-700/30">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">Offline</span>
          </>
        )}
      </div>

      {/* Network error banner */}
      {networkError && (
        <div className="absolute top-20 left-4 right-4 z-10 bg-red-500/90 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-xl p-3 animate-bounce-in">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-5 w-5 text-white" />
            <p className="text-white text-sm font-medium">{networkError}</p>
          </div>
        </div>
      )}

      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-in">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse-slow" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-600 bg-clip-text text-transparent">
              Smart SMS
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Modern Student Management System for the digital age
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { icon: Users, label: 'Students', count: '60+' },
              { icon: UserCog, label: 'Faculty', count: '12+' },
              { icon: GraduationCap, label: 'Classes', count: '8+' }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2 animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-12 h-12 mx-auto bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <stat.icon className="h-6 w-6 text-primary-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.count}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Smart SMS
            </h1>
          </div>

          {/* Form header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Sign in to access your dashboard' : 'Join our educational platform'}
            </p>
          </div>

          {/* Success message */}
          {showSuccess && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 animate-bounce-in">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 font-medium">Login successful! Redirecting...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.general && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-bounce-in">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 font-medium">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
              {/* Institute selection dropdown */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Institute
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowInstituteDropdown(!showInstituteDropdown)}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm border-2 border-white/30 dark:border-white/20 rounded-xl text-left transition-all duration-200 hover:border-white/50 dark:hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 dark:focus:ring-white/10 focus:border-white/60 dark:focus:border-white/40 text-white placeholder-white/70 ${
                      errors.institute ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-white/70" />
                      <span className="text-white">
                        {formData.institute 
                          ? getAllInstitutes().find(inst => inst.id === formData.institute)?.name 
                          : 'Choose your institute'
                        }
                      </span>
                    </div>
                    <div className={`transform transition-transform duration-200 ${
                      showInstituteDropdown ? 'rotate-180' : 'rotate-0'
                    }`}>
                      ▼
                    </div>
                  </button>
                  
                  {showInstituteDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {getAllInstitutes().map((institute) => (
                        <button
                          key={institute.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, institute: institute.id }));
                            applyInstituteTheme(institute.id);
                            setShowInstituteDropdown(false);
                          }}
                          className={`w-full flex items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                            formData.institute === institute.id 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          <Building className="h-5 w-5 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{institute.name}</p>
                            <p className="text-sm opacity-75 truncate">{institute.shortName} • {institute.type}</p>
                            <p className="text-xs opacity-60 truncate">{institute.tagline}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.institute && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.institute}</span>
                  </p>
                )}
              </div>

              {/* Role selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Role
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['student', 'faculty', 'admin', 'parent'].map((role) => (
                    <label
                      key={role}
                      className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.role === role
                          ? getRoleColor(role)
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`mb-2 ${formData.role === role ? 'scale-110' : ''} transition-transform duration-200`}>
                        {getRoleIcon(role)}
                      </div>
                      <span className="text-xs font-medium capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm border-2 border-white/30 dark:border-white/20 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20 dark:focus:ring-white/10 focus:border-white/60 dark:focus:border-white/40 text-white placeholder-white/70 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-field has-icon pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Additional signup fields */}
              {!isLogin && (
                <>
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="input-group">
                      <User className="input-icon" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`input-field has-icon ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <Lock className="input-icon" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className={`input-field has-icon pr-12 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <Phone className="input-icon" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={`input-field has-icon ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                        placeholder="Enter your 10-digit phone number"
                        maxLength="10"
                        required
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Gender and Age fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 ${
                          errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.gender}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Age
                      </label>
                      <div className="input-group">
                        <Calendar className="input-icon" />
                        <input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('age')}
                          onBlur={() => setFocusedField(null)}
                          className={`input-field has-icon ${errors.age ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                          placeholder="Age"
                          min="16"
                          max="100"
                          required
                        />
                      </div>
                      {errors.age && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.age}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Student-specific fields */}
                  {formData.role === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Branch
                        </label>
                        <select
                          id="branch"
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 ${
                            errors.branch ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        >
                          <option value="">Select Branch</option>
                          <option value="CSE">Computer Science</option>
                          <option value="ECE">Electronics</option>
                          <option value="EEE">Electrical</option>
                          <option value="MECH">Mechanical</option>
                          <option value="CIVIL">Civil</option>
                        </select>
                        {errors.branch && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.branch}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Year
                        </label>
                        <select
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-500 ${
                            errors.year ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          required
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                        {errors.year && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.year}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Address field */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Address (Optional)
                    </label>
                    <div className="input-group">
                      <MapPin className="input-icon" />
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField(null)}
                        className="input-field has-icon resize-none"
                        placeholder="Enter your address"
                        rows="2"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full relative py-4 text-lg font-semibold flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-2xl active:shadow-lg bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-600 hover:from-primary-700 hover:via-primary-600 hover:to-emerald-700 text-white shadow-lg backdrop-blur-sm border border-white/20`}
              >
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-50 pointer-events-none"></div>
                
                <div className="relative flex items-center space-x-3">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Toggle form mode */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">Demo Credentials</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white dark:bg-black rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-primary-600 dark:text-primary-400">Student</p>
                <p className="text-gray-600 dark:text-gray-400">student@demo.com</p>
              </div>
              <div className="bg-white dark:bg-black rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-blue-600 dark:text-blue-400">Faculty</p>
                <p className="text-gray-600 dark:text-gray-400">faculty@demo.com</p>
              </div>
              <div className="bg-white dark:bg-black rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-red-600 dark:text-red-400">Admin</p>
                <p className="text-gray-600 dark:text-gray-400">admin@demo.com</p>
              </div>
              <div className="bg-white dark:bg-black rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-purple-600 dark:text-purple-400">Parent</p>
                <p className="text-gray-600 dark:text-gray-400">parent@demo.com</p>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Password: any password (minimum 6 characters)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;