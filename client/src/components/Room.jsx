import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import CountDownTimer from './CountDown'

const Room = () => {
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
      return await navigator.mediaDevices.getUserMedia(constraints);

    } catch(err){
      console.log(err)
    }
};

useEffect(() =>{
    let isMounted = true;

    const initializeRoom = async () => {
        try {
            const response = await api.get(`/room/verify/${roomID}`);
            
            if (response.status === 200 && isMounted) {
                const stream = await openCamera();
                userVideo.current.srcObject = stream;
                userStream.current = stream;

                connectWebSocket();
            }
        } catch (err) {
            console.error("HTTP Verification failed:", err);
            navigate('/'); 
        }
    };

    const connectWebSocket = () => {
        console.log("------------------hii-------------------")

        webSocketRef.current = new WebSocket(
          `ws://localhost:8080/api/v1/room/join/${roomID}`
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
            peerRef.current.setRemoteDescription(
              new RTCSessionDescription(message.answer)
            )
          }

          if(message.iceCandidate){
            console.log("Receing and Adding Ice Candidate");
            try{
              await peerRef.current.addIceCandidate(
                message.iceCandidate
              );
            } catch (err){
              console.log("Error Receiving ICE Candidate", err);
            }
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

  const callUser = () =>{
      console.log("Calling Other User");

      // if(peerRef.current){
      //   console.log("PC exists.")
      // }else{
        peerRef.current = createPeer();

        userStream.current.getTracks().forEach((track) => {
          peerRef.current.addTrack(track, userStream.current);
        });
      // }
   
  }

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

  const handleStateChange = async() => {
    console.log("STATE________________CHANGE")
    switch (peerRef.signalingState) {
      case "stable":
        console.log("-----------------STABLE---------");
        break;
    }
  }

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
