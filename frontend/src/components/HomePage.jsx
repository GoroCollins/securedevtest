import React, { useState } from 'react'
import Shoes from './Shoes/Shoes'
import Footer from './Footer';

export default function HomePage() {
  const [count, setCount] = useState(8);
  return (
    <>
     <h1>Welcome to Mobi hand made sandals</h1>
     <br />
     <Shoes count={count} setCount={setCount}/>
     <Footer />
     <footer>&copy; {new Date().getFullYear()} SkyLimTech Inc&trade; All rights reserved.</footer>
    </>

  )
}