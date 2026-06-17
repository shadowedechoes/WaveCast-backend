const express = require("express");
const { register, login } = require("../auth");

const router = express.Router();

router.post("/register", async (req,res)=>{
const user = await register(req.body.username, req.body.password, req.body.role);
res.json({success:true, user});
});

router.post("/login", async (req,res)=>{
const result = await login(req.body.username, req.body.password);
if(!result) return res.json({success:false});

res.json({
success:true,
token:result.token,
username:result.user.username,
role:result.user.role
});
});

module.exports = router;