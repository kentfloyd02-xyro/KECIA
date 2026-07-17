/* ==========================================
   LoveBooth v3.0
   call.js
   WebRTC + Socket.IO
========================================== */

"use strict";


/* ===============================
   Socket Connection
================================ */

const socket = io();


/* ===============================
   DOM Elements
================================ */

const roomCodeInput = document.getElementById("roomCode");
const joinRoomBtn = document.getElementById("joinRoom");

const startCallBtn = document.getElementById("startCall");
const endCallBtn = document.getElementById("endCall");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const toggleMicBtn = document.getElementById("toggleMic");
const toggleCameraBtn = document.getElementById("toggleCamera");


/* ===============================
   Global Variables
================================ */

let roomCode = "";

let peerConnection = null;

let localStream = null;

let remoteStream = new MediaStream();


/* ===============================
   STUN Servers
================================ */

const configuration = {

    iceServers: [

        {
            urls: "stun:stun.l.google.com:19302"
        },

        {
            urls: "stun:stun1.l.google.com:19302"
        }

    ]

};



/* ===============================
   Socket Events
================================ */

socket.on("connect", () => {

    console.log("✅ Connected:", socket.id);

    if(typeof showToast === "function"){

        showToast("Connected ❤️");

    }

});


socket.on("disconnect", () => {

    console.log("❌ Disconnected");

});



/* ===============================
   Remote Video
================================ */

remoteVideo.srcObject = remoteStream;



/* ===============================
   Join Room
================================ */

if(joinRoomBtn){

joinRoomBtn.addEventListener("click",()=>{


    roomCode = roomCodeInput.value.trim();


    if(roomCode === ""){

        alert("Enter room code");

        return;

    }


    socket.emit(
        "join-room",
        roomCode
    );


});

}



/* ===============================
   Joined Room
================================ */

socket.on("room-joined",(room)=>{


    roomCode = room;


    console.log(
        "🏠 Joined:",
        room
    );


});



/* ===============================
   Partner Joined
================================ */

socket.on(
"partner-joined",
async()=>{


    console.log(
        "❤️ Partner Joined"
    );


    await createPeerConnection();


});



/* ===============================
   Create Connection
================================ */

async function createPeerConnection(){


    if(peerConnection){

        return;

    }



    peerConnection =
        new RTCPeerConnection(
            configuration
        );



    console.log(
        "Peer Created"
    );



    if(!localStream){


        if(typeof openCamera === "function"){

            await openCamera();

        }


    }



    if(localStream){


        localStream
        .getTracks()
        .forEach(track=>{


            peerConnection.addTrack(
                track,
                localStream
            );


        });


    }



    peerConnection.ontrack=(event)=>{


        event.streams[0]
        .getTracks()
        .forEach(track=>{


            remoteStream.addTrack(track);


        });


        remoteVideo.srcObject =
            remoteStream;

        if (typeof enableCapture === "function") {
            enableCapture();
        }


    };



    peerConnection.onicecandidate=(event)=>{


        if(event.candidate){


            socket.emit(
                "ice-candidate",
                {

                    room:roomCode,

                    candidate:event.candidate

                }

            );


        }


    };



    peerConnection.onconnectionstatechange=()=>{


        console.log(
            "Connection:",
            peerConnection.connectionState
        );

        if (
            peerConnection.connectionState === "connected" ||
            peerConnection.connectionState === "completed"
        ) {
            if (typeof enableCapture === "function") {
                enableCapture();
            }
        }

    };


}



/* ===============================
   Start Call
================================ */

if(startCallBtn){

startCallBtn.addEventListener(
"click",
async()=>{


    if(!roomCode){

        alert(
            "Join room first"
        );

        return;

    }



    await createPeerConnection();



    const offer =
        await peerConnection.createOffer();



    await peerConnection.setLocalDescription(
        offer
    );



    socket.emit(
        "offer",
        {

            room:roomCode,

            offer:offer

        }

    );


});

}



/* ===============================
   Receive Offer
================================ */

socket.on(
"offer",
async(offer)=>{


    await createPeerConnection();



    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
    );



    const answer =
        await peerConnection.createAnswer();



    await peerConnection.setLocalDescription(
        answer
    );



    socket.emit(
        "answer",
        {

            room:roomCode,

            answer:answer

        }

    );


});



/* ===============================
   Receive Answer
================================ */

socket.on(
"answer",
async(answer)=>{


    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
    );


    console.log(
        "❤️ Connected"
    );


});



/* ===============================
   ICE Candidate
================================ */

socket.on(
"ice-candidate",
async(candidate)=>{


    if(peerConnection){


        await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
        );


    }


});



/* ===============================
   End Call
================================ */

if(endCallBtn){

endCallBtn.addEventListener(
"click",
()=>{


    socket.emit(
        "end-call",
        roomCode
    );


    closeConnection();


});

}



/* ===============================
   End From Partner
================================ */

socket.on(
"call-ended",
()=>{


    closeConnection();


});



function closeConnection(){


    if(peerConnection){


        peerConnection.close();

        peerConnection=null;


    }



    remoteStream =
        new MediaStream();


    remoteVideo.srcObject =
        remoteStream;



}



/* ===============================
   Mic Control
================================ */

function toggleMicrophone(){


    if(!localStream){

        return;

    }


    localStream
    .getAudioTracks()
    .forEach(track=>{


        track.enabled =
        !track.enabled;


    });


}



/* ===============================
   Camera Control
================================ */

function toggleLocalCamera(){


    if(!localStream){

        return;

    }


    localStream
    .getVideoTracks()
    .forEach(track=>{


        track.enabled =
        !track.enabled;


    });


}



if(toggleMicBtn){

toggleMicBtn.addEventListener(
"click",
toggleMicrophone
);

}



if(toggleCameraBtn){

toggleCameraBtn.addEventListener(
"click",
toggleLocalCamera
);

}