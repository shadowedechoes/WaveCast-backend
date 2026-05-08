const express = require("express");
const { register, login } = require("../auth");

const router = express.Router();

router.post("/register", async (req, res) => {
    const user = await register(req.body.username, req.body.password, req.body.role);
    res.json(user);
});

router.post("/login", async (req, res) => {
    const user = await login(req.body.username, req.body.password);

    if (!user) return res.json({ success: false });

    res.json({ success: true, role: user.role });
});

module.exports = router;