import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

// Helper function to determine role based on email
const getDefaultRole = (email) => {
  // Never return 'admin' for any email - admin access is hardcoded only
  if (email.includes('faculty')) return 'faculty';
  if (email.includes('parent')) return 'parent';
  return 'student';
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    // Check for hardcoded admin session first
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const adminUser = JSON.parse(adminSession);
        setUser(adminUser);
        setLoading(false);
        return; // Skip Firebase auth for hardcoded admin
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }

    // Check for saved user in localStorage first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }

    // Set up Firebase auth state listener only if not admin
    const unsubscribe = firebaseService.onAuthStateChanged(async (firebaseUser) => {
      clearTimeout(loadingTimeout); // Clear timeout when auth state changes
      
      if (firebaseUser) {
        // User is logged in with Firebase
        try {
          const result = await firebaseService.getUserByEmail(firebaseUser.email);
          if (result.success && result.user) {
            const userData = result.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.removeItem('pendingLogin'); // Clear pending login flag
          } else {
            console.log('User data not found in Firestore, creating demo user for:', firebaseUser.email);
            // Create demo user in Firestore if not exists
            const demoUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: getDefaultRole(firebaseUser.email),
              institute: 'default',
              createdAt: new Date(),
              lastLogin: new Date(),
              isActive: true,
              phone: '',
              gender: '',
              age: '',
              address: '',
              branch: '',
              year: '',
              designation: '',
              subjects: [],
              childId: ''
            };
            
            // Try to create the demo user in Firestore
            try {
              await firebaseService.createUserDocument(demoUser);
              setUser({ id: demoUser.uid, ...demoUser });
              localStorage.setItem('user', JSON.stringify({ id: demoUser.uid, ...demoUser }));
              localStorage.removeItem('pendingLogin'); // Clear pending login flag
            } catch (createError) {
              console.error('Failed to create demo user:', createError);
              // Fallback to Firebase user data
              const fallbackUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                role: getDefaultRole(firebaseUser.email),
                institute: 'default',
                isActive: true
              };
              setUser(fallbackUser);
              localStorage.setItem('user', JSON.stringify(fallbackUser));
              localStorage.removeItem('pendingLogin'); // Clear pending login flag
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic Firebase user data
          const fallbackUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'student', // Default role
            institute: 'default',
            isActive: true
          };
          setUser(fallbackUser);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          localStorage.removeItem('pendingLogin'); // Clear pending login flag
        }
      } else {
        // User is logged out
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('pendingLogin'); // Clear pending login flag
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Start backend processing immediately
      const result = await firebaseService.signIn(email, password);
      
      if (result.success) {
        // Set user state immediately for instant UI response
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Trigger dashboard loading animation immediately
        setDashboardLoading(true);
        
        // Run backend processing in background with minimal delay
        setTimeout(() => {
          firebaseService.getUserByEmail(email).then(async (userResult) => {
            if (userResult.success && userResult.user) {
              // Update with complete backend data
              setUser(userResult.user);
              localStorage.setItem('user', JSON.stringify(userResult.user));
            } else {
              // Create backend user if not exists
              const backendUser = {
                uid: result.user.id,
                email: email,
                displayName: result.user.name,
                role: getDefaultRole(email),
                institute: 'default',
                createdAt: new Date(),
                lastLogin: new Date(),
                isActive: true,
                phone: '',
                gender: '',
                age: '',
                address: '',
                branch: '',
                year: '',
                designation: '',
                subjects: [],
                childId: ''
              };
              
              try {
                await firebaseService.createUserDocument(backendUser);
                const completeUser = { id: backendUser.uid, ...backendUser };
                setUser(completeUser);
                localStorage.setItem('user', JSON.stringify(completeUser));
              } catch (createError) {
                console.error('Backend user creation failed:', createError);
              }
            }
            // Stop dashboard loading faster - after 300ms instead of 500ms
            setTimeout(() => setDashboardLoading(false), 300);
          }).catch(error => {
            console.error('Backend processing error:', error);
            setTimeout(() => setDashboardLoading(false), 300);
          });
        }, 50); // Reduced from 100ms to 50ms for faster response
        
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      // Set loading to false immediately - let dashboard handle loading animation
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      const result = await firebaseService.signUp(userData);
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear Firebase session if exists
      const result = await firebaseService.signOut();
      
      // Clear all local state
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('adminSession'); // Clear admin session
      localStorage.removeItem('pendingLogin');
      
      if (!result.success) {
        console.error('Firebase logout error:', result.error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear all local state even if Firebase fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('adminSession'); // Clear admin session
      localStorage.removeItem('pendingLogin');
      return { success: true }; // Return success so UI still redirects
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      const result = await firebaseService.updateUserProfile(user.id, updates);
      
      if (result.success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  const getUserActivity = async () => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      return await firebaseService.getUserActivity(user.id);
    } catch (error) {
      console.error('Get activity error:', error);
      return { success: false, error: 'Failed to fetch user activity' };
    }
  };

  const resetPassword = async (email) => {
    try {
      return await firebaseService.resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  };

  const value = {
    user,
    login,
    signUp,
    logout,
    updateProfile,
    getUserActivity,
    resetPassword,
    loading,
    dashboardLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};