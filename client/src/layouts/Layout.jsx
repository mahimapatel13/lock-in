import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/SideBar"
import RightSidebar from '@/components/RightSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PomodoroClock from "@/components/PomodoroClock"
import { useEffect, useState } from "react" 
import { LogOut, Copy, Check } from 'lucide-react' 
import { Button } from "@/components/ui/button"
import { useRoom } from "@/context/RoomContext"
import { usePomodoro } from "@/context/PomodoroContext"
import LeftSidebar from "@/components/LeftSidebar"
import Footer from "@/components/Footer"

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leaveRoom } = useRoom();

  const [copied, setCopied] = useState(false);
  const { isActive, isBreak } = usePomodoro();

  const isFocusing = isActive && !isBreak;
  const isRoomActive = location.pathname.includes('/room/');

  useEffect(() => {
    console.log("current user is focusing: ", isFocusing)
  }, [isFocusing])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // 🔴 IMPORTANT: min-h-screen, NOT h-screen, and no overflow-hidden
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Navbar />

      {/* Main row */}
      <div className="flex flex-1 w-full">
        
        {/* Left Sidebar */}
        <aside 
          className={`
            transition-all duration-500 ease-in-out border-r-2 border-black bg-white
            ${isFocusing ? 'w-0 opacity-0' : 'w-65 opacity-100'}
          `}
        >
          <div>
            <LeftSidebar />
          </div>
        </aside>

        {/* Center + Right */}
        <div className="flex flex-row flex-1">

          {/* Main Content */}
          <main
            className={`
              flex-1 flex flex-col relative transition-colors duration-300
              ${isFocusing && !isRoomActive ? 'bg-graph-paper-red' : 'bg-graph-paper-blue'}
            `}
          >
            {/* Content wrapper */}
            <div className="">
              <div
                className={`
                  p-6 lg:p-10 flex flex-col items-center
                  ${!isRoomActive ? 'justify-center min-h-[calc(100vh-64px)]' : 'justify-center  min-h-[calc(10vh)] '}
                `}
              >
                {!isRoomActive && <PomodoroClock />}

                <div className={`w-full max-w-5xl px-4 flex justify-center `}>
                  <div className="w-full">
                    <Outlet context={{ isFocusing }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Room Footer Timer (inside main) */}
            {isRoomActive && (
              <div className="backdrop-blur-mdborder-t-2 border-black/60 shrink-0 z-10">
                <div className="mx-auto flex items-center justify-center py-12 ">
                  <PomodoroClock />
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside 
            className={`
              transition-all duration-500 ease-in-out border-l-2 border-black/50 bg-white
              ${isFocusing ? 'w-0 opacity-0' : 'w-50 opacity-100'}
            `}
          >
            <div>
              <RightSidebar />
            </div>
          </aside>

        </div>
      </div>

      {/* Global Footer (appears AFTER scrolling) */}
      {!(isFocusing && !isRoomActive) && <Footer />}
    </div>
  )
}