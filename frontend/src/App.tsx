import { useState } from 'react';
import './App.css';
import { AuthProvider } from '../src/components/Common/Auth.Service'; // Make sure to import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './components/Common/RoutesConfig';

function App() {
  const [count, setCount] = useState<number>(4);

  return (
    <Router>
      <AuthProvider>  {/* Wrap your entire app inside AuthProvider */}
      <RoutesConfig />
    </AuthProvider>
    </Router>
    
  );
}

export default App;
