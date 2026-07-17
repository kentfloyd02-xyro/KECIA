/* ==========================================
   LoveBooth v3.0
   server.js
   Vercel-Compatible Version
========================================== */

"use strict";

/* ===============================
   Modules
================================ */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

/* ===============================
   App
================================ */

const app = express();
const server = http.createServer(app);

// CORS configuration for Socket.IO on Vercel
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5500",
  "http://localhost:3000",
  "http://localhost:5500",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
  transports: ["websocket", "polling"],
});

/* ===============================
   Static Files
================================ */

app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, "..")
  )
);

/* ===============================
   Health Check Endpoint
================================ */

app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Server is running", timestamp: new Date().toISOString() });
});

/* ===============================
   Socket.IO
================================ */

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  let currentRoom = "";

  /* ===============================
     Join Room
  ============================== */

  socket.on("join-room", (room) => {
    const roomUsers = io.sockets.adapter.rooms.get(room);
    const size = roomUsers ? roomUsers.size : 0;

    if (size >= 2) {
      socket.emit("room-full");
      console.log(`❌ Room ${room} is full`);
      return;
    }

    currentRoom = room;
    socket.join(room);
    socket.emit("room-joined", room);
    socket.to(room).emit("partner-joined");

    console.log(`✅ ${socket.id} joined ${room} (Room size: ${size + 1})`);
  });

  /* ===============================
     Offer
  ============================== */

  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", data);
    console.log(`📤 Offer sent in room ${data.room}`);
  });

  /* ===============================
     Answer
  ============================== */

  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", data);
    console.log(`📥 Answer sent in room ${data.room}`);
  });

  /* ===============================
     ICE Candidate
  ============================== */

  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", data);
  });

  /* ===============================
     Heart Reaction
  ============================== */

  socket.on("heart-reaction", (room) => {
    socket.to(room).emit("heart-reaction");
    console.log(`❤️ Heart reaction sent in room ${room}`);
  });

  /* ===============================
     End Call
  ============================== */

  socket.on("end-call", (room) => {
    socket.to(room).emit("call-ended");
    console.log(`📵 Call ended in room ${room}`);
  });

  /* ===============================
     Leave Room
  ============================== */

  socket.on("leave-room", () => {
    if (!currentRoom) {
      return;
    }

    socket.leave(currentRoom);
    socket.to(currentRoom).emit("partner-left");
    console.log(`👋 ${socket.id} left room ${currentRoom}`);

    currentRoom = "";
  });

  /* ===============================
     Disconnect
  ============================== */

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);

    if (currentRoom) {
      socket.to(currentRoom).emit("partner-left");
    }
  });

  /* ===============================
     Error Handling
  ============================== */

  socket.on("error", (error) => {
    console.error("❌ Socket Error:", error);
  });
});

/* ===============================
   Server
================================ */

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("❤️ LoveBooth Server Running!");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📡 CORS Origins: ${allowedOrigins.join(", ")}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("");
});

/* ===============================
   Graceful Shutdown
================================ */

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

module.exports = server;
