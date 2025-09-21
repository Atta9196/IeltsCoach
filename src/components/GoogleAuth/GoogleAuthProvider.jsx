import React, { useEffect } from 'react';

const GoogleAuthProvider = ({ children }) => {
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Load the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular'
          }
        );
      }
    };

    const handleGoogleResponse = (response) => {
      // This will be handled by the AuthContext
      console.log('Google response received:', response);
    };

    // Load Google API script
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleAuth;
        document.head.appendChild(script);
      } else {
        initializeGoogleAuth();
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      {children}
      <div id="google-signin-button" style={{ display: 'none' }}></div>
    </>
  );
};

export default GoogleAuthProvider;
