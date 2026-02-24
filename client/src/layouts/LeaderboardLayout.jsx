import RightSidebar from '@/components/RightSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import LeftSidebar from "@/components/LeftSidebar"
import Footer from '@/components/Footer'

export default function LeaderboardLayout() {
 

  return (

     <div className="flex flex-col min-h-screen w-full bg-white">
      <Navbar />

      {/* Main row */}
      <div className="flex flex-1 w-full">
        
        {/* Left Sidebar */}
        <aside 
          className={`
            transition-all duration-500 ease-in-out border-r-2 border-black bg-white
            w-65 opacity-100
          `}
        >
          <div>
            <LeftSidebar />
          </div>
        </aside>

        <div className="flex  layout-wrapper flex-row flex-1 overflow-hidden ">

      
              
              <main className="flex-1 main-content flex flex-col overflow-hidden relative transition-colors duration-300 bg-graph-paper-blue">
                      <Outlet  />
              </main>

       
           
          <aside 
            className={`
              transition-all duration-500 ease-in-out border-l-2 border-black/50 bg-white
             w-50 opacity-100
            `}
          >
            <div>
              <RightSidebar />
            </div>
          </aside>

        </div>
      </div>

    
    <Footer />
    </div>
  
  )
}