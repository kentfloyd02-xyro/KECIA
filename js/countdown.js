/* ==========================================
   LoveBooth v3.0
   countdown.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

window.countdown = document.getElementById("countdown");
window.countdownRemote = document.getElementById("countdownRemote");
const countdownElements = [window.countdown, window.countdownRemote].filter(Boolean);

/* ===============================
   Countdown State
================================ */

let isCountingDown = false;
let countdownTimer = null;
let sequenceShots = [];
let currentShotIndex = 0;
const totalShotCount = 3;

/* ===============================
   Start Countdown
================================ */

function startCountdown() {
  if (isCountingDown) {
    return;
  }

  if (!localVideo || !localVideo.srcObject) {
    alert("Open your camera first.");
    return;
  }

  isCountingDown = true;
  currentShotIndex = 0;
  sequenceShots = [];
  captureBtn.disabled = true;

  runShotCountdown();
}

function runShotCountdown() {
  let number = 3;

  countdownElements.forEach((element) => {
    element.style.display = "flex";
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
    element.textContent = number;
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "popCountdown .8s";
  });

  countdownTimer = setInterval(() => {
    number--;

    countdownElements.forEach((element) => {
      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation = "popCountdown .8s";
    });

    if (number > 0) {
      countdownElements.forEach((element) => {
        element.textContent = number;
      });
    } else if (number === 0) {
      countdownElements.forEach((element) => {
        element.textContent = "❤️";
      });
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
      captureShot();
    }
  }, 1000);
}

function captureShot() {
  const localShot = document.createElement("canvas");
  const remoteShot = document.createElement("canvas");
  localShot.width = canvas.width;
  localShot.height = canvas.height;
  remoteShot.width = canvas.width;
  remoteShot.height = canvas.height;

  const localCtx = localShot.getContext("2d");
  const remoteCtx = remoteShot.getContext("2d");

  drawImageCover(localVideo, 0, 0, localShot.width, localShot.height, localCtx);

  if (remoteVideo && remoteVideo.srcObject) {
    drawImageCover(remoteVideo, 0, 0, remoteShot.width, remoteShot.height, remoteCtx);
  } else {
    drawImageCover(localVideo, 0, 0, remoteShot.width, remoteShot.height, remoteCtx);
  }

  sequenceShots.push({ local: localShot, remote: remoteShot });
  currentShotIndex += 1;

  if (currentShotIndex < totalShotCount) {
    setTimeout(() => {
      runShotCountdown();
    }, 650);
  } else {
    countdownElements.forEach((element) => {
      element.style.display = "none";
    });
    isCountingDown = false;
    captureBtn.disabled = false;
    finalizeSequence();
  }
}

function finalizeSequence() {
  if (selectedBackground) {
    const bgImage = new Image();
    bgImage.onload = () => {
      drawPhotoFrame(bgImage, sequenceShots);
      drawWatermark();
      saveFinalCapture();
    };
    bgImage.src = "assets/backgrounds/" + selectedBackground;
  } else {
    drawPhotoFrame(null, sequenceShots);
    drawWatermark();
    saveFinalCapture();
  }
}

function saveFinalCapture() {
  capturedImage = canvas.toDataURL("image/png");

  if (typeof enableDownload === "function") {
    enableDownload();
  }

  if (typeof enableSave === "function") {
    enableSave();
  }

  retakeBtn.disabled = false;

  if (typeof showToast === "function") {
    showToast("Photo Captured ❤️");
  }

  document.dispatchEvent(new Event("photoCaptured"));
}

/* ===============================
   Reset Countdown
================================ */

function resetCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  countdownElements.forEach((element) => {
    element.style.display = "none";
    element.textContent = "3";
  });

  isCountingDown = false;
}
