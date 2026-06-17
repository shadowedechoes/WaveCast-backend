const { login } = require("./auth");
const Ban = require("./models/Ban");

let bannedUsers = new Set();
let stations = {};

module.exports = (io) => {
    io.on("connection", (sockets) => {

        let user = null;

        // LOGIN
        sockets.on("login", async (data) => {
            const u = await login(data.username, data.password);

            if (!u || u.banned) {
                sockets.emit("login_result", { success: false });
                return;
            }

            user = u;

            sockets.emit("login_result", {
                success: true,
                role: u.role
            });
        });

        // CHAT
        sockets.on("chat", (msg) => {
            if (!user) return;
            if (bannedUsers.has(user.username)) return;

            io.emit("chat", {
                user: user.username,
                msg
            });
        });

        // START BROADCAST
        sockets.on("start_broadcast", (station) => {
            if (!user || user.role !== "dj") return;

            stations[station] = {
                dj: user.username,
                locked: true
            };

            io.emit("broadcast_started", station);
        });

        // CO-DJ
        sockets.on("join_codj", (station) => {
            if (!user) return;

            if (!stations[station]) return;

            stations[station].coDj = user.username;
        });

        // BAN USER
        sockets.on("ban_user", async (username) => {
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
        sockets.on("kick_user", (username) => {
            io.emit("force_disconnect", username);
        });

        // OWNER OVERRIDE
        sockets.on("override_station", (station) => {
            if (!user || user.role !== "super_owner") return;

            stations[station].dj = user.username;

            io.emit("station_override", station);
        });

        // WEBRTC
        sockets.on("offer", (id, data) => io.to(id).emit("offer", sockets.id, data));
        sockets.on("answer", (id, data) => io.to(id).emit("answer", sockets.id, data));
        sockets.on("candidate", (id, data) => io.to(id).emit("candidate", sockets.id, data));
    });
};