const express = require('express'); 
const mysql = require('mysql2'); 
const cors = require('cors'); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const app = express(); 
console.log("HEALTHTRACK SERVER FILE LOADED"); 
app.use(cors()); 
app.use(express.json()); 
app.get('/', (req, res) => { 
  return res.json("Backend is running"); 
});
const db = mysql.createConnection({ 
  host: "localhost", 
  user: "root", 
  password: "1234", 
  database:"healthtrack", 
  port:3307 
});
// to get all the users 
app.get('/users', (req, res) => { 
  const sql = "SELECT * FROM users"; 
  db.query(sql, (err, data) => { 
    if (err) return res.json(err); 
    return res.json(data); 
  }); 
});
// to get a user by his id
app.get('/users/:id', (req, res) => { 
  const id = req.params.id; 
  const sql = "SELECT * FROM users WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.status(500).json(err); 
    if (data.length === 0) return res.status(404).json({ message: "User not found" }); 
    res.json(data); 
  }); 
});
// create a new user
app.post('/users', (req, res) => { 
  const { full_name, email, password } = req.body; 
  const sql = "INSERT INTO users(full_name, email, password) VALUES (?,?,?)"; 
  db.query(sql, [full_name, email, password], (err, data) => { 
    if (err) return res.send(err);
     return res.json(data); 
    });
   });

   // to update the user 
app.put('/users/:id', (req, res) => { 
  const id = req.params.id; 
  const { full_name, email, password } = req.body; 
  const sql = "UPDATE users SET full_name= ?, email= ?, password= ? WHERE id = ?"; 
  db.query(sql, [full_name, email, password, id], (err, data) => { 
    if (err) return res.send(err); return res.json(data); 
  }); 
});

// to delete the user 
app.delete('/users/:id', (req, res) => { 
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.send(err); 
    return res.json(data); 
  }); 
});

app.post('/login', (req, res) => { 
  const { email, password } = req.body; 
  const sql = "SELECT * FROM users WHERE email = ?"; 
  db.query(sql, [email], (err, data) => { 
    if (err) return res.status(500).json(err); 
    if (data.length === 0) return res.status(404).json({ message: "User not found" }); 
    const user = data[0]; 
    if (user.password !== password) { 
      return res.status(401).json({ message: "Wrong password" }); 
    } 
    res.json({
       message: "Login successful", 
       user: { id: user.id, 
               full_name: user.full_name, 
               email: user.email, 
               is_admin: user.is_admin 
              } 
            }); 
          }); 
        });

// to get all the contacts
app.get('/contacts', (req, res) => { 
  const sql = "SELECT * FROM contacts"; 
  db.query(sql, (err, data) => { 
    if (err) return res.json(err); 
    return res.json(data); 
  }); 
});

// to get a contact by his id 
app.get('/contacts/:id', (req, res) => { 
  const id = req.params.id; 
  const sql = "SELECT * FROM contacts WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.status(500).json(err); 
    if (data.length === 0) return res.status(404).json({ message: "Contact not found" }); 
    res.json(data); 
  }); 
});
// to create a new contact
 app.post('/contacts', (req, res) => { 
  const { full_name, email, subject, message, user_id } = req.body; 
  const sql = "INSERT INTO contacts(full_name, email, subject, message, user_id) VALUES (?,?,?,?,?)";
  db.query(sql, [full_name, email, subject, message, user_id], (err, data) => { 
    if (err) return res.send(err); 
    return res.json(data); 
  }); 
});

// to update contact 
app.put('/contacts/:id', (req, res) => { 
  const id = req.params.id; 
  const { full_name, email, subject, message, user_id } = req.body; 
  db.query("UPDATE contacts SET full_name=?, email=?, subject=?, message=?, user_id=? WHERE id=?",
     [full_name, email, subject, message, user_id, id], (err, data) => { 
    if (err) return res.send(err); 
    res.json(data); 
  }); 
})

// to delete contact 
app.delete('/contacts/:id', (req, res) => { 
  const id = req.params.id;
  const sql = "DELETE FROM contacts WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.send(err); 
    return res.json(data); 
  }); 
});

// to get the bmi records for all users 
app.get('/bmi_records', (req, res) => {
   const sql = "SELECT * FROM bmi_records"; 
   db.query(sql, (err, data) => { 
    if (err) return res.json(err); 
    return res.json(data); 
  }); 
});
// to get the bmi record for a specific user 
app.get('/bmi_records/:id', (req, res) => { 
  const id = req.params.id; 
  const sql = "SELECT * FROM bmi_records WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.status(500).json(err);
    if (data.length === 0)
       return res.status(404).json({ message: "Record not found" }); 
      res.json(data); 
    }); 
  });

//to create bmi record 
app.post('/bmi_records', (req, res) => { 
  const { weight, height, bmi_value, user_id } = req.body; 
  const sql = "INSERT INTO bmi_records(weight, height, bmi_value, user_id) VALUES (?,?,?,?)"; 
  db.query(sql, [weight, height, bmi_value, user_id], (err, data) => {
     if (err) return res.send(err); 
     return res.json(data); 
    }); 
  });

//update bmi record 
app.put('/bmi_records/:id', (req, res) => {
   const id = req.params.id; 
   const { weight, height, bmi_value, user_id } = req.body; 
   db.query("UPDATE bmi_records SET weight=?, height=?, bmi_value=?, user_id=? WHERE id=?", 
    [weight, height, bmi_value, user_id, id], 
    (err, data) => { 
      if (err) return res.send(err); 
      res.json(data); 
    }); 
  });

//delete bmi record 
app.delete('/bmi_records/:id', (req, res) => { 
  const id = req.params.id; 
  const sql = "DELETE FROM bmi_records WHERE id = ?"; 
  db.query(sql, [id], (err, data) => { 
    if (err) return res.send(err); 
    return res.json(data); 
  }); 
});

db.connect((err) => { 
  if (err) { 
    console.log("Database connection error:", err); 
  } 
  else { 
    console.log("Connected to MySQL database!"); 
  } 
});
app.get('/check', (req, res) => { 
  res.json("CHECK OK"); 
});
app.listen(8083, () => { 
  console.log("SERVER HEALTHTRACK RUNNING ON PORT 8083"); 
});