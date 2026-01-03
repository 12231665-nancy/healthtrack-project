import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  

  const fetchUsers = async () => {
   
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.log("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        
      } catch (err) {
        console.log("Delete failed", err);
      }
    
  };
  const viewUser = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
  <div style={pageStyle}>
    <div style={cardStyle}>

      <h2 style={titleStyle}>Manage Users</h2>

      <table style={tableStyle}>
        <thead>
          <tr style={headerRow}>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id} style={rowStyle}>
              <td>{user.id}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>
                <span style={user.is_admin ? adminBadge : userBadge}>
                  {user.is_admin ? "Admin" : "User"}
                </span>
              </td>
              <td>
                <button
                  style={viewBtn}
                  onClick={() => viewUser(user)}
                >
                  View
                </button>
                <button
                  style={deleteBtn}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  </div>
);

}

export default Users;



const pageStyle = {
  backgroundColor: "#f2f4f8",
  minHeight: "100vh",
  padding: "40px"
};

const cardStyle = {
  maxWidth: "1000px",
  margin: "auto",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "#2d9cdb"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const headerRow = {
  backgroundColor: "#2d9cdb",
  color: "#fff",
  height: "50px",
  textAlign: "left"
};

const rowStyle = {
  borderBottom: "1px solid #eee",
  height: "48px"
};

const adminBadge = {
  backgroundColor: "#27ae60",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "13px"
};

const userBadge = {
  backgroundColor: "#7f8c8d",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "13px"
};

const viewBtn = {
  backgroundColor: "#2d9cdb",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px"
};

const deleteBtn = {
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};
                 