import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

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
    openCamera().then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        console.log("------------------hii-------------------")

        webSocketRef.current = new WebSocket(
          `ws://localhost:8080/api/v1/room/join/roomID=${roomID}`
        );

        webSocketRef.current.addEventListener("open", () => {
          console.log("established ws conn")
          webSocketRef.current.send(JSON.stringify({join: "true"}))
        });

        webSocketRef.current.addEventListener("message", async (e) =>{
          const message = JSON.parse(e.data);

          if(message.join){
            console.log("user joined")
            callUser();
          }
          
          if(message.offer){
            console.log("accepting offer creating answer")
            handleOffer(message.offer)
          }

          if (message.answer){
            console.log("Receiving Answer");
            console.log("local: ", peerRef.current.localDescription);
            peerRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
            console.log("remote: ", peerRef.current.remoteDescription);

          }

          if(message.iceCandidate){
            console.log("Recieving and adding ice candidate");
            try{
              await peerRef.current.addIceCandidate(message.iceCandidate)
            }catch(err){
              console.log("Error receving ICE candidate", err)
            }
          }


          
        })
    });

  });


  //this fn ic being called somehow
  const handleOffer = async (offer) => {
    console.log("received offer creating answer")
   
    peerRef.current = createPeer();
  
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));

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
    
  }

  const callUser = () =>{
      console.log("Calling Other User");

      peerRef.current = createPeer();

      userStream.current.getTracks().forEach((track) => {
        peerRef.current.addTrack(track, userStream.current);
      });
    
  }

  const createPeer = () => {
      console.log("Creating peer connection")
      const peer = new RTCPeerConnection({
        iceServers: [{urls: "stun:stun.l.google.com:19302"}]
      });

      peer.onnegotiationneeded = handleNegotiationNeeded;
      peer.onicecandidate = handleIceCandidateEvent;
      peer.ontrack= handleTrackEvent;
      return peer
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
      <video autoPlay  controls={true} ref={userVideo}></video>
      <video autoPlay  controls={true} ref={partnerVideo}></video>
    </div>
  )
}

export default Room
