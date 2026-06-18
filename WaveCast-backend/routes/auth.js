const express = require("express");
const { register, login } = require("../auth");

const router = express.Router();

router.post("/register", async (req, res) => {

    try {

        const user = await register(
            req.body.username,
            req.body.password,
            req.body.role
        );

        res.json({
            success: true,
            user
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }

});

router.post("/login", async (req, res) => {

    const result = await login(
        req.body.username,
        req.body.password
    );

    if (result?.banned) {

        return res.json({
            success: false,
            message: "Your account is banned."
        });

    }

    if (!result) {

        return res.json({
            success: false,
            message: "Invalid username or password."
        });

    }

    res.json({
        success: true,
        token: result.token,
        username: result.user.username,
        role: result.user.role
    });

});

module.exports = router;