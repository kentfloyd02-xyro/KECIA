/* ==========================================
   LoveBooth v3.0
   download.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

window.downloadBtn = document.getElementById("download");

/* ===============================
   Download Photo
================================ */

function downloadPhoto() {
  if (!capturedImage) {
    if (typeof showToast === "function") {
      showToast("Capture a photo first!");
    }

    return;
  }

  const now = new Date();

  const filename =
    "LoveBooth_" +
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    "-" +
    String(now.getMinutes()).padStart(2, "0") +
    "-" +
    String(now.getSeconds()).padStart(2, "0") +
    ".png";

  const link = document.createElement("a");

  link.href = capturedImage;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  if (typeof showToast === "function") {
    showToast("Photo Downloaded ❤️");
  }
}

/* ===============================
   Download Button
================================ */

downloadBtn.addEventListener(
  "click",

  downloadPhoto,
);
