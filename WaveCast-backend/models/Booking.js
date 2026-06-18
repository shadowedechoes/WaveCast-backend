const mongoose = require("mongoose");

module.exports = mongoose.model("Booking", {
    station: String,
    dj: String,
    time: String
});