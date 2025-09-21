import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'FORGOT_PASSWORD_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        forgotPasswordSuccess: true
      };
    case 'FORGOT_PASSWORD_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        forgotPasswordSuccess: false
      };
    case 'RESET_PASSWORD_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        resetPasswordSuccess: true
      };
    case 'RESET_PASSWORD_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        resetPasswordSuccess: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'CLEAR_FORGOT_PASSWORD_SUCCESS':
      return {
        ...state,
        forgotPasswordSuccess: false
      };
    case 'CLEAR_RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        resetPasswordSuccess: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message || 'Login failed' });
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error. Please try again.' });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        dispatch({ type: 'REGISTER_SUCCESS', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'REGISTER_FAILURE', payload: data.message || 'Registration failed' });
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: 'Network error. Please try again.' });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const googleLogin = async () => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Initialize Google OAuth
      const googleAuth = window.google?.auth2?.getAuthInstance();
      
      if (!googleAuth) {
        throw new Error('Google Auth not initialized');
      }

      const googleUser = await googleAuth.signIn();
      const idToken = googleUser.getAuthResponse().id_token;

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message || 'Google login failed' });
        return { success: false, error: data.message || 'Google login failed' };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Google login failed. Please try again.' });
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  };

  const forgotPassword = async (email) => {
    dispatch({ type: 'FORGOT_PASSWORD_START' });
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'FORGOT_PASSWORD_SUCCESS' });
        return { success: true };
      } else {
        dispatch({ type: 'FORGOT_PASSWORD_FAILURE', payload: data.message || 'Failed to send reset email' });
        return { success: false, error: data.message || 'Failed to send reset email' };
      }
    } catch (error) {
      dispatch({ type: 'FORGOT_PASSWORD_FAILURE', payload: 'Network error. Please try again.' });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (resetData) => {
    dispatch({ type: 'RESET_PASSWORD_START' });
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
        return { success: true };
      } else {
        dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: data.message || 'Password reset failed' });
        return { success: false, error: data.message || 'Password reset failed' };
      }
    } catch (error) {
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: 'Network error. Please try again.' });
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearForgotPasswordSuccess = () => {
    dispatch({ type: 'CLEAR_FORGOT_PASSWORD_SUCCESS' });
  };

  const clearResetPasswordSuccess = () => {
    dispatch({ type: 'CLEAR_RESET_PASSWORD_SUCCESS' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      googleLogin,
      forgotPassword,
      resetPassword,
      logout,
      clearError,
      clearForgotPasswordSuccess,
      clearResetPasswordSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

