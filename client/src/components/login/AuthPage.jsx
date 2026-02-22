import React from "react";
import FocusHero from "../FocusHero";
import AuthForm from "./AuthForm";

const AuthPage = () => {
  return (
    <div className="h-screen w-full bg-[#F0F0F0] flex items-center justify-center overflow-hidden relative">
      
      {/* 1. LARGE SCALE WATERMARKS */}
      {/* Top Left Watermark */}
      <div className="absolute -top-10 -left-10 text-[180px] font-[1000] text-black/[0.03] uppercase italic leading-none pointer-events-none select-none">
        FOCUS
      </div>
      
      {/* Bottom Right Watermark */}
      <div className="absolute -bottom-20 -right-10 text-[220px] font-[1000] text-black/3 uppercase italic leading-none pointer-events-none select-none">
        SYNC
      </div>

      {/* Vertical Side Label - Larger and Bolder */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden 2xl:block">
        <span className="text-14px font-[1000] uppercase tracking-[1.5em] text-black/10 whitespace-nowrap">
          ESTABLISHED_MMXXIV
        </span>
      </div>

      {/* 2. THE MAIN LAYOUT */}
      <div className="w-full max-w-360 h-full flex flex-row items-stretch relative z-10">
        
        {/* LEFT: BRANDING SIDE */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-12 border-r-4 border-black/5">
          <div className="w-full max-w-xl scale-[0.75] xl:scale-[0.9] 2xl:scale-100 origin-center">
            <FocusHero />
          </div>
        </div>

        {/* RIGHT: AUTH SIDE */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-110">
            {/* Shadow and wrapper animations removed. 
                Using your AuthForm's internal Neobrutalist styling.
            */}
            <div className="w-full">
               <AuthForm />
            </div>

            {/* THEMATIC FOOTER TEXT */}

          </div>
        </div>

      </div>

     

    </div>
  );
};

export default AuthPage;