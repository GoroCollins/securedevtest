import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from './components/Common/RoutesConfig';
import NavBar from "./components/Common/Navbar";
import { AuthProvider } from './components/Common/Auth.Service';

function App() {

  return (
    <>
    <AuthProvider>
     <Router>
      <NavBar />
      <RoutesConfig />
    </Router>
    </AuthProvider>
    </>
  )
}

export default App
