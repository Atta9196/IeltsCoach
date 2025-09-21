import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import LoginForm from '../../components/Forms/LoginForm';
import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { 
    login, 
    googleLogin, 
    forgotPassword, 
    loading, 
    error, 
    isAuthenticated, 
    clearError
  } = useFirebaseAuth();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googleLogin();
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async (email) => {
    await forgotPassword(email);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              onBackToLogin={handleBackToLogin}
              loading={loading}
              error={error}
              success={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to IELTS Coach
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <LoginForm 
            onSubmit={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
            loading={loading}
            error={error}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

