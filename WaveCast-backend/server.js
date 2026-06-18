const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./db");
const socketsHandler = require("./sockets");

const app = express();

app.use(cors());

app.use(express.json());

// Connect MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

// Homepage
app.get("/", (req, res) => {
    res.json({
        status: "WaveCast running"
    });
});

// Start sockets
socketsHandler(io);

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`WaveCast running on port ${PORT}`);
});