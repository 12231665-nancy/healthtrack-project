import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon.png";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const handleLogout = () => {
    setUser(null);      
    navigate("/login");  
  };
    return (
        <nav className ="navbar">
            <Link to ="/" className="logo">
            <img src={logo} alt="HealthTrack logo" />
            </Link>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/features">Features</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/bmicalculator">BmiCalculator</Link>
                
                {user && (
                 <span onClick={handleLogout} className="logout">
                  Logout
                   </span>
                  )}


            </div>
        </nav>
    );
}
export default Navbar;