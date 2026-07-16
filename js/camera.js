/* ==========================================
   LoveBooth v3.0
   camera.js
   Camera Control Module
========================================== */

"use strict";


/* ===============================
   DOM Elements
================================ */

window.openCameraBtn = document.getElementById("openCamera");
window.switchCameraBtn = document.getElementById("switchCamera");
window.localVideo = document.getElementById("localVideo");


/* ===============================
   Global Variables
================================ */

let currentFacingMode = "user";


/* ===============================
   Open Camera
================================ */

async function openCamera() {

    try {

        if (localStream && localStream.getVideoTracks().some(track => track.readyState === "live")) {
            if (localVideo) {
                localVideo.srcObject = localStream;
            }
            if (typeof enableCapture === "function") {
                enableCapture();
            }
            if (typeof showToast === "function") {
                showToast("Camera already open ❤️");
            }
            return;
        }

        // Stop old camera first
        if (localStream) {

            localStream.getTracks().forEach(track => {

                track.stop();

            });

        }


        // Request camera and microphone
        localStream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: currentFacingMode

            },

            audio: true

        });


        if (localVideo) {

            localVideo.srcObject = localStream;

        }


        console.log("📷 Camera Opened");

        if (typeof enableCapture === "function") {
            enableCapture();
        }

        if (typeof showToast === "function") {

            showToast("Camera Ready ❤️");

        }


    } catch (error) {

        console.error("Camera Error:", error);

        alert(
            "Unable to access camera.\n\nPlease allow camera permission."
        );

    }

}



/* ===============================
   Open Camera Button
================================ */

if (openCameraBtn) {

    openCameraBtn.addEventListener(
        "click",
        openCamera
    );

}



/* ==========================================
   Switch Camera
========================================== */

async function switchCamera() {


    try {


        // Change camera mode

        currentFacingMode =
            currentFacingMode === "user"
                ? "environment"
                : "user";



        // Stop current stream

        if (localStream) {

            localStream.getTracks().forEach(track => {

                track.stop();

            });

        }



        // Open new camera

        localStream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: currentFacingMode

            },

            audio: true

        });



        // Update video

        if (localVideo) {

            localVideo.srcObject = localStream;

        }



        // Update WebRTC camera track

        if (
            typeof peerConnection !== "undefined" &&
            peerConnection
        ) {


            const videoTrack =
                localStream.getVideoTracks()[0];



            const sender =
                peerConnection
                .getSenders()
                .find(sender =>
                    sender.track &&
                    sender.track.kind === "video"
                );



            if (sender && videoTrack) {

                await sender.replaceTrack(videoTrack);

            }

        }



        console.log("🔄 Camera Switched");


        if (typeof showToast === "function") {

            showToast("Camera Switched ❤️");

        }



    } catch (error) {


        console.error("Switch Camera Error:", error);


        currentFacingMode = "user";


        if (typeof showToast === "function") {

            showToast(
                "Only one camera available."
            );

        }


    }

}



/* ===============================
   Switch Camera Button
================================ */

if (switchCameraBtn) {

    switchCameraBtn.addEventListener(
        "click",
        switchCamera
    );

}



/* ==========================================
   Close Camera
========================================== */

function closeCamera() {


    if (!localStream) {

        return;

    }



    localStream.getTracks().forEach(track => {

        track.stop();

    });



    if (localVideo) {

        localVideo.srcObject = null;

    }



    localStream = null;


    console.log("📷 Camera Closed");



    if (typeof showToast === "function") {

        showToast("Camera Closed");

    }


}



/* ==========================================
   Restart Camera
========================================== */

async function restartCamera() {


    closeCamera();


    await openCamera();


}



/* ==========================================
   Check Camera Permission
========================================== */

async function checkCameraPermission() {


    try {


        const permission =
            await navigator.permissions.query({

                name: "camera"

            });



        console.log(
            "Camera Permission:",
            permission.state
        );



        if (permission.state === "denied") {


            alert(
                "Camera permission is blocked.\n\nEnable it in browser settings."
            );


        }



    } catch (error) {


        console.log(
            "Permission API not supported."
        );


    }


}



/* ==========================================
   Initialize
========================================== */

window.addEventListener(
    "load",
    checkCameraPermission
);



/* ==========================================
   Cleanup When Leaving
========================================== */

window.addEventListener(
    "beforeunload",
    closeCamera
);