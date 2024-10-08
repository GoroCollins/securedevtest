import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../HomePage";
import Shoes from "../Shoes/Shoes";
import ShoeDetail from "../Shoes/ShoeDetail";
import AddShoe from "../Shoes/AddShoe";
import EditShoe from "../Shoes/EditShoe";
import AddCategory from "../Categories/AddCategory";
import EditCategory from "../Categories/EditCategory";
import Categories from "../Categories/Categories";
import CategoryDetails from "../Categories/CategoryDetails";
import Contact from "../Contact";
import Login from "./Login";
//import Logout from "./Logout";
import { ProtectedRoute } from "./ProtectedRoutes";
import { AuthProvider } from "./Auth.Service";
import UserProfile from "./UserProfile";

const RoutesConfig: React.FC = () => {
  const [count, setCount] = useState(0);  // State to manage the count of shoes

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/shoes" element={<Shoes count={count} setCount={setCount} />} /> {/* Pass count and setCount */}
        <Route path="/shoe/:id" element={<ShoeDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} /> */}
        <Route path="/add-shoe" element={<ProtectedRoute><AddShoe /></ProtectedRoute>} />
        <Route path="/edit-shoe/:id" element={<ProtectedRoute><EditShoe /></ProtectedRoute>} />
        <Route path="/add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
        <Route path="/edit-category/:id" element={<ProtectedRoute><EditCategory /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/category/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default RoutesConfig;
