import express from "express";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;
const app = express();

// Basic route check
app.get("/", (req, res) => {
  res.send("WebSocket Chat Server Running ✅");
});

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    // broadcast to all
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
