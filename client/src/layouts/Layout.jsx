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
      
              
              <main className={`flex-1 main-content flex flex-col overflow-hidden relative transition-colors duration-300 ${isFocusing && !isRoomActive ? 'bg-graph-paper-red' : 'bg-graph-paper-blue'}`}>
                
                {/* 1. Main Content / Video Area */}
                {/* We use flex-grow here so this section pushes the footer to the very bottom */}
                <div className={`flex-grow overflow-y-auto p-6 lg:p-10 flex flex-col items-center ${!isRoomActive ? 'justify-center' : 'justify-start'}`}>
                  
                  {!isRoomActive && <PomodoroClock />}

                  <div className={`w-full max-w-5xl px-4 flex justify-center relative ${isRoomActive ? 'flex-1' : 'mt-4'}`}>
                    <div className="w-full h-full">
                      <Outlet context={{ isFocusing }} />
                    </div>
                  </div>
                </div>

                {/* 2. Enhanced Footer Timer */}
                {isRoomActive && (
                  <footer className=" backdrop-blur-md border-t-2 border-black/60 shrink-0 z-10">
                    {/* Increased py-12 (vertical padding) and min-h to make the footer taller */}
                    <div className="mx-auto flex items-center justify-center py-12 min-h-70">
                      {/* Wrapping the clock in a scale transform if you want it physically larger */}
                      
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