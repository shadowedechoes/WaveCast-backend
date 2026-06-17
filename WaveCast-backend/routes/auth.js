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
            username: user.username,
            role: user.role
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Unable to create account."
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const user = await login(
            req.body.username,
            req.body.password
        );

        if (!user) {

            return res.json({
                success: false
            });

        }

        res.json({
            success: true,
            username: user.username,
            role: user.role
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;