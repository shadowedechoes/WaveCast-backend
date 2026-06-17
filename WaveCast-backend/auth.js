const bcrypt = require("bcrypt");
const User = require("./models/User");

async function register(username, password, role = "listener") {

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw new Error("Username already exists.");
    }

    const hash = await bcrypt.hash(password, 10);

    return await User.create({
        username,
        passwordHash: hash,
        role
    });
}

async function login(username, password) {

    const user = await User.findOne({ username });

    if (!user) return null;

    if (user.banned) return null;

    const match = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!match) return null;

    return user;
}

module.exports = { register, login };