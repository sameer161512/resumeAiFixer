const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },

    // store hashed password temporarily (still safe)
    passwordHash: { type: String, required: true },

    // OTP info
    emailOtpHash: { type: String, required: true },
    emailOtpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// auto-delete pending records after expiry (Mongo TTL index)
pendingUserSchema.index({ emailOtpExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingUser", pendingUserSchema);