import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/SideBar"
import RightSidebar from '@/components/RightSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PomodoroClock from "@/components/PomodoroClock"
import { useEffect, useState } from "react" 
import { LogOut, Copy, Check } from 'lucide-react' 
import { Button } from "@/components/ui/button"
import { useRoom } from "@/context/RoomContext" // Import your new context hook
import { usePomodoro } from "@/context/PomodoroContext"
import LeftSidebar from "@/components/LeftSidebar"

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leaveRoom } = useRoom(); // Get cleanup function from context

  const [copied, setCopied] = useState(false);
  const {isActive, isBreak} = usePomodoro();

  const isFocusing = isActive && !isBreak;

  useEffect(() => {
    console.log("current user is focusing: ", isFocusing)
  }, [isFocusing])

  const isRoomActive = location.pathname.includes('/room/');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Navbar />

    
        <div className="flex w-full h-full overflow-hidden">
          
          {/* Sidebar hides during Focus Mode */}
            <aside 
                className={`
                  transition-all duration-500 ease-in-out border-r-2  border-black bg-white
                  ${isFocusing ? 'w-0 opacity-0' : 'w-65 opacity-100'}
                `}
              >
                {/* Important: The content inside needs a fixed width 
                  so it doesn't "squish" while the parent shrinks.
                */}
                <div className="">
                  <LeftSidebar />
                </div>
              </aside>
        
          
            <div className="flex  layout-wrapper flex-row flex-1 overflow-hidden ">

      
              
              <main className={`flex-1 main-content flex flex-col overflow-hidden relative transition-colors duration-300 ${isFocusing ? 'bg-graph-paper-red' : 'bg-graph-paper-blue'}`}>
                
                <div className={`flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center ${!isRoomActive ? 'justify-center' : 'justify-start'}`}>
                  
                  {/* Timer shown in center when not in a room */}
                  {!isRoomActive && (
                    <PomodoroClock />
                  )}

                  <div className={`${!isRoomActive ? 'mt-8' : 'h-full'} w-full max-w-5xl px-4 flex justify-center relative`}>
                    <div className="w-full">
                      <Outlet context={{ isFocusing }} />
                    </div>
                  </div>
                </div>

                {/* Footer Timer (Only shown when in a room) */}
                {isRoomActive && (
                  <footer className="w-full py-6 px-10 shrink-0 z-10 relative">
                    <div className="max-w-4xl mx-auto flex items-center justify-center relative">
                      <PomodoroClock />
                    </div>
                  </footer>
                )}

              </main>


              <aside 
                className={`
                  transition-all duration-500 ease-in-out border-r-2  border-black bg-white
                  ${isFocusing ? 'w-0 opacity-0' : 'w-50 opacity-100'}
                `}
              >
                {/* Important: The content inside needs a fixed width 
                  so it doesn't "squish" while the parent shrinks.
                */}
                <div className="">
                  <RightSidebar />
                </div>
              </aside>

              {/* Right Sidebar hides during Focus Mode */}
              {/* {!isFocusing && ( */}
                  {/* <aside className="flex overflow-hidden">  */}
                      {/* <RightNavSidebar className={`${isFocusing ? '' : 'is-open'}`} /> */}
                  {/* </aside> */}
                  
              {/* )} */}

            </div>
        </div>
    </div>
  )
}