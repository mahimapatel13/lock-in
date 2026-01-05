import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar, 
} from "@/components/ui/sidebar"
import { Settings, User, LayoutDashboard, Lock, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBar() {
  const { open } = useSidebar();
  const location = useLocation();

  // Logic to check if the user is currently inside a room
  // This looks for any path starting with /room/ followed by an ID
  const isRoomActive = location.pathname.startsWith("/room/") && location.pathname !== "/room/join" && location.pathname !== "/room/create";

  return (
    <Sidebar className="sticky border-r-2 border-black h-[calc(100vh)] transition-all duration-500 ease-in-out">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full w-full"
          >
            {/* USER PROFILE SECTION */}
            <SidebarGroup>
              <SidebarGroupContent className="px-2 py-4">
                <div className="flex items-center gap-3 p-3 bg-main border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base">
                  <div className="h-10 w-10 rounded-full border-2 border-border bg-white flex items-center justify-center font-bold text-black shrink-0">
                    JD
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-sm truncate text-black">
                      John Doe
                    </span>
                    <span className="text-xs opacity-80 truncate">
                      @johndoe
                    </span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarContent>
              {/* APPLICATION GROUP */}
              <SidebarGroup className="bg-graph-paper">
                <SidebarGroupLabel className="text-black font-black uppercase text-[10px]">Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    
                    {/* CREATE ROOM: Locked if in a room */}
                    <SidebarMenuItem className="relative group">
                      {isRoomActive ? (
                        <div className="flex items-center gap-2 p-2 opacity-40 cursor-not-allowed w-full">
                          <Lock size={18} className="shrink-0" />
                          <span className="font-bold ">Create Room</span>
                          
                          {/* Floating Warning Tooltip */}
                          <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[9px] font-black uppercase whitespace-nowrap hidden group-hover:block z-50 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                             Exit current room to create one
                          </div>
                        </div>
                      ) : (
                        <SidebarMenuButton asChild>
                          <Link to="/room/create">
                            <LayoutDashboard />
                            <span className="font-bold">Create Room</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                    
                    {/* JOIN ROOM */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/room/join">
                          <Users size={18} />
                          <span className="font-bold">Join Room</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* COMMUNITIES */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/profile">
                          <User size={18} />
                          <span className="font-bold">Join Communities</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>               
                </SidebarGroupContent>
              </SidebarGroup>

              {/* SETTINGS GROUP */}
              <SidebarGroup className="bg-graph-paper h-full border-t-2 border-black/5">
                <SidebarGroupLabel className="text-black font-black uppercase text-[10px]">Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Settings size={18} />
                        <span className="font-bold">General Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <div className="p-4 text-[10px] font-black opacity-30 uppercase tracking-widest">v1.0.0</div>
            </SidebarFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Sidebar>
  )
}