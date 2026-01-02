import './App.css';
import {BrowserRouter as Router , Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from './pages/Home.js';
import About from'./pages/About.js';
import Contact from './pages/Contact.js';
import Features from './pages/Features.js';
import Navbar from './components/Navbar.js';
import BmiCalculator from './pages/BmiCalculator.js';
import Footer from './components/Footer.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import axios from "axios";
import './styles/responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './pages/admin/Dashboard.js';
import AdminUsers from './pages/admin/Users.js';
import UserDetails from './pages/admin/UserDetails';



function App() {
     const [user, setUser] = useState(null);

  useEffect(() => {
      const fetchUser = async () => {
       
      try {
        const res = await axios.get("http://localhost:8083/currentUser");
        setUser(res.data.user || null);
      } catch (err) {
        console.log("No user logged in yet");
        setUser(null);
      }
    };
    fetchUser();

  }, []);

  return (
    <Router>
      {user && <Navbar  user={user} setUser={setUser}/>}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />}  />

        <Route path="/home" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute user={user}><About /></ProtectedRoute>} />
        <Route path="/features" element={<ProtectedRoute user={user}><Features /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute user={user}><Contact user={user} /></ProtectedRoute>} />
        <Route path="/bmicalculator" element={<ProtectedRoute user={user}><BmiCalculator user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={user?.is_admin ? <AdminDashboard /> : <Navigate to="/home" />}/>
        <Route path="/admin/users" element={user?.is_admin ? <AdminUsers /> : <Navigate to="/home" />}/>
        <Route path="/admin/users/:id" element={user?.is_admin ? <UserDetails /> : <Navigate to="/home" />} />
        
      </Routes>
      {user &&<Footer />}
    </Router>
  );
}

export default App;
