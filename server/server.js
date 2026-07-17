/* ==========================================
   LoveBooth v3.0
   server.js
========================================== */

"use strict";

/* ===============================
   Modules
================================ */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

/* ===============================
   App
================================ */

const app = express();
const server = http.createServer(app);

const io = new Server(server);

/* ===============================
   Static Files
================================ */
const path = require("path");

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

/* ===============================
   Socket.IO
================================ */

io.on("connection", (socket) => {

    console.log("🟢 User Connected");

    let currentRoom = "";

    /* ===============================
       Join Room
    ============================== */

    socket.on("join-room", (room) => {

        const roomUsers = io.sockets.adapter.rooms.get(room);

        const size = roomUsers ? roomUsers.size : 0;

        if (size >= 2) {

            socket.emit("room-full");

            return;

        }

        currentRoom = room;

        socket.join(room);

        socket.emit("room-joined", room);

        socket.to(room).emit("partner-joined");

        console.log(`${socket.id} joined ${room}`);

    });

    /* ===============================
       Offer
    ============================== */

    socket.on("offer", (data) => {

        socket.to(data.room).emit(

            "offer",

            data

        );

    });

    /* ===============================
       Answer
    ============================== */

    socket.on("answer", (data) => {

        socket.to(data.room).emit(

            "answer",

            data

        );

    });

    /* ===============================
       ICE Candidate
    ============================== */

    socket.on("ice-candidate", (data) => {

        socket.to(data.room).emit(

            "ice-candidate",

            data

        );

    });

    /* ===============================
       Heart Reaction
    ============================== */

    socket.on("heart-reaction", (room) => {

        socket.to(room).emit(

            "heart-reaction"

        );

    });

    /* ===============================
       End Call
    ============================== */

    socket.on("end-call", (room) => {

        socket.to(room).emit(

            "call-ended"

        );

    });

    /* ===============================
       Leave Room
    ============================== */

    socket.on("leave-room", () => {

        if (!currentRoom) {

            return;

        }

        socket.leave(currentRoom);

        socket.to(currentRoom).emit(

            "partner-left"

        );

        currentRoom = "";

    });

    /* ===============================
       Disconnect
    ============================== */

    socket.on("disconnect", () => {

        console.log("🔴 User Disconnected");

        if (currentRoom) {

            socket.to(currentRoom).emit(

                "partner-left"

            );

        }

    });

});

/* ===============================
   Server
================================ */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("");

    console.log("❤️ LoveBooth Server Running!");

    console.log(`🌐 http://localhost:${PORT}`);

    console.log("");

});