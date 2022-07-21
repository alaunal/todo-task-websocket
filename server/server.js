const express = require("express");
const http = require("http");
const cors = require("cors");
const {
  Server
} = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

// Run when client connects
io.on('connection', socket => {
  console.log(`User Connected: ${socket.id}`);

  // Join a conversation
  const {
    roomId
  } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    socket.leave(roomId);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));