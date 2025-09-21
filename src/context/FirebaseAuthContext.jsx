import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { firebaseAuth, formatFirebaseUser } from '../firebase/auth';
import { userService } from '../firebase/firestore';

const FirebaseAuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const FirebaseAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userResult = await userService.getUser(firebaseUser.uid);
          const userData = userResult.success ? userResult.data : null;
          
          // Format user data
          const formattedUser = {
            ...formatFirebaseUser(firebaseUser),
            ...userData
          };
          
          dispatch({ type: 'AUTH_SUCCESS', payload: formattedUser });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Still set user as authenticated even if Firestore data fails
          dispatch({ type: 'AUTH_SUCCESS', payload: formatFirebaseUser(firebaseUser) });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { email, password, ...additionalData } = userData;
      
      // Create user with Firebase Auth
      const authResult = await firebaseAuth.signUp(email, password, additionalData);
      
      if (authResult.success) {
        // Create user document in Firestore
        const userDocResult = await userService.createUser(authResult.user.uid, {
          firstName: additionalData.firstName,
          lastName: additionalData.lastName,
          phone: additionalData.phone,
          dateOfBirth: additionalData.dateOfBirth,
          country: additionalData.country,
          ieltsLevel: additionalData.ieltsLevel,
          email: email
        });
        
        if (userDocResult.success) {
          return { success: true };
        } else {
          return { success: false, error: userDocResult.error };
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: authResult.error });
        return { success: false, error: authResult.error };
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { email, password } = credentials;
      const result = await firebaseAuth.signIn(email, password);
      
      if (result.success) {
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async () => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await firebaseAuth.signInWithGoogle();
      
      if (result.success) {
        // Check if user document exists, create if not
        const userResult = await userService.getUser(result.user.uid);
        if (!userResult.success) {
          // Create user document for Google sign-in
          await userService.createUser(result.user.uid, {
            firstName: result.user.displayName?.split(' ')[0] || '',
            lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
            email: result.user.email,
            photoURL: result.user.photoURL,
            provider: 'google'
          });
        }
        
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await firebaseAuth.sendPasswordReset(email);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (newPassword) => {
    try {
      const result = await firebaseAuth.updatePassword(newPassword);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const result = await firebaseAuth.signOut();
      if (result.success) {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updateData) => {
    try {
      if (!state.user?.uid) {
        return { success: false, error: 'No user logged in' };
      }
      
      const result = await userService.updateUser(state.user.uid, updateData);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <FirebaseAuthContext.Provider value={{
      ...state,
      register,
      login,
      googleLogin,
      forgotPassword,
      resetPassword,
      logout,
      updateProfile,
      clearError
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
