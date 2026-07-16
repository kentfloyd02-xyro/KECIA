/* ==========================================
   LoveBooth v3.0
   hearts.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

const heartContainer = document.getElementById("heartContainer");

const sendHeartBtn = document.getElementById("sendHeart");

/* ===============================
   Floating Heart
================================ */


function createHeart() {

    const heart = document.createElement("div");

    heart.className = "floating-heart";

    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * (window.innerWidth - 40) + "px";

    heart.style.fontSize = (18 + Math.random() * 20) + "px";

    heart.style.animationDuration = (4 + Math.random() * 2) + "s";

    heart.style.opacity = "0.92";

    heart.style.filter = "drop-shadow(0 0 14px rgba(255, 80, 160, 0.35))";

    heartContainer.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 7000);

}

/* ===============================
   Heart Burst
================================ */

function createHeartBurst(count = 20) {

    for (let i = 0; i < count; i++) {

        setTimeout(() => {

            createHeart();

        }, i * 100);

    }

}

/* ===============================
   Send Heart
================================ */

function sendHeart() {

    createHeartBurst(8);

    if (typeof socket !== "undefined" && roomCode) {

        socket.emit("heart-reaction", roomCode);

    }

}

/* ===============================
   Receive Heart
================================ */

if (typeof socket !== "undefined") {

    socket.on("heart-reaction", () => {

        createHeartBurst(15);

        if (typeof showToast === "function") {

            showToast("❤️ Your partner sent love!");

        }

    });

}

/* ===============================
   Capture Celebration
================================ */

document.addEventListener("photoCaptured", () => {

    createHeartBurst(10);

});

if (sendHeartBtn) {

    sendHeartBtn.addEventListener("click", sendHeart);

}