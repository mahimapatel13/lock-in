import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/SideBar"
import RightNavSidebar from '@/components/RightNavSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import PomodoroClock from "@/components/PomodoroClock"

export default function DashboardLayout() {
  const location = useLocation();
  
  // Detect if we are currently in a room
  // This helps us toggle the layout from "Centered" to "Room Mode"
  const isRoomActive = location.pathname.includes('/room/');

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {/* Global Navbar */}
      <Navbar />

      <SidebarProvider className="w-full h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          <SideBar />
          
          <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden border-none rounded-none">
            <div className="flex flex-row flex-1 overflow-hidden ">
              
              {/* Main Content Area */}
              <main className="flex-1 flex flex-col bg-background overflow-hidden relative">
                
                {/* 1. CONTENT STAGE 
                  If a room is active, this fills the top. 
                  If no room, this is where 'hi' or other dashboard content lives.
                */}
                <div className={`flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center ${!isRoomActive ? 'justify-center' : 'justify-start'}`}>
                  
                  {/* When no room is active, show the clock centered */}
                  {!isRoomActive && <PomodoroClock />}

                  <div className={`w-full ${!isRoomActive ? 'mt-8' : 'h-full'}`}>
                    <Outlet />
                  </div>
                </div>

                {/* 2. PERSISTENT POMODORO FOOTER 
                  Only show here when a room is active. It stays pinned to the bottom.
                */}
                {isRoomActive && (
                  <footer className="w-full border-t-4 border-black bg-graph-paper-blue py-6 px-10 shrink-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <div className="max-w-4xl mx-auto">
                      <PomodoroClock />
                    </div>
                  </footer>
                )}

              </main>

              {/* Right Sidebar */}
              <aside className="hidden lg:block w-50 border-l-2 border-black bg-white shrink-0">
                <RightNavSidebar />
              </aside>

            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}