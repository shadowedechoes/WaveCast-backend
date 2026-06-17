const { login } = require("./auth");
const Ban = require("./models/Ban");

let bannedUsers = new Set();
let stations = {};

module.exports = (io) => {
    io.on("connection", (socket) => {

        let user = null;

        // LOGIN
        socket.on("login", async (data) => {
            const u = await login(data.username, data.password);

            if (!u || u.banned) {
                socket.emit("login_result", { success: false });
                return;
            }

            user = u;

            socket.emit("login_result", {
                success: true,
                role: u.role
            });
        });

        // CHAT
        socket.on("chat", (msg) => {
            if (!user) return;
            if (bannedUsers.has(user.username)) return;

            io.emit("chat", {
                user: user.username,
                msg
            });
        });

        // START BROADCAST
        socket.on("start_broadcast", (station) => {
            if (!user || user.role !== "dj") return;

            stations[station] = {
                dj: user.username,
                locked: true
            };

            io.emit("broadcast_started", station);
        });

        // CO-DJ
        socket.on("join_codj", (station) => {
            if (!user) return;

            if (!stations[station]) return;

            stations[station].coDj = user.username;
        });

        // BAN USER
        socket.on("ban_user", async (username) => {
            if (!user || user.role === "listener") return;

            bannedUsers.add(username);const Station = require("./models/Station");

async function createStation(name) {
    return await Station.create({
        name,
        activeDJ: null,
        coDJs: [],
        isLive: false
    });
}

async function startStation(id, dj) {
    return await Station.findByIdAndUpdate(id, {
        activeDJ: dj,
        isLive: true
    });
}

async function stopStation(id) {
    return await Station.findByIdAndUpdate(id, {
        activeDJ: null,
        isLive: false,
        coDJs: []
    });
}

module.exports = {
    createStation,
    startStation,
    stopStation
};

            await Ban.create({ username, reason: "banned" });

            io.emit("user_banned", username);
        });

        // KICK USER
        socket.on("kick_user", (username) => {
            io.emit("force_disconnect", username);
        });

        // OWNER OVERRIDE
        socket.on("override_station", (station) => {
            if (!user || user.role !== "super_owner") return;

            stations[station].dj = user.username;

            io.emit("station_override", station);
        });

        // WEBRTC
        socket.on("offer", (id, data) => io.to(id).emit("offer", socket.id, data));
        socket.on("answer", (id, data) => io.to(id).emit("answer", socket.id, data));
        socket.on("candidate", (id, data) => io.to(id).emit("candidate", socket.id, data));
    });
};