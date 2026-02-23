import { Button } from "@/components/ui/button"
import {  GithubIcon } from "lucide-react"

export default function Navbar() {
  const navLinks = ["Docs", , "Community"]

  return (
    <nav className=" sticky top-0 z-50 w-full border-b-2 border-black px-40 h-16 flex items-center justify-between ">
      <div className="flex items-center gap-8">
                    <div className="flex justify-center flex-col ">
            <span className="text-lg font-bold text-black-30 leading-none uppercase tracking-tight">
              Lock-In
            </span>
          </div>
        
      
      </div>
      <div className="flex items-center gap-8.5">

        <div className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link} href="#" className=" text-black/75 text-sm  hover:text-black underline-offset-4 decoration-2">
              {link}
            </a>
          ))}


          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm  text-black/75 
                      border border-black/10 rounded-md px-3 py-1.5
                      hover:bg-zinc-100 hover:text-black
                      transition-colors duration-150"
          >
            <GithubIcon size={16} className="shrink-0" />
            <span>Star on GitHub</span>
          </a>
        </div>
        
      </div>
    </nav>
  )
}