
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const verifySuperadmin = (req, res, next) => {
   const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin" && !decoded.isSuperAdmin) {
      return res.status(403).json({ message: "Forbidden: Not a superadmin" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


router.get("/admins", verifySuperadmin, async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true, isSuperAdmin: false }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/remove-admin/:id", verifySuperadmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        isAdmin: false,
        removedBySuperAdmin: true, 
      },
      { new: true }
    );

    res.json({ message: "Admin rights removed", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove admin rights" });
  }
});

module.exports = router;
