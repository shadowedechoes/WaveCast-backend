const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

/**
 * 🔒 All admin routes are now protected
 */

// Ban user (admin only)
router.post("/ban", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await User.updateOne(
        { username: req.body.username },
        { banned: true }
    );

    res.json({ success: true, message: "User banned" });
});

// Make DJ (admin only)
router.post("/make-dj", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await User.updateOne(
        { username: req.body.username },
        { role: "dj" }
    );

    res.json({ success: true, message: "User promoted to DJ" });
});

// Get all users (admin only)
router.get("/users", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const users = await User.find();
    res.json(users);
});

module.exports = router;