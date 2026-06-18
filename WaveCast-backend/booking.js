const Booking = require("./models/Booking");

async function bookSlot(station, dj, time) {
    return await Booking.create({
        station,
        dj,
        time
    });
}

async function getBookings() {
    return await Booking.find();
}

module.exports = {
    bookSlot,
    getBookings
};