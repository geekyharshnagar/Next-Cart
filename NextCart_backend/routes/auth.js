require("dotenv").config(); 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = require("../middleware/auth");


const ADMIN_SECRET = process.env.ADMIN_SECRET ; 
const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET ;

router.post("/register", async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (role === "admin" && adminCode !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Invalid admin access code" });
  }
  if (role === "superadmin" && adminCode !== SUPER_ADMIN_SECRET) {
  return res.status(403).json({ error: "Invalid super admin code" });
}

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = role === "admin" || role === "superadmin";
const isSuperAdmin = role === "superadmin";

  const newUser = new User({
  username,
  email,
  password: hashedPassword,
  isAdmin,
  isSuperAdmin,
});
    await newUser.save();
    res.status(201).json({
      message: " User registered successfully",
      user: {
  username,
  email,
  role: isSuperAdmin ? "superadmin" : isAdmin ? "admin" : "user",
},

    });
  } catch (err) {
  console.error("Registration failed:", err); 
  res.status(500).json({ error: "Registration failed" });
}

});

router.delete("/delete-account", verifyToken, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password) return res.status(400).json({ message: "Password is required." });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    await User.findByIdAndDelete(userId);
    return res.json({ message: "Account deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

  const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,  
    role: user.isSuperAdmin ? "superadmin" : user.isAdmin ? "admin" : "user", 
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);




   res.json({
  message: " Login successful",
  token,
  user: {
    username: user.username,
    email,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
  },
});

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
