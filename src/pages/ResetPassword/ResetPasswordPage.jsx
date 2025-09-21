import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';
import ResetPasswordForm from '../../components/Forms/ResetPasswordForm';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    resetPassword, 
    loading, 
    error, 
    clearError
  } = useFirebaseAuth();
  
  const [token, setToken] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // Redirect to login if no token
      navigate('/login');
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleResetPassword = async (resetData) => {
    const result = await resetPassword(resetData.password);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Password Reset Successful!</h2>
          <p className="text-gray-600">Your password has been updated successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Invalid Reset Link</h2>
          <p className="text-gray-600">The password reset link is invalid or has expired.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            onBackToLogin={handleBackToLogin}
            loading={loading}
            error={error}
            token={token}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
