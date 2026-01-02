import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const navigate=useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8083/login",{
        email: email,
        password: password

      });
      

      if(res.data.user){
        setUser(res.data.user);
      if(res.data.user.is_admin ===1){
        navigate("/admin");
      }else{
      navigate("/home");
      }
      }
    } catch (err) {
      alert("Login failed");
      console.log(err);
      
    }
  };
  return (
    <div className="login-page">

      
      <div className="login-left">
        <h1>Welcome to HealthTrack</h1>
        <p>Track your health, BMI, and progress easily.</p>
        <ul>
          <li>✔ Calculate your BMI</li>
          <li>✔ Save your health data</li>
          <li>✔ Simple & secure</li>
        </ul>
      </div>

      
      <div className="login-right">
        <div className="login-card">
          <h2>Login to your account</h2>
          <form onSubmit={handleLogin}>
          <input 
          type="email" 
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
           />
          <input 
          type="password" 
          placeholder="Password"
          onChange={(e) =>setPassword(e.target.value)}
          required
           />

          <button className="login-btn">Login now</button>

          </form>

          <p className="login-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
