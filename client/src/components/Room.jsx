import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "@/utils/api"

const Room = () => {
  const navigate = useNavigate();
  const { roomID } = useParams();
  
  // Refs
  const userVideo = useRef(null);
  const userStream = useRef(null);
  const partnerVideo = useRef(null);
  const peerRef = useRef(null);
  const webSocketRef = useRef(null);

  // State
  const [hasPartner, setHasPartner] = useState(false);

  // --- WEBRTC LOGIC (UNTOUCHED) ---
  const openCamera = async () => {
    const constraints = { audio: false, video: true };
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch(err){
      console.error("Camera access error:", err)
    }
  };

  useEffect(() =>{
    let isMounted = true;
    const initializeRoom = async () => {
        console.log("initialising room...")
        try {
            await api.post(`/room/verify/${roomID}`);
            const ticketResponse = await api.post(`/room/ticket/${roomID}`);
            const { ticket } = ticketResponse.data;
            if (!isMounted) return;

            console.log("ticket", ticketResponse.data)

            const stream = await openCamera();
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            userStream.current = stream;

            setTimeout(() => {
                connectWebSocket(ticket);
            }, 100);
        } catch (err) {
            navigate('/room/create'); 
        }
    };

    const connectWebSocket = (ticket) => {
        console.log("---------helo-------------")
        webSocketRef.current = new WebSocket(
          `wss://supersensuously-frankable-arnold.ngrok-free.dev/api/v1/room/ws/${ticket}`
        );
        webSocketRef.current.addEventListener("open", () => {
          console.log("join??/")
          webSocketRef.current.send(JSON.stringify({join: "true"}))
        });
        webSocketRef.current.addEventListener("message", async (e) =>{
          const message = JSON.parse(e.data);
          if(message.join) callUser();
          if(message.offer) handleOffer(message.offer);
          if(message.answer){
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
          }
          if (message.iceCandidate) {
              try {
                  await peerRef.current.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
              } catch (err) {
                  console.error(err);
              }
          }
        });
    };
    initializeRoom();
    return () => { isMounted = false; };
  }, [roomID]);

  const callUser = async () => {
      console.log("calling user...")
      if (peerRef.current) return; 
      peerRef.current = createPeer();
      if (userStream.current) {
          userStream.current.getTracks().forEach(track => {
              peerRef.current.addTrack(track, userStream.current);
          });
      }
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      webSocketRef.current.send(JSON.stringify({ offer }));
  };

  const handleOffer = async (offer) => {
    console.log("recieved offer, giving answer")
    if (!peerRef.current) {
      peerRef.current = createPeer();
      if (userStream.current) {
        userStream.current.getTracks().forEach((track) => {
          peerRef.current.addTrack(track, userStream.current);
        });
      }
    }
    if (peerRef.current.signalingState !== "stable") return;
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    webSocketRef.current.send(JSON.stringify({ answer: peerRef.current.localDescription }));
  };

  const createPeer = () => {
      console.log("creating a peer conn :))")
      const peer = new RTCPeerConnection({ iceServers: [{urls: "stun:stun.l.google.com:19302"}] });
      peer.onicecandidate = handleIceCandidateEvent;
      peer.ontrack = handleTrackEvent;
      return peer
  };

  const handleIceCandidateEvent = (e) => {
      console.log("ICEEE")
      if(e.candidate) webSocketRef.current.send(JSON.stringify({iceCandidate: e.candidate}));
      console.log(e.candidate)
  }

  const handleTrackEvent = (e) => {
      console.log("recieving tracks: )")
      setHasPartner(true); 
      setTimeout(() => {
        if (partnerVideo.current) {
          if (e.streams && e.streams[0]) {
              partnerVideo.current.srcObject = e.streams[0];
          } else {
              const inboundStream = new MediaStream([e.track]);
              partnerVideo.current.srcObject = inboundStream;
          }
        }
      }, 100);
  };

  // --- UI RENDER ---
  return (
    <div className="flex flex-row items-center justify-center gap-6 h-full w-full">
      {/* My Video Card */}
      <div className="w-1/2 aspect-video border-4 border-black bg-white shadow-[8px_8px_0px_0px_black] overflow-hidden">
        <video ref={userVideo} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>

      {/* Partner Video Card */}
      {hasPartner && (
        <div className="w-1/2 aspect-video border-4 border-black bg-white shadow-[8px_8px_0px_0px_black] overflow-hidden">
          <video ref={partnerVideo} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}

export default Room