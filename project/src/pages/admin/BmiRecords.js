import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";

function BmiRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/bmi_records`);
        setRecords(res.data);
      } catch (err) {
        console.log("BMI Records error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>BMI Records</h1>
      <p style={subtitleStyle}>All BMI results saved in the database</p>

      <Link to="/admin">
        <button style={buttonStyle}>Back to Dashboard</button>
      </Link>

      {loading ? (
        <p style={{ marginTop: "30px" }}>Loading...</p>
      ) : records.length === 0 ? (
        <p style={{ marginTop: "30px" }}>No BMI records found.</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Height</th>
                <th style={thStyle}>BMI</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.full_name}</td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={tdStyle}>{r.weight} kg</td>
                  <td style={tdStyle}>{r.height} cm</td>
                  <td style={tdStyle}>{r.bmi_value}</td>
                  <td style={tdStyle}>
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BmiRecords;

// Styles
const pageStyle = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "5px",
};

const subtitleStyle = {
  color: "#555",
  marginBottom: "20px",
};

const buttonStyle = {
  padding: "12px 20px",
  fontSize: "14px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginBottom: "25px",
};

const tableWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const tableStyle = {
  width: "95%",
  maxWidth: "1100px",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};


const thStyle = {
  padding: "15px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #eee",
  textAlign: "left",
};
