const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const muteAudioButton = document.getElementById('muteAudioButton');
const muteVideoButton = document.getElementById('muteVideoButton');

let localStream;
let peerConnection;

startButton.addEventListener('click', startCall);
stopButton.addEventListener('click', stopCall);
muteAudioButton.addEventListener('click', toggleAudio);
muteVideoButton.addEventListener('click', toggleVideo);

async function startCall() {
    try {
        const peer = new Peer(); // You can add your own PeerJS API key here

        peer.on('open', async (peerId) => {
            console.log('My peer ID:', peerId);

            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;

            peerConnection = new RTCPeerConnection();
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            peerConnection.ontrack = event => {
                remoteVideo.srcObject = event.streams[0];
            };

            const call = peer.call(peerId, localStream);

            // Handle incoming call
            peer.on('call', incomingCall => {
                incomingCall.answer(localStream);
                incomingCall.on('stream', remoteStream => {
                    remoteVideo.srcObject = remoteStream;
                });
            });
        });

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

function stopCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
        peerConnection.close();
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function toggleAudio() {
    if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => track.enabled = !track.enabled);
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => track.enabled = !track.enabled);
    }
}

