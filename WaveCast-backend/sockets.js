module.exports = (io) => {

io.on("connection", (sockets) => {

sockets.on("chat", (data) => {

io.emit("chat", {
user: data.user || "Guest",
msg: data.msg
});

});

});

};