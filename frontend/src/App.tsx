import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import { AuthProvider } from '../src/components/Common/Auth.Service'; // Make sure to import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [count, setCount] = useState<number>(4);

  return (
    <Router>
      <AuthProvider>  {/* Wrap your entire app inside AuthProvider */}
      <HomePage count={count} setCount={setCount} />
    </AuthProvider>
    </Router>
    
  );
}

export default App;
