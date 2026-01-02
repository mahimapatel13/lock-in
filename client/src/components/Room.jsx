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
      audio: true,
      video: cameras.length > 0
        ? { deviceId: cameras[0].deviceId }
        : true
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
            handleOffer(new RTCSessionDescription(message.offer));
          }

          if(message.answer){
            console.log("Receiving Answer");
            peerRef.current.setRemoteDescription(
              new RTCSessionDescription(message.answer)
            )
          }

          if (message.iceCandidate) {
            if (!peerRef.current || !peerRef.current.remoteDescription) {
                console.log("Buffered ICE Candidate");
                return; 
            }
            await peerRef.current.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
          }
        
        });
    };

    initializeRoom();

    return () => { isMounted = false; };
  }, [roomID]);




  //this fn ic being called somehow
  const handleOffer = async (offer) => {
    console.log("Received Offer, Creating Answer")

    // if(peerRef.current){
    //   console.log("PC exists.")
    // }else{
      peerRef.current = createPeer();
  
      console.log(offer)

      await peerRef.current.setRemoteDescription(
        offer
      );

      userStream.current.getTracks().forEach((track) => {
        peerRef.current.addTrack(track, userStream.current);
      });

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      console.log("local: ", peerRef.current.localDescription);     
      console.log("remote: ", peerRef.current.remoteDescription);
          
      webSocketRef.current.send(
        JSON.stringify({ answer: peerRef.current.localDescription})
      );
    // }
    
  }

const callUser = async () => {
    console.log("Calling Other User");
    peerRef.current = createPeer();

    userStream.current.getTracks().forEach((track) => {
        peerRef.current.addTrack(track, userStream.current);
    });

    const myOffer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(myOffer);
    webSocketRef.current.send(JSON.stringify({ offer: myOffer }));
};

  const createPeer = () => {
      console.log("Creating peer connection")
      const peer = new RTCPeerConnection({
        iceServers: [{urls: "stun:stun.l.google.com:19302"}]
      });

      peer.onnegotiationneeded = handleNegotiationNeeded;
      peer.onicecandidate = handleIceCandidateEvent;
      peer.ontrack= handleTrackEvent;
      peer.onsignalingstatechange = handleStateChange;

      return peer
  };

  const handleStateChange = () => {
      const state = peerRef.current?.signalingState;
      console.log("Signaling State:", state);
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
    console.log("Received Tracks")
    partnerVideo.current.srcObject = e.streams[0]
  }

  return (
    <div>
      <CountDownTimer/>
      <video autoPlay  controls={true} ref={userVideo}></video>
      <video autoPlay  controls={true} ref={partnerVideo}></video>
      
    </div>
  )
}

export default Room
