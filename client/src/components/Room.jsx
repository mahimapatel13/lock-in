import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';
import { Button } from "@/components/ui/button";
import { LogOut, Copy, Check } from 'lucide-react';

export default function Room() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const { isFocusMode } = useOutletContext() || { isFocusMode: false };
  const { 
    initializeRoom, 
    createRoom, 
    leaveRoom, 
    hasPartner, 
    userVideoRef, 
    partnerVideoRef 
  } = useRoom();

  const [copied, setCopied] = useState(false);
  const lastInitializedRoom = useRef(null);

  const handleExitRoom = () => {
    leaveRoom();
    navigate('/home');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (roomID === "create") {
      createRoom()
        .then(id => navigate(`/room/${id}`, { replace: true }))
        .catch(() => navigate('/home'));
      return;
    }

    if (roomID && roomID !== "create" && lastInitializedRoom.current !== roomID) {
      lastInitializedRoom.current = roomID;
      initializeRoom(roomID);
    }

    return () => {
      if (lastInitializedRoom.current) {
        leaveRoom();
        lastInitializedRoom.current = null;
      }
    };
  }, [roomID]); 

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden bg-transparent">
      
      {/* ACTION BUTTONS */}
      <div className="absolute -top-4 right-0 flex flex-col gap-61 z-50 p-4">
        <Button 
          onClick={handleExitRoom} 
          variant="outline" 
          className="h-10 w-10 border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] hover:bg-red-500 hover:text-white transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          title="Exit Room"
        >
          <LogOut size={18} />
        </Button>

        {!hasPartner && !isFocusMode && (
          <Button 
            onClick={handleCopyLink} 
            variant="outline" 
            className="h-10 w-10 border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] hover:bg-[#A3E635] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            title="Copy Link"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </Button>
        )}
      </div>

      {/* VIDEO CONTAINER */}
      <div className="flex-1 flex mt-5 items-center justify-center gap-8 px-6 min-h-0">
        
        {/* Local User Video */}
        <div className="w-1/2 max-w-xl aspect-video border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_black] relative overflow-hidden">
          <video 
            ref={userVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover bg-zinc-900" 
          />
          <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase">
            You
          </div>
        </div>

        {/* Partner Video Slot */}
        <div className="w-1/2 max-w-xl aspect-video border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_black] relative overflow-hidden flex items-center justify-center">
          {hasPartner ? (
            <>
              <video 
                ref={partnerVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover bg-zinc-900" 
              />
              <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase">
                Partner
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center animate-pulse">
               <p className="font-black uppercase text-xs tracking-widest text-zinc-500">
                Waiting for partner...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}