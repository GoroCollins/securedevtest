import { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <HomePage count={count} setCount={setCount} />
    </>
  );
}

export default App;
