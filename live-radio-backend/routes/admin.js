const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/ban", async (req, res) => {
    await User.updateOne(
        { username: req.body.username },
        { banned: true }
    );

    res.json({ success: true });
});

router.post("/make-dj", async (req, res) => {
    await User.updateOne(
        { username: req.body.username },
        { role: "dj" }
    );

    res.json({ success: true });
});

router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;