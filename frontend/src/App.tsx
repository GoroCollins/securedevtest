import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import { AuthProvider } from '../src/components/Common/Auth.Service'; // Make sure to import AuthProvider

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <AuthProvider>  {/* Wrap your entire app inside AuthProvider */}
      <HomePage count={count} setCount={setCount} />
    </AuthProvider>
  );
}

export default App;
