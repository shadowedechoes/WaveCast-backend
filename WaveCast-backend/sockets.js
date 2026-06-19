const jwt = require("jsonwebtoken");
const User = require("./models/User");

let chatMessages = [];
let broadcastActive = false;
let listenerCount = 0;
let nowPlaying = "Nothing playing";

module.exports = (io) => {

    io.on("connection", (socket) => {

        listenerCount++;

        console.log("User connected:", socket.id);

        // Initial state

        socket.emit(
            "chat-history",
            chatMessages
        );

        socket.emit(
            "broadcast-status",
            {
                active: broadcastActive
            }
        );

        socket.emit(
            "now-playing",
            {
                title: nowPlaying
            }
        );

        io.emit(
            "listener-count",
            {
                count: listenerCount
            }
        );

        // 💬 CHAT

        socket.on(

            "chat",

            async (data) => {

                try {

                    if (!broadcastActive) {

                        return socket.emit(
                            "error-message",
                            "No active broadcast"
                        );

                    }

                    const decoded = jwt.verify(
                        data.token,
                        process.env.JWT_SECRET
                    );

                    const user = await User.findById(
                        decoded.id
                    );

                    if (!user || user.banned) {
                        return;
                    }

                    const message = {

                        user: user.username,

                        msg: data.msg,

                        time: Date.now()

                    };

                    chatMessages.push(
                        message
                    );

                    io.emit(
                        "chat",
                        message
                    );

                }

                catch (err) {

                    console.log(
                        "Chat error:",
                        err.message
                    );

                }

            }

        );

        // 🎵 NOW PLAYING

        socket.on(

            "set-now-playing",

            async (data) => {

                try {

                    const decoded = jwt.verify(
                        data.token,
                        process.env.JWT_SECRET
                    );

                    const user = await User.findById(
                        decoded.id
                    );

                    if (

                        !user ||

                        (

                            user.role !== "admin"

                            &&

                            user.role !== "dj"

                        )

                    ) {

                        return;

                    }

                    nowPlaying = data.title;

                    io.emit(

                        "now-playing",

                        {

                            title: nowPlaying

                        }

                    );

                }

                catch (err) {

                    console.log(
                        err.message
                    );

                }

            }

        );

        // ▶️ START BROADCAST

        socket.on(

            "start-broadcast",

            async (token) => {

                try {

                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                    const user = await User.findById(
                        decoded.id
                    );

                    if (

                        !user ||

                        (

                            user.role !== "admin"

                            &&

                            user.role !== "dj"

                        )

                    ) {

                        return;

                    }

                    broadcastActive = true;

                    io.emit(

                        "broadcast-status",

                        {

                            active: true

                        }

                    );

                }

                catch (err) {

                    console.log(
                        err.message
                    );

                }

            }

        );

        // ⏹️ END BROADCAST

        socket.on(

            "end-broadcast",

            async (token) => {

                try {

                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                    const user = await User.findById(
                        decoded.id
                    );

                    if (

                        !user ||

                        (

                            user.role !== "admin"

                            &&

                            user.role !== "dj"

                        )

                    ) {

                        return;

                    }

                    broadcastActive = false;

                    chatMessages = [];

                    nowPlaying = "Nothing playing";

                    io.emit(
                        "chat-cleared"
                    );

                    io.emit(

                        "broadcast-status",

                        {

                            active: false

                        }

                    );

                    io.emit(

                        "now-playing",

                        {

                            title: nowPlaying

                        }

                    );

                    io.emit(
                        "webrtc-stop"
                    );

                }

                catch (err) {

                    console.log(
                        err.message
                    );

                }

            }

        );

        // 🎧 WEBRTC AUDIO SIGNALING

        socket.on(

            "webrtc-offer",

            (data) => {

                socket.broadcast.emit(
                    "webrtc-offer",
                    data
                );

            }

        );

        socket.on(

            "webrtc-answer",

            (data) => {

                socket.broadcast.emit(
                    "webrtc-answer",
                    data
                );

            }

        );

        socket.on(

            "webrtc-candidate",

            (data) => {

                socket.broadcast.emit(
                    "webrtc-candidate",
                    data
                );

            }

        );

        // 👥 DISCONNECT

        socket.on(

            "disconnect",

            () => {

                listenerCount--;

                if (
                    listenerCount < 0
                ) {

                    listenerCount = 0;

                }

                io.emit(

                    "listener-count",

                    {

                        count: listenerCount

                    }

                );

                console.log(
                    socket.id,
                    "disconnected"
                );

            }

        );

    });

};