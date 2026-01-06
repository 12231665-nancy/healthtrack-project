app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

    db.query(sql, [email.trim()], async (err, data) => {
      if (err) {
        console.error("🔥 LOGIN SQL ERROR:", err);
        return res.status(500).json({
          message: "Database error during login",
          code: err.code,
          error: err.message
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = data[0];

      if (!user.password) {
        return res.status(500).json({ message: "User password missing in DB" });
      }

      let isMatch = false;

      // ✅ Detect bcrypt hash (most bcrypt hashes start with $2a$ or $2b$)
      const isBcryptHash =
        typeof user.password === "string" &&
        (user.password.startsWith("$2a$") ||
          user.password.startsWith("$2b$") ||
          user.password.startsWith("$2y$"));

      if (isBcryptHash) {
        // ✅ Secure compare
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // ✅ Plaintext compare (fallback)
        isMatch = user.password === password;
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // ✅ Optional: Create JWT token (only if you want)
      // if (!process.env.JWT_SECRET) {
      //   console.warn("⚠️ JWT_SECRET is not set in environment variables");
      // }
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
          is_admin: user.is_admin
        },
        // token
      });
    });
  } catch (e) {
    console.error("🔥 LOGIN SERVER ERROR:", e);
    return res.status(500).json({
      message: "Unexpected server error during login",
      error: e.message
    });
  }
});
