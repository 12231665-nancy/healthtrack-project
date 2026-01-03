import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password does not match");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users`, {
        full_name: fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <h1>Welcome to HealthTrack!</h1>
        <p>Join us today and start tracking your health journey.</p>

        <ul>
          <li>✔ Track your BMI</li>
          <li>✔ Monitor your progress</li>
          <li>✔ Stay motivated and healthy</li>
        </ul>
      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>Sign Up</h2>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button className="register-btn">Create Account</button>
          </form>

          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

