const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
console.log("HEALTHTRACK SERVER FILE LOADED");

// Crash detectors
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

// CORS
app.use(
  cors({
    origin: "https://healthtrack-project.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Health check routes
app.get("/", (req, res) => res.json("Backend is running"));
app.get("/check", (req, res) => res.json("CHECK OK"));

app.get("/currentUser", (req, res) => {
  return res.json({ user: null });
});

// MySQL Pool Connection (Railway best practice)
const db = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB once at startup
db.query("SELECT 1", (err) => {
  if (err) console.error("DB test failed:", err);
  else console.log("DB connected using MYSQL_URL (pool).");
});

// USERS

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json(data);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(data);
  });
});

// Stores password as received (not hashed)
app.post("/users", (req, res) => {
  const { full_name, email, password } = req.body || {};

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "full_name, email, password are required" });
  }

  const sql = "INSERT INTO users(full_name, email, password) VALUES (?,?,?)";
  db.query(sql, [full_name, email.trim(), password], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "User created", data });
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { full_name, email, password } = req.body || {};
  const sql = "UPDATE users SET full_name= ?, email= ?, password= ? WHERE id = ?";
  db.query(sql, [full_name, email, password, id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "User updated", data });
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "User deleted", data });
  });
});

// LOGIN (crash-proof)

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

  db.query(sql, [email.trim()], async (err, data) => {
    try {
      if (err) {
        console.error("LOGIN SQL ERROR:", err);
        return res.status(500).json({
          message: "Database error during login",
          code: err.code,
          error: err.message,
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = data[0];

      if (!user || !user.password) {
        return res.status(500).json({
          message: "User record is missing password field",
        });
      }

      let isMatch = false;
      const stored = String(user.password);

      const isBcryptHash =
        stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

      if (isBcryptHash) {
        isMatch = await bcrypt.compare(password, stored);
      } else {
        isMatch = stored === password;
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // Optional JWT (commented out)
      // const token = jwt.sign(
      //   { id: user.id, email: user.email, is_admin: user.is_admin },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "7d" }
      // );

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_admin: user.is_admin,
        },
        // token
      });
    } catch (e) {
      console.error("LOGIN CALLBACK ERROR:", e);
      return res.status(500).json({
        message: "Server error during login",
        error: e.message,
      });
    }
  });
});

// CONTACTS

app.get("/contacts", (req, res) => {
  const sql = "SELECT * FROM contacts";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json(data);
  });
});

app.get("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM contacts WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Contact not found" });
    res.json(data);
  });
});

app.post("/contacts", (req, res) => {
  console.log("Received contact data:", req.body);

  const { full_name, email, subject, message, user_id } = req.body || {};
  const sql =
    "INSERT INTO contacts(full_name, email, subject, message, user_id) VALUES (?,?,?,?,?)";

  db.query(sql, [full_name, email, subject, message, user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "Contact created", data });
  });
});

app.put("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const { full_name, email, subject, message, user_id } = req.body || {};

  db.query(
    "UPDATE contacts SET full_name=?, email=?, subject=?, message=?, user_id=? WHERE id=?",
    [full_name, email, subject, message, user_id, id],
    (err, data) => {
      if (err) return res.status(500).json({ message: err.message, code: err.code });
      res.json({ message: "Contact updated", data });
    }
  );
});

app.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contacts WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "Contact deleted", data });
  });
});

// MESSAGES

app.get("/messages", (req, res) => {
  const sql = "SELECT * FROM contacts";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json(data);
  });
});

app.get("/messages/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const sql = "SELECT * FROM contacts WHERE user_id = ?";
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json(data);
  });
});

// BMI RECORDS

app.get("/bmi_records", (req, res) => {
  const sql = "SELECT * FROM bmi_records";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json(data);
  });
});

app.get("/bmi_records/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM bmi_records WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json(data);
  });
});

app.post("/bmi_records", (req, res) => {
  const { weight, height, bmi_value, user_id } = req.body || {};
  const sql = "INSERT INTO bmi_records(weight, height, bmi_value, user_id) VALUES (?,?,?,?)";

  db.query(sql, [weight, height, bmi_value, user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "BMI record created", data });
  });
});

app.put("/bmi_records/:id", (req, res) => {
  const id = req.params.id;
  const { weight, height, bmi_value, user_id } = req.body || {};

  db.query(
    "UPDATE bmi_records SET weight=?, height=?, bmi_value=?, user_id=? WHERE id=?",
    [weight, height, bmi_value, user_id, id],
    (err, data) => {
      if (err) return res.status(500).json({ message: err.message, code: err.code });
      res.json({ message: "BMI record updated", data });
    }
  );
});

app.delete("/bmi_records/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM bmi_records WHERE id = ?";

  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    return res.json({ message: "BMI record deleted", data });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("UNHANDLED EXPRESS ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// START SERVER
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`SERVER HEALTHTRACK RUNNING ON PORT ${PORT}`);
});
