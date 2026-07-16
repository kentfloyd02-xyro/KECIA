/* ==========================================
   LoveBooth v3.0
   capture.js
   Part 1 - Initialization
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

window.canvas = document.getElementById("canvas");
window.captureBtn = document.getElementById("capture");
window.retakeBtn = document.getElementById("retake");

const ctx = canvas.getContext("2d");
window.ctx = ctx;

/* ===============================
   Captured Image
================================ */

window.capturedImage = null;

/* ===============================
   Canvas Size
================================ */

canvas.width = 1280;
canvas.height = 720;

/* ===============================
   Capture Button
================================ */

captureBtn.addEventListener("click", () => {
  if (typeof startCountdown === "function") {
    startCountdown();
  }
});

/* ==========================================
   LoveBooth v3.0
   Part 2 - Capture Photo
========================================== */

function getFormattedDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function drawWatermark() {
  const text = `${getFormattedDate()} • KECIA BOOTH`;
  const padding = 18;

  ctx.save();
  ctx.font = "28px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  const textWidth = ctx.measureText(text).width;
  const x = canvas.width / 2;
  const y = canvas.height - padding;

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(x - textWidth / 2 - padding / 2, y - 36, textWidth + padding, 40);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function getFrameStyle() {
  const style = window.selectedFrame || "classic";

  switch (style) {
    case "gold":
      return {
        frameColor: "#d4af37",
        panelColor: "#2c2b2a",
        labelColor: "#f8e1a9",
        labelText: "#2b1f0d",
      };
    case "blush":
      return {
        frameColor: "#f8c3d0",
        panelColor: "#231f20",
        labelColor: "#ffe9f0",
        labelText: "#8b2b3d",
      };
    default:
      return {
        frameColor: "#000000",
        panelColor: "#111111",
        labelColor: "#ffffff",
        labelText: "#111111",
      };
  }
}

function drawImageCover(source, x, y, width, height, targetCtx = ctx) {
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width || 0;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height || 0;

  if (!sourceWidth || !sourceHeight) {
    targetCtx.drawImage(source, x, y, width, height);
    return;
  }

  const ratio = sourceWidth / sourceHeight;
  const targetRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sWidth = sourceWidth;
  let sHeight = sourceHeight;

  if (ratio > targetRatio) {
    sWidth = Math.round(sourceHeight * targetRatio);
    sx = Math.round((sourceWidth - sWidth) / 2);
  } else {
    sHeight = Math.round(sourceWidth / targetRatio);
    sy = Math.round((sourceHeight - sHeight) / 2);
  }

  if (sWidth <= 0 || sHeight <= 0) {
    targetCtx.drawImage(source, x, y, width, height);
    return;
  }

  targetCtx.drawImage(source, sx, sy, sWidth, sHeight, x, y, width, height);
}

function drawPhotoFrame(bgImage = null, shots = []) {
  const style = getFrameStyle();

  ctx.fillStyle = "#090909";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImage) {
    ctx.globalAlpha = 0.18;
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  const framePadding = 30;
  const gap = 22;
  const contentX = framePadding;
  const contentY = framePadding;
  const contentW = canvas.width - framePadding * 2;
  const contentH = canvas.height - framePadding * 2;

  ctx.fillStyle = style.panelColor;
  ctx.fillRect(contentX, contentY, contentW, contentH);

  const cols = 3;
  const rows = 2;
  const cellW = Math.floor((contentW - gap * (cols - 1)) / cols);
  const cellH = Math.floor((contentH - gap) / rows);

  for (let col = 0; col < cols; col += 1) {
    const localX = contentX + col * (cellW + gap);
    const remoteX = localX;
    const localY = contentY;
    const remoteY = contentY + cellH + gap;
    const inset = 12;

    const localShot = shots[col] ? shots[col].local : null;
    const remoteShot = shots[col] ? shots[col].remote : null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(localX, localY, cellW, cellH);
    ctx.fillRect(remoteX, remoteY, cellW, cellH);

    ctx.strokeStyle = style.frameColor;
    ctx.lineWidth = 12;
    ctx.strokeRect(localX + 4, localY + 4, cellW - 8, cellH - 8);
    ctx.strokeRect(remoteX + 4, remoteY + 4, cellW - 8, cellH - 8);

    const localInnerX = localX + inset;
    const localInnerY = localY + inset;
    const remoteInnerX = remoteX + inset;
    const remoteInnerY = remoteY + inset;
    const innerW = cellW - inset * 2;
    const innerH = cellH - inset * 2;

    drawImageCover(localShot || localVideo, localInnerX, localInnerY, innerW, innerH);
    drawImageCover(remoteShot || localVideo, remoteInnerX, remoteInnerY, innerW, innerH);
  }

}

function restoreCapturedPhoto() {
  if (!capturedImage) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (typeof showToast === "function") {
      showToast("Photo restored ❤️");
    }
  };

  img.src = capturedImage;
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !event.repeat) {
    const tag = event.target.tagName.toLowerCase();

    if (tag !== "input" && tag !== "textarea") {
      event.preventDefault();
      restoreCapturedPhoto();
    }
  }
});

function capturePhoto() {
  if (!localVideo.srcObject) {
    alert("Open your camera first.");

    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (selectedBackground) {
    const bgImage = new Image();
    bgImage.onload = () => {
      drawPhotoFrame(bgImage);
      drawWatermark();

      capturedImage = canvas.toDataURL("image/png");

      if (typeof enableDownload === "function") {
        enableDownload();
      }

      if (typeof enableSave === "function") {
        enableSave();
      }

      retakeBtn.disabled = false;

      console.log("📸 Photo Captured");

      if (typeof showToast === "function") {
        showToast("Photo Captured ❤️");
      }
    };
    bgImage.src = "assets/backgrounds/" + selectedBackground;
    return;
  }

  drawPhotoFrame();
  drawWatermark();

  capturedImage = canvas.toDataURL("image/png");

  if (typeof enableDownload === "function") {
    enableDownload();
  }

  if (typeof enableSave === "function") {
    enableSave();
  }

  retakeBtn.disabled = false;

  console.log("📸 Photo Captured");

  if (typeof showToast === "function") {
    showToast("Photo Captured ❤️");
  }
}
/* ==========================================
   LoveBooth v3.0
   Part 3 - Retake
========================================== */

function retakePhoto() {
  ctx.clearRect(
    0,

    0,

    canvas.width,

    canvas.height,
  );

  /* ===============================
   Draw Selected Background
   ================================ */

  console.log("Capture background:", selectedBackground);

  if (selectedBackground) {
    const bgImage = new Image();

    bgImage.src = "assets/backgrounds/" + selectedBackground;

    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      if (typeof drawPhotoFrame === "function") {
        drawPhotoFrame();
      }
    };

    return;
  }

  capturedImage = null;

  if (typeof downloadBtn !== "undefined") {
    downloadBtn.disabled = true;
  }

  if (typeof showToast === "function") {
    showToast("Ready to take another photo!");
  }
}

retakeBtn.addEventListener(
  "click",

  retakePhoto,
);
