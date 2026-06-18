const mongoose = require("mongoose");

module.exports = mongoose.model("Station", {
    name: String,
    activeDJ: String,
    coDJs: [String],
    isLive: Boolean
});