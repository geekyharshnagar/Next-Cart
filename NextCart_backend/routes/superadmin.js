
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

router.get("/all-admins", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user.isSuperAdmin)
      return res.status(403).json({ error: "Forbidden" });

    const admins = await User.find({
      $or: [{ isAdmin: true }, { isSuperAdmin: true }],
    }).select("email isAdmin isSuperAdmin");

    res.json(admins);
  } catch (err) {
    console.error(" Failed to fetch admins", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/remove-admin/:id", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user.isSuperAdmin) return res.status(403).json({ error: "Forbidden" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: false, isSuperAdmin: false },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(" Failed to remove admin rights", err);
    res.status(500).json({ error: "Failed to remove admin rights" });
  }
});

module.exports = router;
