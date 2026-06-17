const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./db");
const socketHandler = require("./sockets");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

socketHandler(io);

app.get("/", (req, res) => {
    res.json({ status: "Live Radio Backend Running" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on", PORT));