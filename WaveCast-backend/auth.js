const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

async function register(username, password, role="listener") {
const hash = await bcrypt.hash(password,10);

return await User.create({
username,
passwordHash:hash,
role
});
}

async function login(username,password){

const user = await User.findOne({username});
if(!user) return null;

const match = await bcrypt.compare(password,user.passwordHash);
if(!match) return null;

const token = jwt.sign(
{ id:user._id, username:user.username, role:user.role },
process.env.JWT_SECRET,
{ expiresIn:"7d" }
);

return { user, token };
}

module.exports = { register, login };