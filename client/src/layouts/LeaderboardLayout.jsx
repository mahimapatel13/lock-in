import RightSidebar from '@/components/RightSidebar'
import Navbar from '@/components/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import LeftSidebar from "@/components/LeftSidebar"

export default function LeaderboardLayout() {
 

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Navbar />

    
        <div className="flex w-full h-full overflow-hidden">
          
          {/* Sidebar hides during Focus Mode */}
            <aside 
                className="transition-all duration-500 ease-in-out border-r-2  border-black bg-white w-65 opacity-100">
                {/* Important: The content inside needs a fixed width 
                  so it doesn't "squish" while the parent shrinks.
                */}
                <div className="">
                  <LeftSidebar />
                </div>
              </aside>
        
          
            <div className="flex  layout-wrapper flex-row flex-1 overflow-hidden ">

      
              
              <main className="flex-1 main-content flex flex-col overflow-hidden relative transition-colors duration-300 bg-graph-paper-blue">
                      <Outlet  />
              </main>


              <aside 
                className="transition-all duration-500 ease-in-out border-r-2  border-black bg-white w-50 opacity-100">
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