import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

// Create a Context
const ErrorContext = createContext();

let errorHandlerRef = { current: null };

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

  useEffect(() => {
    errorHandlerRef.current = { handleError, clearError };
  }, [handleError, clearError]);

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

export const errorHandler = errorHandlerRef;
