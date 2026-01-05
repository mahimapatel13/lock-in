// context/RoomContext.tsx
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const [hasPartner, setHasPartner] = useState(false);
  const userStream = useRef(null);
  const webSocketRef = useRef(null);
  // ... all your WebRTC logic from the previous Room.tsx goes here

  const leaveRoom = () => {
    if (userStream.current) userStream.current.getTracks().forEach(t => t.stop());
    if (webSocketRef.current) webSocketRef.current.close();
    // Reset states
  };

  return (
    <RoomContext.Provider value={{ hasPartner, userStream, leaveRoom, ... }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);