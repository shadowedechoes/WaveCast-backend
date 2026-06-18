const jwt = require("jsonwebtoken");
const User = require("./models/User");

let chatMessages = [];
let broadcastActive = false;
let listenerCount = 0;

module.exports = (io) => {

    io.on("connection", (socket) => {

        listenerCount++;

        console.log("User connected:", socket.id);

        // Send current state
        socket.emit("chat-history", chatMessages);

        socket.emit(
            "broadcast-status",
            { active: broadcastActive }
        );

        io.emit(
            "listener-count",
            { count: listenerCount }
        );

        // 💬 Chat

        socket.on("chat", async (data) => {

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

                const user =
                await User.findById(
                    decoded.id
                );

                if (
                    !user ||
                    user.banned
                ) return;

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

            } catch (err) {

                console.log(
                    err.message
                );

            }

        });

        // 🎙️ START

        socket.on(
        "start-broadcast",

        async (token) => {

            try {

                const decoded =

                jwt.verify(

                token,

                process.env.JWT_SECRET

                );

                const user =

                await User.findById(

                decoded.id

                );

                if (

                !user ||

                (

                user.role !==

                "admin"

                &&

                user.role !==

                "dj"

                )

                ) return;

                broadcastActive = true;

                io.emit(

                "broadcast-status",

                {

                active:true

                }

                );

            } catch (err) {

                console.log(

                err.message

                );

            }

        });

        // ⏹️ END

        socket.on(

        "end-broadcast",

        async (token) => {

            try {

                const decoded =

                jwt.verify(

                token,

                process.env.JWT_SECRET

                );

                const user =

                await User.findById(

                decoded.id

                );

                if (

                !user ||

                (

                user.role !==

                "admin"

                &&

                user.role !==

                "dj"

                )

                ) return;

                broadcastActive = false;

                chatMessages = [];

                io.emit(

                "chat-cleared"

                );

                io.emit(

                "broadcast-status",

                {

                active:false

                }

                );

            } catch (err) {

                console.log(

                err.message

                );

            }

        });

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

            count:

            listenerCount

            }

            );

            console.log(

            "Disconnected:",

            socket.id

            );

        });

    });

};