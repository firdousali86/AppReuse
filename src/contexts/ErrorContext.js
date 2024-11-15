import React, { createContext, useState, useContext } from "react";

// Create a Context
const ErrorContext = createContext();

// ErrorProvider Component
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // Set an error
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Clear the current error
  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, handleError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
