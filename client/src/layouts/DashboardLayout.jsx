import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/SideBar"
import RightNavSidebar from '@/components/RightNavSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PomodoroClock from "@/components/PomodoroClock"
import { useState } from "react" // Added useState
import { LogOut } from 'lucide-react' 
import { Button } from "@/components/ui/button"
import { Copy, Check } from 'lucide-react'


// ... inside DashboardLayout component

export default function DashboardLayout() {
  const navigate = useNavigate()  
  // --- EXIT LOGIC ---
  const handleExitRoom = () => {

    navigate('/home');
  };

  // ... inside DashboardLayout component
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };



  const location = useLocation();
  const isRoomActive = location.pathname.includes('/room/');

  // State to track if the timer is running
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Navbar />

      <SidebarProvider className="w-full h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          
          {/* Optionally hide sidebar during focus for a cleaner look */}
          {!isFocusMode && <SideBar />}
          
          <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden border-none rounded-none">
            <div className="flex flex-row flex-1 overflow-hidden ">
              
              {/* MAIN CONTENT AREA 
                  Swaps 'bg-background' (Blue) for 'bg-focus' (Muted Red) 
              */}
              <main className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-300 ${isFocusMode ? 'bg-graph-paper-red' : 'bg-graph-paper-blue'}`}>
                
                <div className={`flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center ${!isRoomActive ? 'justify-center' : 'justify-start'}`}>
                  
                  {/* Pass the setter to PomodoroClock to toggle focus mode */}
                  {!isRoomActive && (
                    <PomodoroClock onStateChange={(active) => setIsFocusMode(active)} />
                  )}

                    {/* Container for the Outlet content (Videos) */}
                    <div className={`
                      ${!isRoomActive ? 'mt-8' : 'h-full'} 
                      w-full max-w-5xl px-4 flex justify-center
                    `}>
                      <div className="w-full">
                        <Outlet context={{ isFocusMode }} />
                       {isRoomActive && (
                        <div className="absolute top-4 right-4 z-50">
                      <Button 
                        onClick={handleExitRoom}
                        variant="outline"
                        className="h-10 w-10 p-0 rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] hover:bg-red-500 hover:text-white transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                        title="Exit Room"
                      >
                        <LogOut size={18} />
                      </Button>
                    </div>
                       )}

                       {isRoomActive && !isFocusMode && (
                          <div className="absolute bottom-67 right-4 z-50">
                            <Button 
                              onClick={handleCopyLink}
                              variant="outline"
                              className="h-10 w-10 p-0 rounded-none border-2 border-black bg-white shadow-[3px_3px_0px_0px_black] hover:bg-main hover:text-black transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                              title="Copy Room Link"
                            >
                              {copied ? (
                                <Check size={18} className="text-green-600" />
                              ) : (
                                <Copy size={18} />
                              )}
                            </Button>
                          </div>
                        )}


                      </div>
                    </div>
                </div>

              {isRoomActive && (
                
                <footer className="w-full py-6 px-10 shrink-0 z-10 relative">

                  <div className="max-w-4xl mx-auto flex items-center justify-center relative">
                    
                    {/* Centered Clock */}
                    <PomodoroClock onStateChange={(active) => setIsFocusMode(active)} />

                     
                    
                  </div>
                  
                </footer>
              )}

              </main>

              {/* Hide right sidebar during focus */}
              {!isFocusMode && (
                <aside className="hidden lg:block w-50 border-l-2 border-black bg-white shrink-0">
                  <RightNavSidebar />
                </aside>
              )}

            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}