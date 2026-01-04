import { Button } from "@/components/ui/button"
import { Music, Palette } from "lucide-react"

export default function RightNavSidebar() {
  const links = [
    { title: "Installation", active: false },
    { title: "Usage", active: true },
    { title: "page.tsx", active: false, isSub: true },
    { title: "sidebar.tsx", active: false, isSub: true },
  ]

  return (
    <div className=" bg-graph-paper sticky flex flex-col h-full bg-white ">
      {/* Bottom Control Section (Music/Theme) */}
      <div className="p-4 bg-graph-paper  border-black space-y-3 bg-zinc-50">
       
        <Button 
          variant="neutral" 
          className="w-full  border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex justify-start gap-2 h-9 text-xs font-black uppercase"
        >
          <Music size={14} /> Ambience
        </Button>
        <Button 
          variant="neutral" 
          className="w-full border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex justify-start gap-2 h-9 text-xs font-black uppercase"
        >
          <Palette size={14} /> Themes
        </Button>
      </div>
    </div>
  )
}