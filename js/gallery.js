/* ==========================================
   LoveBooth v3.0
   gallery.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

window.galleryContainer = document.getElementById("galleryContainer");

/* ===============================
   Gallery Storage
================================ */

let galleryImages = [];

/* ===============================
   Initialize Gallery
================================ */

window.addEventListener("load", loadGallery);

/* ===============================
   Save Current Photo
================================ */

function saveToGallery() {
  if (!capturedImage) {
    showToast("No photo captured.");

    return;
  }

  galleryImages.unshift(capturedImage);

  localStorage.setItem(
    "lovebooth-gallery",

    JSON.stringify(galleryImages),
  );

  renderGallery();
}

/* ===============================
   Load Gallery
================================ */

function loadGallery() {
  const savedGallery = localStorage.getItem("lovebooth-gallery");

  if (savedGallery) {
    galleryImages = JSON.parse(savedGallery);
  }

  renderGallery();
}

/* ===============================
   Render Gallery
================================ */

function renderGallery() {
  galleryContainer.innerHTML = "";

  if (galleryImages.length === 0) {
    galleryContainer.innerHTML = "<p>No memories yet ❤️</p>";

    return;
  }

  galleryImages.forEach((image, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";

    const img = document.createElement("img");
    img.src = image;
    img.alt = "LoveBooth Memory";

    img.addEventListener("click", () => {
      openGalleryImage(image);
    });

    const buttonRow = document.createElement("div");
    buttonRow.className = "photo-info";

    const useBtn = document.createElement("button");
    useBtn.className = "view-btn";
    useBtn.textContent = "Use";
    useBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      useGalleryImage(image);
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "delete-btn";
    removeBtn.textContent = "Delete";
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deletePhoto(index);
    });

    buttonRow.appendChild(useBtn);
    buttonRow.appendChild(removeBtn);

    card.appendChild(img);
    card.appendChild(buttonRow);

    galleryContainer.appendChild(card);
  });
}

function useGalleryImage(image) {
  const preview = new Image();
  preview.onload = () => {
    if (!window.ctx || !window.canvas) {
      return;
    }

    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
    window.ctx.drawImage(preview, 0, 0, window.canvas.width, window.canvas.height);
    window.capturedImage = window.canvas.toDataURL("image/png");

    if (typeof enableDownload === "function") {
      enableDownload();
    }

    if (typeof enableSave === "function") {
      enableSave();
    }

    if (typeof showToast === "function") {
      showToast("Photo loaded from gallery.");
    }
  };

  preview.src = image;
}

/* ===============================
   Delete Photo
================================ */

function deletePhoto(index) {
  galleryImages.splice(index, 1);

  localStorage.setItem(
    "lovebooth-gallery",

    JSON.stringify(galleryImages),
  );

  renderGallery();

  showToast("Photo deleted.");
}

/* ===============================
   Open Preview
================================ */

function openGalleryImage(image) {
  if (typeof openModal === "function") {
    openModal(image);
  }
}
