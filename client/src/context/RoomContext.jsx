import React, { createContext, useContext, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const navigate = useNavigate();
  const [hasPartner, setHasPartner] = useState(false);
  const isInitializing = useRef(false);
  
  const userVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const userStream = useRef(null);
  const peerRef = useRef(null);
  const webSocketRef = useRef(null);
  const activeRoomId = useRef(null);

  const leaveRoom = useCallback(() => {
    console.log("Cleanup: Closing all connections");
    if (userStream.current) {
      userStream.current.getTracks().forEach(track => track.stop());
      userStream.current = null;
    }
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    activeRoomId.current = null;
    isInitializing.current = false;
    setHasPartner(false);
  }, []);

  const createPeer = useCallback(() => {
    const peer = new RTCPeerConnection({
      
      iceServers: [
        { 
          urls: "stun:stun.l.google.com:19302"
        },
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: import.meta.env.VITE_TURN_PASS,
          credential: import.meta.env.VITE_TURN_USER,
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: import.meta.env.VITE_TURN_PASS,
          credential: import.meta.env.VITE_TURN_USER,
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: import.meta.env.VITE_TURN_PASS,
          credential: import.meta.env.VITE_TURN_USER,
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: import.meta.env.VITE_TURN_PASS,
          credential: import.meta.env.VITE_TURN_USER,
        },    
      ] 
    });
    
    peer.onicecandidate = (e) => {
      if (e.candidate && webSocketRef.current?.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify({ iceCandidate: e.candidate }));
      }
    };

    peer.ontrack = (e) => {
      console.log("📡 Received remote track:", e.streams[0]);
      setHasPartner(true);
      
      // Use a small timeout or a check to ensure the ref is ready
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = e.streams[0];
      } else {
        // Fallback: If the ref isn't ready, poll for it briefly
        const interval = setInterval(() => {
          if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = e.streams[0];
            clearInterval(interval);
          }
        }, 100);
      }
    };
    return peer;
  }, []);

  const handleJoin = useCallback(async () => {
    if (!userStream.current) return;
    peerRef.current = createPeer();
    userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    webSocketRef.current.send(JSON.stringify({ offer }));
  }, [createPeer]);

  const handleOffer = useCallback(async (offer) => {
    if (!userStream.current) return;
    if (!peerRef.current) peerRef.current = createPeer();
    userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    webSocketRef.current.send(JSON.stringify({ answer: peerRef.current.localDescription }));
  }, [createPeer]);

  const initializeRoom = useCallback(async (targetRoomID) => {
    if (isInitializing.current || activeRoomId.current === targetRoomID) return;
    
    isInitializing.current = true;
    activeRoomId.current = targetRoomID;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      userStream.current = stream;
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;

      await api.post(`/room/verify/${targetRoomID}`);
      const ticketRes = await api.post(`/room/ticket/${targetRoomID}`);
      const { ticket } = ticketRes.data;

      const ws = new WebSocket(import.meta.env.VITE_WS_URL +`/api/v1/room/ws/${ticket}`);
      webSocketRef.current = ws;
      
      ws.onopen = () => ws.send(JSON.stringify({ join: "true" }));
      ws.onmessage = async (e) => {
        const message = JSON.parse(e.data);
        if (message.join) await handleJoin();
        if (message.offer) await handleOffer(message.offer);
        if (message.answer && peerRef.current) await peerRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
        if (message.iceCandidate && peerRef.current) await peerRef.current.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
      };
    } catch (err) {
      console.error("Room Init Error:", err);
      leaveRoom();
      navigate('/home');
    } finally {
      isInitializing.current = false;
    }
  }, [handleJoin, handleOffer, leaveRoom, navigate]);

  return (
    <RoomContext.Provider value={{
      hasPartner, userVideoRef, partnerVideoRef, initializeRoom, leaveRoom,
      createRoom: async () => (await api.post("/room/create")).data.room_id
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);