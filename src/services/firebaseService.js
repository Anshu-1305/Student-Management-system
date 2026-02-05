import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.db = db;
  }

  // Sign up new user
  async signUp(userData) {
    try {
      // Check if online first
      if (!navigator.onLine) {
        return {
          success: false,
          error: 'You are currently offline. Please check your internet connection and try again.'
        };
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser.success) {
        return {
          success: false,
          error: 'An account with this email already exists.'
        };
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      // Determine role based on email or explicit role selection
      const userRole = userData.role || this.getDefaultRole(userData.email);

      // Create complete user document
      const completeUser = {
        uid: user.uid,
        email: userData.email,
        displayName: userData.name || userData.displayName || userData.email.split('@')[0],
        role: userRole, // Store the determined role
        institute: userData.institute || 'default',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        phone: userData.phone || '',
        gender: userData.gender || '',
        age: userData.age || '',
        address: userData.address || '',
        branch: userData.branch || '',
        year: userData.year || '',
        designation: userData.designation || '',
        subjects: userData.subjects || [],
        childId: userData.childId || ''
      };

      // Save to Firestore
      await this.createUserDocument(completeUser);

      // Log signup activity
      await this.logActivity(user.uid, 'signup', {
        timestamp: serverTimestamp(),
        institute: completeUser.institute,
        role: userRole
      });

      // Cache user data locally
      localStorage.setItem('cachedUser_' + user.uid, JSON.stringify(completeUser));

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email,
          name: completeUser.displayName,
          role: userRole,
          institute: completeUser.institute,
          ...completeUser
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code) || 'Signup failed. Please try again.'
      };
    }
  }

  // Sign in existing user - Backend-driven with instant response
  async signIn(email, password) {
    try {
      // Check for hardcoded admin credentials first
      if (email === 'ak1305.anshukumar@gmail.com' && password === 'AdminSMS@PEC') {
        // Return admin user data immediately without Firebase
        const adminUser = {
          id: 'admin-hardcoded',
          email: 'ak1305.anshukumar@gmail.com',
          name: 'Admin User',
          role: 'admin',
          institute: 'PEC',
          isActive: true
        };

        // Store in localStorage for session persistence
        localStorage.setItem('adminSession', JSON.stringify(adminUser));

        return {
          success: true,
          user: adminUser
        };
      }

      // For admin section, only allow hardcoded credentials
      if (email.includes('admin') || email === 'ak1305.anshukumar@gmail.com') {
        return {
          success: false,
          error: 'Invalid admin credentials. Only the hardcoded admin credentials are allowed.'
        };
      }

      // Check if online first for other users
      if (!navigator.onLine) {
        return {
          success: false,
          error: 'You are currently offline. Please check your internet connection and try again.'
        };
      }

      // Authenticate with Firebase for other users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Return instantly with basic user data for immediate UI response
      const instantUserData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || email.split('@')[0],
        role: this.getDefaultRole(email),
        institute: 'default'
      };

      // Start complete backend processing without blocking UI - with minimal delay
      setTimeout(() => {
        this.completeBackendProcessing(user, email, instantUserData).catch(error => {
          console.error('Backend processing error:', error);
        });
      }, 10); // Reduced from default delay to 10ms for instant response

      return {
        success: true,
        user: instantUserData
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if this was an admin login attempt
      if (email.includes('admin') || email === 'ak1305.anshukumar@gmail.com') {
        return {
          success: false,
          error: 'Invalid admin credentials. Only the hardcoded admin credentials are allowed.'
        };
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error.code) || 'Login failed. Please check your credentials and try again.'
      };
    }
  }

  // Helper method to get default role based on email
  getDefaultRole(email) {
    // Never return 'admin' for any email - admin access is hardcoded only
    if (email.includes('faculty')) return 'faculty';
    if (email.includes('parent')) return 'parent';
    return 'student';
  }

  // Check if user is trying to login with wrong role
  async validateUserRole(email, intendedRole) {
    try {
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const storedRole = userDoc.data().role;
        
        // If user exists and roles don't match, reject login
        if (storedRole !== intendedRole) {
          return {
            valid: false,
            error: `This email is registered as a ${storedRole}. Please use the correct login section or contact support.`
          };
        }
      }
      
      return { valid: true };
    } catch (error) {
      console.error('Role validation error:', error);
      return { valid: true }; // Allow login if validation fails
    }
  }

  // Complete backend processing - runs silently in background with optimized speed
  async completeBackendProcessing(user, email, basicUserData) {
    try {
      // Step 1: Fetch complete user data from Firestore - with timeout for speed
      let userData;
      try {
        const userDocPromise = getDoc(doc(db, 'users', user.uid));
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 1500) // 1.5 second timeout
        );
        
        const userDoc = await Promise.race([userDocPromise, timeoutPromise]);
        userData = userDoc.data();
      } catch (firestoreError) {
        console.error('Firestore fetch error (continuing with basic data):', firestoreError);
        userData = null; // Continue with basic data if Firestore is slow
      }

      // Step 2: Create user if doesn't exist - optimized
      if (!userData) {
        const completeUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          role: basicUserData.role,
          institute: 'default',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
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
          await this.createUserDocument(completeUser);
          userData = completeUser;
        } catch (createError) {
          console.error('User creation error (non-critical):', createError);
          userData = basicUserData; // Fallback to basic data
        }
      }

      // Step 3: Update last login timestamp - non-blocking
      setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            lastLogin: serverTimestamp()
          });
        } catch (updateError) {
          console.warn('Failed to update last login:', updateError);
        }
      }, 100);

      // Step 4: Log activity for tracking - non-blocking
      setTimeout(async () => {
        try {
          await this.logActivity(user.uid, 'login', {
            timestamp: serverTimestamp(),
            institute: userData.institute
          });
        } catch (logError) {
          console.warn('Failed to log activity:', logError);
        }
      }, 200);

      // Step 5: Cache user data for offline support - non-blocking
      setTimeout(() => {
        try {
          localStorage.setItem('cachedUser_' + user.uid, JSON.stringify(userData));
        } catch (cacheError) {
          console.error('Failed to cache user data:', cacheError);
        }
      }, 50);

      console.log('Backend processing completed for:', email);
    } catch (error) {
      console.error('Complete backend processing failed:', error);
      // Don't throw error - login should still work even if backend processing fails
    }
  }

  // Sign out user
  async signOut() {
    try {
      const user = auth.currentUser;
      if (user) {
        // Log logout activity (non-blocking)
        this.logActivity(user.uid, 'logout', {
          timestamp: serverTimestamp()
        }).catch(error => {
          console.error('Activity logging error:', error);
        });
      }
      
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = firebaseOnAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Log profile update activity
      await this.logActivity(uid, 'profile_update', {
        fields: Object.keys(updates),
        timestamp: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get user activity history
  async getUserActivity(uid) {
    try {
      const activitiesRef = collection(db, 'users', uid, 'activities');
      const q = query(activitiesRef, where('timestamp', '>', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))); // Last 30 days
      const querySnapshot = await getDocs(q);
      
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, activities };
    } catch (error) {
      console.error('Get activity error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Log user activity
  async logActivity(uid, activityType, data) {
    try {
      const activityRef = collection(db, 'users', uid, 'activities');
      await setDoc(doc(activityRef), {
        type: activityType,
        ...data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }

  // Create user document (for demo users)
  async createUserDocument(userData) {
    try {
      const userDoc = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        institute: userData.institute,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: userData.isActive,
        phone: userData.phone || '',
        gender: userData.gender || '',
        age: userData.age || '',
        address: userData.address || '',
        branch: userData.branch || '',
        year: userData.year || '',
        designation: userData.designation || '',
        subjects: userData.subjects || [],
        childId: userData.childId || ''
      };

      await setDoc(doc(db, 'users', userData.uid), userDoc);
      
      // Log activity
      await this.logActivity(userData.uid, 'demo_user_created', {
        role: userData.role,
        institute: userData.institute,
        timestamp: serverTimestamp()
      });

      return { success: true, user: { id: userData.uid, ...userDoc } };
    } catch (error) {
      console.error('Error creating user document:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: 'User not found' };
      }

      const userDoc = querySnapshot.docs[0];
      return {
        success: true,
        user: { id: userDoc.id, ...userDoc.data() }
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/user-disabled': 'User account is disabled',
      'auth/too-many-requests': 'Too many requests, try again later',
      'auth/network-request-failed': 'Network error, check your connection',
      'auth/requires-recent-login': 'Please login again and retry',
      'auth/invalid-credential': 'Invalid email or password. Please check your credentials or use demo accounts below.',
      'auth/invalid-email': 'Invalid email address',
      'auth/user-token-expired': 'Session expired, please login again',
      'auth/invalid-user-token': 'Invalid user token',
      'auth/session-cookie-expired': 'Session expired',
      'auth/session-cookie-revoked': 'Session revoked'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
}

export default new FirebaseService();
