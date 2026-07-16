/* ==========================================
   LoveBooth v3.0
   backgrounds.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

window.bgCards = document.querySelectorAll(".bg-card");

/* ===============================
   Background
================================ */

window.selectedBackground = null;

/* ===============================
   Initialize
================================ */

window.addEventListener("load", loadBackground);

/* ===============================
   Select Background
================================ */

bgCards.forEach((card) => {
  card.addEventListener("click", () => {
    bgCards.forEach((bg) => {
      bg.classList.remove("active");
    });

    card.classList.add("active");

    selectedBackground = card.dataset.bg;

    localStorage.setItem(
      "lovebooth-background",

      selectedBackground,
    );

    applyPageBackground(selectedBackground);

    if (typeof showToast === "function") {
      showToast("Background Selected ❤️");
    }
  });
});

/* ===============================
   Page Background
================================ */

function applyPageBackground(name) {
  const pageClasses = ["page-bg-beach", "page-bg-sunset", "page-bg-sakura", "page-bg-cafe"];

  document.body.classList.remove(...pageClasses);

  if (name) {
    document.body.classList.add(`page-bg-${name.split(".")[0]}`);
  }
}

/* ===============================
   Load Background
================================ */

function loadBackground() {
  const saved = localStorage.getItem("lovebooth-background");

  if (!saved) {
    return;
  }

  selectedBackground = saved;

  bgCards.forEach((card) => {
    if (card.dataset.bg === selectedBackground) {
      card.classList.add("active");
    }
  });

  applyPageBackground(selectedBackground);
}

