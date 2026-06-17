const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./db");
const socketHandler = require("./socket");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
cors: { origin: "*" }
});

app.use("/auth", require("./routes/auth"));

socketHandler(io);

app.get("/", (req,res)=>{
res.json({status:"WaveCast running"});
});

server.listen(process.env.PORT || 3000);