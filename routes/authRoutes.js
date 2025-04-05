const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, collegeId, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, collegeId, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});



router.post("/send-otp", async (req, res) => {
  try {
    console.log("Received OTP request for:", req.body.email); // Debugging log

    const { email } = req.body;
    if (!email) {
      console.error("No email provided");
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      return res.status(400).json({ error: "User not found" });
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp); // Debugging log

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log("Saving OTP in database for:", email); // Debugging log

    // Send OTP Email
    const mailOptions = {
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP:", err);
        return res.status(500).json({ error: "Error sending OTP" });
      }
      console.log("OTP sent successfully:", info.response);
      res.json({ message: "OTP sent to email" });
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
});

// Verify OTP & Login
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp ,role} = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role, studentId: user.role === "student" ? user._id : undefined,
      adminId: user.role === "admin" ? user._id : undefined });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});


// Middleware to check authentication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Protected Route (Example)
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You have access to this protected route" });
});

module.exports = router;
