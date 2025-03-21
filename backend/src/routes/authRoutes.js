require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const  verifyToken  = require("../middleware/authMiddleware");



const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Log request body

    const { name, email, password, userType } = req.body;

    // Check if all fields exist
    if (!name || !email || !password || !userType) {
      console.log("Missing field detected:", { name, email, password, userType });
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, userType: user.userType },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ where: { email } }); // ✅ Fix query

      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign(
          { userId: user.id, userType: user.userType }, // ✅ Fix user.id
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      // Debugging logs
      console.log("Login successful:", { userId: user.id, userType: user.userType });

      res.status(200).json({
          message: "Login successful",
          userType: user.userType, // ✅ Ensure userType is sent
          token,
      });

  } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;