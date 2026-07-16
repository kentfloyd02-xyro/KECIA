/* ==========================================
   LoveBooth
   Module 2
   main.js
========================================== */

"use strict";

/* ===============================
   DOM Elements
================================ */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const darkBtn = document.getElementById("darkMode");
const openCameraBtn = document.getElementById("openCamera");
const captureBtn = document.getElementById("capture");
const downloadBtn = document.getElementById("download");
const saveBtn = document.getElementById("save");
const retakeBtn = document.getElementById("retake");
const frameCards = document.querySelectorAll(".frame-card");

const startBtn = document.getElementById("startBtn");

const countdown = document.getElementById("countdown");

const galleryContainer = document.getElementById("galleryContainer");

const toast = document.querySelector(".toast");

const loader = document.querySelector(".loader");

const modal = document.querySelector(".modal");

const previewImage = document.getElementById("previewImage");

const bgCards = document.querySelectorAll(".bg-card");


/* ===============================
   Global Variables
================================ */

let stream = null;

let capturedImage = null;

let selectedBackground = "None";

let selectedFrame = "classic";
window.selectedFrame = selectedFrame;


/* ===============================
   Initial Setup
================================ */

window.addEventListener("load", initializeApp);

function initializeApp(){

    captureBtn.disabled = true;

    downloadBtn.disabled = true;

    saveBtn.disabled = true;

    retakeBtn.disabled = true;

    loadFrameSelection();

    hideLoader();

}

function loadFrameSelection() {
    const saved = localStorage.getItem("lovebooth-frame");

    if (saved) {
        selectedFrame = saved;
        window.selectedFrame = selectedFrame;
    }

    frameCards.forEach((card) => {
        if (card.dataset.frame === selectedFrame) {
            card.classList.add("active");
        }
    });
}

function enableSave(){

    saveBtn.disabled = false;

}

retakeBtn.addEventListener("click", () => {

    if (typeof retakePhoto === "function") {

        retakePhoto();

    }

});

saveBtn.addEventListener("click", () => {

    if (typeof saveToGallery === "function") {

        saveToGallery();

    }

});

frameCards.forEach((card) => {
    card.addEventListener("click", () => {
        frameCards.forEach((frame) => frame.classList.remove("active"));

        card.classList.add("active");

        selectedFrame = card.dataset.frame;
        window.selectedFrame = selectedFrame;

        localStorage.setItem("lovebooth-frame", selectedFrame);

        if (typeof showToast === "function") {
            showToast("Frame style selected ❤️");
        }
    });
});


/* ===============================
   Toast Notification
================================ */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


/* ===============================
   Loader
================================ */

function showLoader(){

    loader.classList.remove("hidden");

}

function hideLoader(){

    loader.classList.add("hidden");

}


/* ===============================
   Image Preview Modal
================================ */

function openModal(image){

    previewImage.src = image;

    modal.classList.add("active");

}

modal.addEventListener("click",()=>{

    modal.classList.remove("active");

});


/* ===============================
   Utility Functions
================================ */

function enableCapture(){

    captureBtn.disabled = false;

}

function disableCapture(){

    captureBtn.disabled = true;

}

function enableDownload(){

    downloadBtn.disabled = false;

}

darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* ==========================================
   Event Listeners
========================================== */


/* ==========================================
   End of main.js
========================================== */