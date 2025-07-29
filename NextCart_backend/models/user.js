
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false }, 
  removedBySuperAdmin: {
  type: Boolean,
  default: false,
}
,
});

module.exports = mongoose.model("User", userSchema);
