import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: email,
        password: password,
      });

      console.log("Login response:", res.data); // ✅ helpful to see what backend returns

      if (res.data.user) {
        setUser(res.data.user);

        // ✅ safer admin check (works if is_admin is 1, "1", true, etc.)
        if (Boolean(res.data.user.is_admin)) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        alert("No user returned from server");
      }
    } catch (err) {
      console.log("Login error status:", err.response?.status);
      console.log("Login error data:", err.response?.data);
      console.log("Full error:", err);

      alert(err.response?.data?.message || "Login failed");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">
              Login now
            </button>
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
