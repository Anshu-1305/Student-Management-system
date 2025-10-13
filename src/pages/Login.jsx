import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, GraduationCap, Loader, Lock, Mail, Moon, Sun, User, UserCog, Users, Building } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllInstitutes, setCurrentInstitute, applyInstituteTheme } from '../utils/instituteConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    institute: 'jntuh',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Set selected institute
      setCurrentInstitute(formData.institute);
      applyInstituteTheme(formData.institute);
      
      // Mock authentication - in real app, this would call an API
      const mockUser = {
        id: formData.role === 'admin' ? 1 : formData.role === 'faculty' ? 2 : 36,
        name: formData.role === 'admin' ? 'Admin User' : 
              formData.role === 'faculty' ? 'Sumalatha' : 
              formData.role === 'parent' ? 'Parent User' : 'Anshu Kumar',
        email: formData.email,
        role: formData.role,
        instituteId: formData.institute
      };
      
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      login(mockUser);
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
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
            <div className="card-elevated space-y-6">
              {/* Institute selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Institute
                </label>
                <div className="space-y-2">
                  {getAllInstitutes().map((institute) => (
                    <label
                      key={institute.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.institute === institute.id
                          ? `${institute.branding.bgColor} ${institute.branding.textColor} ${institute.branding.borderColor}`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="institute"
                        value={institute.id}
                        checked={formData.institute === institute.id}
                        onChange={(e) => {
                          handleChange(e);
                          applyInstituteTheme(e.target.value);
                        }}
                        className="sr-only"
                      />
                      <Building className={`h-5 w-5 mr-3 ${formData.institute === institute.id ? 'scale-110' : ''} transition-transform duration-200`} />
                      <div className="flex-1">
                        <p className="font-medium">{institute.name}</p>
                        <p className="text-sm opacity-75">{institute.shortName} • {institute.type}</p>
                        <p className="text-xs opacity-60">{institute.tagline}</p>
                      </div>
                    </label>
                  ))}
                </div>
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
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-field has-icon ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
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
                disabled={isLoading}
                className={`w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-3 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
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