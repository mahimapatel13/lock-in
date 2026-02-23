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
      <div className="absolute -top-4 right-0 flex flex-col gap-48 z-50 p-4">
        <Button 
          onClick={handleExitRoom} 
          variant="outline" 
          className="h-10 w-10 border border-black/20 bg-white shadow-[3px_3px_0px_0px_black] hover:bg-red-500 hover:text-white transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          title="Exit Room"
        >
          <LogOut size={18} />
        </Button>

        {!hasPartner && !isFocusMode && (
          <Button 
            onClick={handleCopyLink} 
            variant="outline" 
            className="h-9 w-10 border hover:text-white border-black/20 bg-white shadow-[3px_3px_0px_0px_black] hover:bg-[#A3E635] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            title="Copy Link"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          </Button>
        )}
      </div>

      {/* VIDEO CONTAINER */}
      {/* VIDEO CONTAINER */}
<div className="flex-1 flex items-center justify-center gap-6 lg:gap-12 px-6 min-h-0 rounded-3xl  border-black/5 mx-4 mb-4">
  
  {/* Local User Video Frame */}
  <div className="w-1/2 max-w-[480px] group relative">
    {/* The Frame / Border effect */}
    <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border-2 border-black/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]">
      <video 
        ref={userVideoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover" 
      />
      {/* Label Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">
          You (Live)
        </div>
      </div>
    </div>
  </div>

  {/* Partner Video Slot Frame */}
  <div className="w-1/2 max-w-[480px] group relative">
    <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 border-black/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02] ${!hasPartner ? 'bg-zinc-100' : 'bg-zinc-900'}`}>
      {hasPartner ? (
        <>
          <video 
            ref={partnerVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-3 left-3">
            <div className="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-black/10">
              Partner
            </div>
          </div>
        </>
      ) : (

        // <div className="flex flex-col items-center justify-center animate-pulse">

        //        <p className="font-black uppercase text-xs tracking-widest text-zinc-500">

        //         Waiting for partner...

        //       </p>

        //     </div>
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          {/* <div className="w-12 h-12 rounded-full border-4 border-dashed animate-spin border-zinc-300 animate-spin-slow" /> */}
          <p className="font-black uppercase animate-pulse text-[10px] tracking-[0.2em] text-zinc-400">
            Waiting for partner...
          </p>
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  );
}