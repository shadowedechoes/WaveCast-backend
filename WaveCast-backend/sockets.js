module.exports = (io) => {

io.on("connection", (socket) => {

socket.on("chat", (data) => {

io.emit("chat", {
user: data.user || "Guest",
msg: data.msg
});

});

});

};