const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { isMongoDuplicateKeyError } = require("../utils/errors");
const crypto = require("crypto");
const PasswordResetOtp = require("../models/PasswordResetOtp");
const PendingUser = require("../models/PendingUser");
const { sendOtpEmail } = require("../utils/mailer");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
}

function signResetToken(email) {
  return jwt.sign({ sub: email, type: "reset" }, process.env.JWT_SECRET, {
    expiresIn: "15m",
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

    // Check if real user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remove old pending signup if exists
    await PendingUser.deleteOne({ email });

    // Save in PendingUser (NOT real User)
    await PendingUser.create({
      name,
      email,
      passwordHash,
      emailOtpHash,
      emailOtpExpiresAt,
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent to your email",
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
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

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
router.post("/verify-email", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // ✅ Find pending signup (NOT real user)
    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res
        .status(400)
        .json({ message: "OTP not found or expired. Please sign up again." });
    }

    // ✅ Check expiry
    if (!pending.emailOtpExpiresAt || pending.emailOtpExpiresAt < new Date()) {
      await PendingUser.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired. Please sign up again." });
    }

    // ✅ Hash incoming OTP and compare
    const incomingHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (incomingHash !== pending.emailOtpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Create real user now (verified)
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      passwordHash: pending.passwordHash,
      isEmailVerified: true,
      emailOtpHash: null,
      emailOtpExpiresAt: null,
    });

    // ✅ Delete pending record after success
    await PendingUser.deleteOne({ email });

    return res.json({
      message: "Email verified successfully. Please log in.",
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
router.post("/forgot-password/verify-otp", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const rec = await PasswordResetOtp.findOne({ email });
    if (!rec) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (!rec.expiresAt || rec.expiresAt < new Date()) {
      await PasswordResetOtp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    const incomingHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (incomingHash !== rec.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP verified; delete it
    await PasswordResetOtp.deleteOne({ email });

    // ✅ issue short-lived reset token for next step
    const resetToken = signResetToken(email);

    return res.json({ message: "OTP verified", resetToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({ email });

    // security: do not reveal if user exists
    if (!user) {
      return res.json({ message: "If account exists, OTP sent" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // overwrite any old OTP
    await PasswordResetOtp.deleteOne({ email });

    await PasswordResetOtp.create({
      email,
      otpHash,
      expiresAt,
    });

    // send OTP email
    await sendOtpEmail(email, otp);

    return res.json({ message: "If account exists, OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const resetToken = String(req.body.resetToken || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    if (payload?.type !== "reset" || !payload?.sub) {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const email = String(payload.sub).toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({ message: "Password updated. Please log in." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;