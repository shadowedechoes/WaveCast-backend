const jwt = require("jsonwebtoken");
const User = require("./models/User");

let chatMessages = [];
let broadcastActive = false;

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        // Send current state
        socket.emit("chat-history", chatMessages);
        socket.emit("broadcast-status", { active: broadcastActive });

        // 💬 Chat message
        socket.on("chat", async (data) => {

            try {
                if (!broadcastActive) {
                    return socket.emit("error-message", "No active broadcast");
                }

                const decoded = jwt.verify(data.token, process.env.JWT_SECRET);

                const user = await User.findById(decoded.id);
                if (!user || user.banned) return;

                const message = {
                    user: user.username,
                    msg: data.msg,
                    time: Date.now()
                };

                chatMessages.push(message);

                io.emit("chat", message);

            } catch (err) {
                console.log("Chat error:", err.message);
            }
        });

        // 🎙️ Start broadcast (admin/dj only)
        socket.on("start-broadcast", async (token) => {

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user || (user.role !== "admin" && user.role !== "dj")) {
                    return;
                }

                broadcastActive = true;

                io.emit("broadcast-status", { active: true });

            } catch (err) {
                console.log("Broadcast start error:", err.message);
            }
        });

        // 🧹 End broadcast + CLEAR CHAT
        socket.on("end-broadcast", async (token) => {

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user || (user.role !== "admin" && user.role !== "dj")) {
                    return;
                }

                broadcastActive = false;

                // 🔥 CLEAR CHAT WHEN BROADCAST ENDS
                chatMessages = [];

                io.emit("chat-cleared");
                io.emit("broadcast-status", { active: false });

            } catch (err) {
                console.log("Broadcast end error:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};