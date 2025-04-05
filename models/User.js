const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  collegeId: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], required: true },
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);