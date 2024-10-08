import React, { useState } from 'react';
import Shoes from './Shoes/Shoes';
import Footer from './Footer';

interface ShoesProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function HomePage() {
  const [count, setCount] = useState<number>(8);
  return (
    <>
      <h1>Welcome to Mobi hand made sandals</h1>
      <br />
      <Shoes count={count} setCount={setCount} />
      <Footer />
      <footer>© {new Date().getFullYear()} SkyLimTech Inc™ All rights reserved.</footer>
    </>
  );
}
