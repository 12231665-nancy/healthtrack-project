const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
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

// Middleware
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
app.get("/currentUser", (req, res) => res.json({ user: null }));

// Database pool (Railway internal/private URL)
if (!process.env.MYSQL_URL) {
  console.error("MYSQL_URL is missing from environment variables");
}

const db = mysql.createPool(process.env.MYSQL_URL);

// Startup DB test
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("DB TEST FAILED:", err.code, err.message);
  } else {
    console.log("DB TEST OK");
  }
});

// Debug endpoint to check DB anytime
app.get("/dbcheck", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).json({ ok: false, code: err.code, error: err.message });
    return res.json({ ok: true });
  });
});

// USERS

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json(data);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0) return res.status(404).json({ message: "User not found" });
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
    res.json({ message: "User created", data });
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { full_name, email, password } = req.body || {};
  const sql = "UPDATE users SET full_name=?, email=?, password=? WHERE id=?";
  db.query(sql, [full_name, email, password, id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "User updated", data });
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "User deleted", data });
  });
});

// LOGIN (crash-proof, bcrypt/plaintext auto-detect)

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
          error: err.message || "",
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = data[0];

      if (!user || !user.password) {
        return res.status(500).json({ message: "User record is missing password field" });
      }

      const stored = String(user.password);
      const isBcryptHash =
        stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

      let isMatch = false;
      if (isBcryptHash) {
        isMatch = await bcrypt.compare(password, stored);
      } else {
        isMatch = stored === password;
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_admin: user.is_admin,
        },
      });
    } catch (e) {
      console.error("LOGIN CALLBACK ERROR:", e);
      return res.status(500).json({ message: "Server error during login", error: e.message });
    }
  });
});

// CONTACTS

app.get("/contacts", (req, res) => {
  db.query("SELECT * FROM contacts", (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json(data);
  });
});

app.get("/contacts/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM contacts WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0) return res.status(404).json({ message: "Contact not found" });
    res.json(data);
  });
});

app.post("/contacts", (req, res) => {
  const { full_name, email, subject, message, user_id } = req.body || {};
  const sql =
    "INSERT INTO contacts(full_name, email, subject, message, user_id) VALUES (?,?,?,?,?)";

  db.query(sql, [full_name, email, subject, message, user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "Contact created", data });
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
  db.query("DELETE FROM contacts WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "Contact deleted", data });
  });
});

// MESSAGES

app.get("/messages", (req, res) => {
  db.query("SELECT * FROM contacts", (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json(data);
  });
});

app.get("/messages/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.query("SELECT * FROM contacts WHERE user_id = ?", [user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json(data);
  });
});

// BMI RECORDS

app.get("/bmi_records", (req, res) => {
  db.query("SELECT * FROM bmi_records", (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json(data);
  });
});

app.get("/bmi_records/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM bmi_records WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    if (!data || data.length === 0) return res.status(404).json({ message: "Record not found" });
    res.json(data);
  });
});

app.post("/bmi_records", (req, res) => {
  const { weight, height, bmi_value, user_id } = req.body || {};
  const sql = "INSERT INTO bmi_records(weight, height, bmi_value, user_id) VALUES (?,?,?,?)";

  db.query(sql, [weight, height, bmi_value, user_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "BMI record created", data });
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
  db.query("DELETE FROM bmi_records WHERE id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message, code: err.code });
    res.json({ message: "BMI record deleted", data });
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

// Start server
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`SERVER HEALTHTRACK RUNNING ON PORT ${PORT}`);
});
