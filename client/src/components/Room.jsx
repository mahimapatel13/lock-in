import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CountDownTimer from './CountDown'
import api from "@/utils/api"


const Room = () => {
  const navigate = useNavigate();
  const { roomID } = useParams();
  const wsRef = useRef(null);
  const userVideo = useRef();
  const userStream = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const webSocketRef = useRef();
  const openCamera = async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const cameras = allDevices.filter(
      (device) => device.kind === "videoinput"
    );

    const constraints = {
      audio: false,
      video: true
    };

    try {
      console.log("camm onnn")
      return await navigator.mediaDevices.getUserMedia(constraints);

    } catch(err){
      console.log("no cammm :(((")
      console.log(err)
    }
};

useEffect(() =>{
    let isMounted = true;

    const initializeRoom = async () => {
        try {
            await api.post(`/room/verify/${roomID}`);

            const ticketResponse = await api.post(`/room/ticket/${roomID}`);
            const { ticket } = ticketResponse.data;

            if (!isMounted) return;

            const stream = await openCamera();
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            setTimeout(() => {
                connectWebSocket(ticket);
            }, 100);

        } catch (err) {
            console.error("Can't enter room:", err);
            navigate('/room/create'); 
        }
    };

    const connectWebSocket = (ticket) => {
        console.log("------------------hii-------------------")

        webSocketRef.current = new WebSocket(
          `wss://supersensuously-frankable-arnold.ngrok-free.dev/api/v1/room/ws/${ticket}`
        );

        webSocketRef.current.addEventListener("open", () => {
          console.log("sending..")
          webSocketRef.current.send(JSON.stringify({join: "true"}))
        });

        
        webSocketRef.current.addEventListener("message", async (e) =>{
          const message = JSON.parse(e.data);
          console.log(message)

          if(message.join){
            callUser();
          }

          if(message.offer){
            handleOffer(message.offer);
          }

          if(message.answer){
            console.log("Receiving Answer");
            await peerRef.current.setRemoteDescription(
                    new RTCSessionDescription(message.answer)
            );
          }

          if (message.iceCandidate) {
              try {
                  // Ensure it's a real RTCIceCandidate object
                  await peerRef.current.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
                  console.log("Successfully added ICE candidate");
              } catch (err) {
                  console.error("Error adding ICE candidate", err);
              }
          }
                  
        });
    };

    initializeRoom();

    return () => { isMounted = false; };
  }, [roomID]);




  // //this fn ic being called somehow
  // const handleOffer = async (offer) => {
  //   console.log("Received Offer, Creating Answer")

  //   // if(peerRef.current){
  //   //   console.log("PC exists.")
  //   // }else{
  //     peerRef.current = createPeer();
  
  //     console.log(offer)

  //     await peerRef.current.setRemoteDescription(
  //       offer
  //     );

  //     userStream.current.getTracks().forEach((track) => {
  //       peerRef.current.addTrack(track, userStream.current);
  //     });

  //     const answer = await peerRef.current.createAnswer();
  //     await peerRef.current.setLocalDescription(answer);

  //     console.log("local: ", peerRef.current.localDescription);     
  //     console.log("remote: ", peerRef.current.remoteDescription);
          
  //     webSocketRef.current.send(
  //       JSON.stringify({ answer: peerRef.current.localDescription})
  //     );
  //   // }
    
  // }


const callUser = async () => {
    if (peerRef.current) return; // Prevent double creation
    
    peerRef.current = createPeer();
    
    // Ensure stream tracks are added before creating the offer
    if (userStream.current) {
        userStream.current.getTracks().forEach(track => {
            peerRef.current.addTrack(track, userStream.current);
        });
    }
    
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    
    webSocketRef.current.send(JSON.stringify({ offer }));
};

  // const callUser = async () => {
  //   if (peerRef.current) return; // Don't create if it exists
  //   peerRef.current = createPeer();
    
  //   userStream.current.getTracks().forEach((track) => {
  //     peerRef.current.addTrack(track, userStream.current);
  //   });
  //   // Negotiation will be triggered by onnegotiationneeded or manual offer
  // };

  const handleOffer = async (offer) => {
    if (!peerRef.current) {
      peerRef.current = createPeer();
      userStream.current.getTracks().forEach((track) => {
        peerRef.current.addTrack(track, userStream.current);
      });
    }

    // Check if signaling state allows setting remote description
    if (peerRef.current.signalingState !== "stable") {
      // If we are already in the middle of an offer, we must resolve glare
      // For now, let's just log it
      console.log("Signaling state not stable, ignoring offer to prevent glare");
      return;
    }

    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    
    webSocketRef.current.send(JSON.stringify({ answer: peerRef.current.localDescription }));
  };

  const createPeer = () => {
      console.log("Creating peer connection")
      const peer = new RTCPeerConnection({
        iceServers: [{urls: "stun:stun.l.google.com:19302"}]
      });

      // peer.onnegotiationneeded = handleNegotiationNeeded;
      peer.onicecandidate = handleIceCandidateEvent;
      peer.ontrack= handleTrackEvent;
      peer.onsignalingstatechange = handleStateChange;

      peer.oniceconnectionstatechange = () => {
          console.log("ICE Connection State:", peer.iceConnectionState);
          if (peer.iceConnectionState === "connected") {
              console.log("VIDEO SHOULD BE VISIBLE NOW!");
          }
      };

      return peer
  };

  const handleStateChange = () => {
      const state = peerRef.current?.signalingState;
      console.log("Signaling State:", state);
      if (peerRef.current.iceConnectionState === "connected") {
        console.log("VIDEO SHOULD BE VISIBLE NOW!");
    }
  };

  const handleNegotiationNeeded = async() => {
    console.log("Creating Offer")

    try {
      const myOffer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(myOffer);

      webSocketRef.current.send(
        JSON.stringify({ offer: peerRef.current.localDescription})
      );
    }catch (err){
      console.log(err)
    }
  }

  const handleIceCandidateEvent = (e) => {
      console.log("found ice candidate");

      if(e.candidate){
        console.log(e.candidate)
        webSocketRef.current.send(
          JSON.stringify({iceCandidate: e.candidate})
        );
      }
  }

const handleTrackEvent = (e) => {
    console.log("Received Tracks:", e.track.kind, e.streams);
    
    // Check if we have a stream, if not, create one
    if (e.streams && e.streams[0]) {
        partnerVideo.current.srcObject = e.streams[0];
    } else {
        // Fallback: Create a new MediaStream and add the track to it
        console.log("No stream found, creating one from track");
        const inboundStream = new MediaStream([e.track]);
        partnerVideo.current.srcObject = inboundStream;
    }
};

  return (
    <div>
      <CountDownTimer/>
      <video autoPlay  controls={true} ref={userVideo}></video>
      <video autoPlay  controls={true} ref={partnerVideo}></video>
      
    </div>
  )
}

export default Room
