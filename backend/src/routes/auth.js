const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { isMongoDuplicateKeyError } = require("../utils/errors");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email || !email.includes("@"))
      return res.status(400).json({ message: "Valid email is required" });
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be 6+ characters" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user._id.toString());

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("_id name email");
  if (!user) return res.status(404).json({ message: "Not found" });

  return res.json({
    user: { id: user._id, name: user.name, email: user.email },
  });
});
router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ email });

    // For security: always return success message
    // even if user does not exist
    if (!user) {
      return res.json({
        message: "If account exists, reset link sent",
      });
    }

    // TODO: generate reset token + send email (later)
    // For now just simulate success

    return res.json({
      message: "If account exists, reset link sent",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;