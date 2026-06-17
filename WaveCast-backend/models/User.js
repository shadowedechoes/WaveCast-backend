const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
username: { type:String, unique:true },
passwordHash:String,
role:String,
banned:Boolean
});