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
} from "@/components/ui/sidebar"
import { Settings, User, LayoutDashboard } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";


export default function SideBar() {
    const navigate = useNavigate()
  return (
    
    <Sidebar className="sticky border-r-2 border-black  h-[calc(100vh)] ">
      {/* <SidebarHeader className="p-4.5">
        <div className="flex justify-center items-center "> */}
          {/* The Logo: A simple bold square */}
          {/* <div className="
            flex h-10 w-10 shrink-0 items-center justify-center 
            bg-main border-2 border-black 
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            font-black text-xl
          ">
            L
          </div> */}

          {/* The Text: Bold but not screaming */}

        {/* </div>
      </SidebarHeader> */}

      <SidebarGroup className="">
        <SidebarGroupContent className=" px-2 py-4">
          <div className="flex items-center gap-3 p-3 bg-main border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-base">
            {/* Avatar Circle */}
            <div className="h-10 w-10 rounded-full border-2 border-border bg-white flex items-center justify-center font-bold text-black shrink-0">
              JD
            </div>
            
            {/* Name and Handle */}
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
        <SidebarGroup className="bg-graph-paper">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild >
                  <Link to="/room/create">
                    <LayoutDashboard />
                    <span>Create Room</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/room/join">
                    <User />
                    <span>Join Room</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>


              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile">
                    <User />
                    <span>Join Communities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>


            </SidebarMenu>              
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className=" bg-graph-paper h-full">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>General Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 text-xs opacity-50">v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}