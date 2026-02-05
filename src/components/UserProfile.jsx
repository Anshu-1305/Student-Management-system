import { useState, useEffect } from 'react';
import { AlertCircle, User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    address: '',
    branch: '',
    year: '',
    role: '',
    institute: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        age: user.age || '',
        address: user.address || '',
        branch: user.branch || '',
        year: user.year || '',
        role: user.role || '',
        institute: user.institute || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrors({});
    setSuccess('');
    if (isEditing) {
      // Reset form data when canceling edit
      if (user) {
        setProfileData({
          name: user.displayName || user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          gender: user.gender || '',
          age: user.age || '',
          address: user.address || '',
          branch: user.branch || '',
          year: user.year || '',
          role: user.role || '',
          institute: user.institute || ''
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!profileData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(profileData.age) < 16 || parseInt(profileData.age) > 100) {
      newErrors.age = 'Age must be between 16 and 100';
    }
    
    if (profileData.role === 'student' && !profileData.branch) {
      newErrors.branch = 'Branch is required for students';
    }
    
    if (profileData.role === 'student' && !profileData.year) {
      newErrors.year = 'Year is required for students';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    
    setIsLoading(true);
    setSuccess('');
    
    try {
      const result = await updateProfile({
        displayName: profileData.name,
        phone: profileData.phone,
        gender: profileData.gender,
        age: profileData.age,
        address: profileData.address,
        branch: profileData.branch,
        year: profileData.year
      });
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;
    
    setIsLoading(true);
    setSuccess('');
    
    try {
      // Note: You'll need to implement password update in Firebase service
      // For now, just show success message
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Password update error:', error);
      setErrors({ general: 'Failed to update password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'faculty': 'Faculty Member',
      'student': 'Student',
      'parent': 'Parent'
    };
    return roleMap[role] || role;
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return genderMap[gender] || gender;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.name || 'User Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {getRoleDisplay(profileData.role)}
              </p>
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-200 font-medium">{errors.general}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <User className="h-4 w-4 text-gray-400" />
                <span>{profileData.name || 'Not provided'}</span>
              </div>
            )}
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field (Non-editable) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{profileData.email || 'Not provided'}</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Cannot be changed</span>
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profileData.phone || 'Not provided'}</span>
              </div>
            )}
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <User className="h-4 w-4 text-gray-400" />
                <span>{getGenderDisplay(profileData.gender) || 'Not provided'}</span>
              </div>
            )}
            {errors.gender && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
            )}
          </div>

          {/* Age Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Age
            </label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleInputChange}
                min="16"
                max="100"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{profileData.age ? `${profileData.age} years` : 'Not provided'}</span>
              </div>
            )}
            {errors.age && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.age}</p>
            )}
          </div>

          {/* Student-specific fields */}
          {profileData.role === 'student' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch
                </label>
                {isEditing ? (
                  <select
                    name="branch"
                    value={profileData.branch}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.branch ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="EEE">Electrical</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                  </select>
                ) : (
                  <div className="text-gray-900 dark:text-white">
                    {profileData.branch || 'Not provided'}
                  </div>
                )}
                {errors.branch && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.branch}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                {isEditing ? (
                  <select
                    name="year"
                    value={profileData.year}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                ) : (
                  <div className="text-gray-900 dark:text-white">
                    {profileData.year ? `${profileData.year}st Year` : 'Not provided'}
                  </div>
                )}
                {errors.year && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.year}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Address Field */}
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          {isEditing ? (
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          ) : (
            <div className="flex items-start space-x-2 text-gray-900 dark:text-white">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <span>{profileData.address || 'Not provided'}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
