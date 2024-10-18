import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './GlobalErrorHandler'; // Import your global error handler
import { ErrorInfo } from 'react';

// Custom error handler function to log the error
const errorHandler = (error: Error, info: ErrorInfo) => {
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Component Stack:', info.componentStack || 'No component stack available');
};

// Render the root with an ErrorBoundary wrapper
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorPage} // Use the ErrorPage as the fallback UI
      onError={errorHandler} // Optional error logging
      onReset={() => (location.href = '/')} // Reset logic to reload the app
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
