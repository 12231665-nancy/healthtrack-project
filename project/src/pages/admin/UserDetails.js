import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function UserDetails() { 
    const { id } = useParams(); 
    const [user, setUser] = useState(null);
    const [bmis, setBmis] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                console.log("Fetching details for user ID:", id);
                
                
                const resUser = await axios.get(`http://localhost:8083/users/${id}`);
                console.log("User data:", resUser.data);
                setUser(resUser.data[0]);

                
                const resBmi = await axios.get(`http://localhost:8083/bmi_records`);
                console.log("All BMI records:", resBmi.data);
                const userBmis = resBmi.data.filter(b => b.user_id === Number(id));
                console.log("Filtered BMI for user:", userBmis);
                setBmis(userBmis);

                console.log("Trying to fetch messages...");

                
                try {
                    const resMsg = await axios.get(`http://localhost:8083/messages/user/${id}`);
                    console.log("Messages from new endpoint:", resMsg.data);
                    setMessages(resMsg.data);
                } catch (msgErr) {
                    console.log("New endpoint failed, trying /contacts...");
                    
                    
                    const resContacts = await axios.get(`http://localhost:8083/contacts`);
                    console.log("All contacts:", resContacts.data);
                    const userContacts = resContacts.data.filter(m => m.user_id === Number(id));
                    console.log("Filtered contacts for user:", userContacts);
                    setMessages(userContacts);
                }
                
            } catch (err) {
                console.log("Error fetching user details", err);
            }
        };
        
        fetchUserDetails();
    }, [id]);

    if (!user) return <p>Loading user details...</p>;

    return (
  <div style={pageStyle}>
    <div style={cardStyle}>

      <h2 style={titleStyle}>User Details</h2>

      
      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Basic Information</h3>
        <p><strong>Name:</strong> {user.full_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Role:</strong>{" "}
          <span style={user.is_admin ? adminBadge : userBadge}>
            {user.is_admin ? "Admin" : "User"}
          </span>
        </p>
      </div>

      
      <div style={sectionStyle}>
        <h3 style={sectionTitle}>BMI Records</h3>
        {bmis.length === 0 ? (
          <p style={emptyText}>No BMI records found</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>BMI</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bmis.map(b => (
                <tr key={b.id}>
                  <td>{b.weight}</td>
                  <td>{b.height}</td>
                  <td>{b.bmi_value}</td>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      
      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Messages</h3>
        {messages.length === 0 ? (
          <p style={emptyText}>No messages found</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td>{m.subject}</td>
                  <td>{m.message}</td>
                  <td>
                    {m.created_at
                      ? new Date(m.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link to="/admin/users">
        <button style={backBtn}>← Back to Users</button>
      </Link>

    </div>
  </div>
);

}

export default UserDetails;

const pageStyle = {
  backgroundColor: "#f2f4f8",
  minHeight: "100vh",
  padding: "40px"
};

const cardStyle = {
  maxWidth: "1100px",
  margin: "auto",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#2d9cdb"
};

const sectionStyle = {
  marginBottom: "30px"
};

const sectionTitle = {
  borderBottom: "2px solid #2d9cdb",
  paddingBottom: "5px",
  marginBottom: "15px",
  color: "#333"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const emptyText = {
  color: "#777",
  fontStyle: "italic"
};

const adminBadge = {
  padding: "4px 10px",
  backgroundColor: "#27ae60",
  color: "#fff",
  borderRadius: "20px",
  fontSize: "14px"
};

const userBadge = {
  padding: "4px 10px",
  backgroundColor: "#7f8c8d",
  color: "#fff",
  borderRadius: "20px",
  fontSize: "14px"
};

const backBtn = {
  padding: "10px 20px",
  backgroundColor: "#2d9cdb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
