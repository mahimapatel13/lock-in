import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/SideBar"
import RightNavSidebar from '@/components/RightNavSidebar'
import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'
import PomodoroClock from "@/components/PomodoroClock"

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen  w-full bg-white overflow-hidden">
      {/* Global Navbar */}
      <Navbar />

      <SidebarProvider className="w-full h-[calc(100vh-64px)]">
        <div className="flex w-full h-full overflow-hidden">
          <SideBar />
          
          <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden border-none rounded-none">
            <div className="flex flex-row flex-1 ">
              
              {/* Main content scrolls independently */}
              <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-10">
                {/* Outlet is where the child routes (Home, Room, etc) render */}
                <div className="flex flex-col w-full items-center justify-center h-full min-h-[60vh]">
                    <PomodoroClock />
                    <div className="mt-8 w-full">
                        hi
                    <Outlet /> {/* Your room routes will render below or around the clock */}
                    </div>
                </div>
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