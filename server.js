// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, ".")));

// XP system memory
let users = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // New user join with username
    socket.on("join", (username) => {
        users[socket.id] = { name: username, xp: 0, level: 1 };
        io.emit("system", `${username} joined the chat 🚀`);
    });

    // Chat messages
    socket.on("chat message", (msg) => {
        const user = users[socket.id] || { name: "Unknown" };

        // XP increase
        user.xp += 10;
        if (user.xp >= user.level * 100) {
            user.level++;
            io.emit("system", `${user.name} leveled up to 🔥 Level ${user.level}!`);
        }

        // Special slash commands
        if (msg.startsWith("/")) {
            handleCommand(socket, msg);
        } else {
            io.emit("chat message", {
                id: socket.id,
                user: user.name,
                msg: msg,
                level: user.level
            });
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            io.emit("system", `${users[socket.id].name} left ❌`);
            delete users[socket.id];
        }
        console.log("User disconnected:", socket.id);
    });
});

// Handle special commands
function handleCommand(socket, msg) {
    const user = users[socket.id];
    if (!user) return;

    switch (msg.toLowerCase()) {
        case "/party":
            io.emit("effect", { type: "party", user: user.name });
            break;
        case "/matrix":
            io.emit("effect", { type: "matrix", user: user.name });
            break;
        case "/boom":
            io.emit("effect", { type: "boom", user: user.name });
            break;
        case "/rose":
            io.emit("effect", { type: "rose", user: user.name });
            break;
        case "/warp":
            io.emit("effect", { type: "warp", user: user.name });
            break;
        case "/angel":
            io.emit("effect", { type: "angel", user: user.name });
            break;
        case "/demon":
            io.emit("effect", { type: "demon", user: user.name });
            break;
        case "/xp":
            socket.emit("system", `⭐ ${user.name} XP: ${user.xp}, Level: ${user.level}`);
            break;
        default:
            socket.emit("system", `Unknown command: ${msg}`);
    }
}

// Port for Render / local
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
