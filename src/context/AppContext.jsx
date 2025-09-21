import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    theme: 'light',
    language: 'en',
    progress: {
      reading: 0,
      writing: 0,
      listening: 0,
      speaking: 0
    }
  });

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setProgress = (progress) => {
    dispatch({ type: 'SET_PROGRESS', payload: progress });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setTheme,
      setLanguage,
      setProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

