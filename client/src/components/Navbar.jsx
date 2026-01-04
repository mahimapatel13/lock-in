import { Button } from "@/components/ui/button"
import { Search, Moon, Github, X, TwitterIcon, XIcon,Palette, Music, Twitter, GitGraph, GithubIcon } from "lucide-react"

export default function Navbar() {
  const navLinks = ["Docs", , "Community"]

  return (
    <nav className=" sticky top-0 z-50 w-full border-b-2 border-black bg-white px-40 h-16 flex items-center justify-between ">
      {/* Left Side: Logo and Links */}
      <div className="flex items-center gap-8">
        {/* The Logo: A simple bold square */}
           <div className="
            flex h-10 w-10 shrink-0 items-center justify-center 
            bg-main border-2 border-black 
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            font-black text-xl
          ">
            L
          </div> 

                    <div className="flex justify-center flex-col ">
            <span className="text-lg font-black leading-none uppercase tracking-tight">
              Lock-In
            </span>
            {/* A small accent line */}
            {/* <div className="h-1 w-full bg-main border-t-2 border-black mt-1" /> */}
          </div>
        
        <div className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link} href="#" className="font-bold text-sm hover:underline underline-offset-4 decoration-2">
              {link}
            </a>
          ))}
        </div>
      </div>
      

      {/* Right Side: Tools */}
      <div className="flex items-center gap-8.5">
        {/* Search Bar */}
        

        {/* Action Buttons */}
        {/* <Button 
          variant="neutral" 
          className="p-2 h-10 w-20 "
        >
          <Music size={14} />Music
        </Button>

        <Button variant="neutral" className="p-2 h-10 w-20">
          <Palette size={20} /> Theme
        </Button> */}

         <Button variant="neutral" className=" p-2 h-10 w-10">
          <GithubIcon size={20} />
        </Button>

        <Button variant="neutral" className="p-2 h-10 w-10">
          <Twitter size={20} />
        </Button>
      </div>
    </nav>
  )
}