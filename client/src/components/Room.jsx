import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "@/utils/api"
import { LogOut } from 'lucide-react' 
import { Button } from "@/components/ui/button"

const Room = () => {
  const navigate = useNavigate();
  const { roomID: paramRoomID } = useParams();
  const [roomID, setRoomID] = useState(paramRoomID);
  const hasInitialized = useRef(false);
  
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

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let isMounted = true;

    const initialize = async () => {
        let currentRoomID = roomID;

        try {
            if (!currentRoomID) {
                const res = await api.post("/room/create");
                currentRoomID = res.data.room_id;
                if (isMounted) setRoomID(currentRoomID);
                navigate(`/room/${currentRoomID}`, { replace: true });
            }

            await api.post(`/room/verify/${currentRoomID}`);
            const ticketResponse = await api.post(`/room/ticket/${currentRoomID}`);
            const { ticket } = ticketResponse.data;
            if (!isMounted) return;

            const stream = await openCamera();
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            userStream.current = stream;

            setTimeout(() => {
                connectWebSocket(ticket);
            }, 100);
        } catch (err) {
            console.error("Initialization error:", err);
            if (isMounted) navigate('/home');
        }
    };

    const connectWebSocket = (ticket) => {
        webSocketRef.current = new WebSocket(
          `wss://supersensuously-frankable-arnold.ngrok-free.dev/api/v1/room/ws/${ticket}`
        );
        webSocketRef.current.addEventListener("open", () => {
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

    initialize();
    return () => {
      isMounted = false;
      console.log("Cleaning up Room...");

      // 1. Stop all camera tracks (Turns off the webcam light)
      if (userStream.current) {
        userStream.current.getTracks().forEach(track => {
          track.stop();
          console.log("Track stopped:", track.kind);
        });
      }

      // 2. Close the Peer Connection
      if (peerRef.current) {
        peerRef.current.close();
      }

      // 3. Close the WebSocket
      if (webSocketRef.current) {
        // 4 is the code for "Going Away"
        webSocketRef.current.close(1000, "User left the room");
      }
    };
  }, []);

  const callUser = async () => {
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
      const peer = new RTCPeerConnection({ iceServers: [{urls: "stun:stun.l.google.com:19302"}] });
      peer.onicecandidate = handleIceCandidateEvent;
      peer.ontrack = handleTrackEvent;
      return peer
  };

  const handleIceCandidateEvent = (e) => {
      if(e.candidate) webSocketRef.current.send(JSON.stringify({iceCandidate: e.candidate}));
  }

  const handleTrackEvent = (e) => {
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
    <div className="relative flex flex-row items-center justify-center gap-6 h-full w-full">
      
      {/* TINY EXIT BUTTON - Top Right Floating */}


      {/* My Video Card */}
      <div className="w-1/2 aspect-video border-3 border-black bg-white shadow-[5px_5px_0px_0px_black] overflow-hidden">
        <video ref={userVideo} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>

      {/* Partner Video Card */}
      {hasPartner && (
        <div className="w-1/2 aspect-video border-3 border-black bg-white shadow-[5px_5px_0px_0px_black] overflow-hidden">
          <video ref={partnerVideo} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}

export default Room