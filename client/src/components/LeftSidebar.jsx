
import { Button } from "@/components/ui/button"
import { Music, Palette } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User, LayoutDashboard,ChartColumn , Trophy, Lock, Clock, Users } from "lucide-react"
import { usePomodoro } from "@/context/PomodoroContext";
import { useEffect,  } from "react";
import { useLocation, Link } from "react-router-dom";

const LeftSidebar = () => {

  const location = useLocation();
  const isRoomActive = location.pathname.includes('/room/');
  return (
  <div className="w-65 h-screen overflow-visible bg-graph-paper border-black/50 sticky text-[14px] flex flex-col border-r-2">
      

      {/* section for joining and creating room/communities */}
        <div className=" flex flex-col gap-3 px-2 py-4 h-80 border-b-2 border-black/50 overflow-visible">
          <div className="text-black/75 font-bold decoration-2 underline underline-offset-5 text-center text-sm uppercase pb-4">
                Application
              </div>

              <div className="flex flex-1 flex-col" >
                <Link to="/home" className="flex">
                  <Clock size={18} />
                  <span className=" pl-2 hover:text-black text-black/70 ">Pomodoro</span>
                </Link>
              </div>
              {isRoomActive ? (

                <div className="flex flex-1 flex-col" >

                  <TooltipProvider>
                  <Tooltip className="relative group">
                    <TooltipTrigger className="flex items-center gap-2 opacity-40 cursor-not-allowed w-full">
                      <Lock size={18} className="shrink-0"/>
                      <span  className="font-bold">Create Room</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="absolute right-3 -top-2 ml-4 px-2 py-1 bg-black text-white text-[9px] font-black uppercase whitespace-nowrap hidden group-hover:block z-50 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        Exit current room to create one
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                
                </div>
                
              ) : (
                <div className="flex flex-1 flex-col" >
                  <Link to="/room/create" className="flex">
                    <LayoutDashboard size={18}/>
                    <div className=" pl-2 text-black/70 hover:text-black  text-center ">Create Room </div>
                  </Link>
                </div>
              )}

              {isRoomActive ? (

                <div className="flex flex-1 flex-col" >

                  <TooltipProvider>
                  <Tooltip className="relative group">
                    <TooltipTrigger className="flex items-center gap-2 opacity-40 cursor-not-allowed w-full">
                      <Users size={18} />
                      <span  className="font-bold">Join Room</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="absolute right-3 -top-2 ml-4 px-2 py-1 bg-black text-white text-[9px] font-black uppercase whitespace-nowrap hidden group-hover:block z-50 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        Exit current room to join another room
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                
                </div>
    
                
              ) : (
                <div className="flex flex-1 flex-col" >
                  <Link to="/room/create" className="flex">
                    <Users size={18} />
                    <span className=" pl-2 hover:text-black  text-black/70 ">Join Room</span>
                  </Link>
                </div>
              )}

              <div className="flex flex-1 flex-col" >
                <Link to="/report" className="flex">
                  <ChartColumn size={18} />
                  <span className=" pl-2 hover:text-black text-black/70 ">Report</span>
                </Link>
              </div>

              <div className="flex flex-1 flex-col" >
                <Link to="/leaderboard" className="flex">
                  <Trophy size={18} />
                  <span className=" pl-2 hover:text-black text-black/70 ">Leaderboard</span>
                </Link>
              </div>

              <div className="flex flex-1 flex-col" >
                <Link to="/community" className="flex">
                  <Users size={18} />
                  <span className=" pl-2 hover:text-black  text-black/70 ">Join Communities</span>
                </Link>
              </div>


          </div>


          {/* // settings */}
          <div className=" flex flex-col gap-3 px-2 py-4 h-30 border-black/50 border-b-2">
              
              <div className="text-black/75 font-bold decoration-2 underline underline-offset-5 text-center text-sm uppercase pb-4">
                Settings
              </div>
              <div className="flex flex-1 flex-col" >
                  <Link to="/room/create" className="flex">
                    <Settings size={18} />
                    <span className=" pl-2 text-black/70 hover:text-black ">General Settings</span>
                  </Link>
                </div>

          </div>
      </div>
    )
  
}

export default LeftSidebar
