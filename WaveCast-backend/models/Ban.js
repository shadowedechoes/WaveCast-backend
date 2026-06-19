const mongoose = require("mongoose");

module.exports = mongoose.model("Ban", {
    username: String,
    reason: String
});