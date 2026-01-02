import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8083/users");
        setUsersCount(res.data.length);
        setAdminsCount(res.data.filter(u => u.is_admin === 1).length);
      } catch (err) {
        console.log("Dashboard error", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>
      <p style={subtitleStyle}>Control panel overview</p>

      <div style={cardsWrapper}>
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={numberStyle}>{usersCount}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Admins</h3>
          <p style={numberStyle}>{adminsCount}</p>
        </div>
      </div>

      <Link to="/admin/users">
        <button style={buttonStyle}>Manage Users</button>
      </Link>
    </div>
  );
}

export default Dashboard;



const pageStyle = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh"
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "5px"
};

const subtitleStyle = {
  color: "#555",
  marginBottom: "30px"
};

const cardsWrapper = {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  marginBottom: "40px"
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  width: "220px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const numberStyle = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#2c3e50"
};

const buttonStyle = {
  padding: "12px 25px",
  fontSize: "16px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
