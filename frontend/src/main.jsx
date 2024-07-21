import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './GlobalErrorHandler.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorPage} onReset={() => (location.href = '/')}>
    <App />
    </ErrorBoundary>
    
  </React.StrictMode>,
)
