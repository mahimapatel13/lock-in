import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button"; 
import { Play, Pause, RotateCcw, Coffee, Brain, Timer, AlertOctagon, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePomodoro } from "@/context/PomodoroContext";

// const MODES = {
//   STANDARD: { label: "25/5", work: 25, break: 5 },
//   LONG: { label: "50/10", work: 50, break: 10 },
//   DEEP: { label: "90/30", work: 90, break: 30 },
// };

const MODES = {
  STANDARD: { label: "25/5", work: 1, break: 1 },
  LONG: { label: "50/10", work: 1, break: 1 },
  DEEP: { label: "90/30", work: 1, break: 1 },
};


// Added onStateChange to props
export default function PomodoroClock() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    isBreak,
    seconds,
    isActive,
    minutes,
    currentMode,
    setIsActive,
    toggleTimer,
    progress,
    resetTimer,
    handleModeChange,
  } = usePomodoro();
  
  const isFocusing = isActive && !isBreak;

  console.log("Pomodoro check .. current use is focusing ? .. ", currentMode)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10"> 
      
      {/* MAIN CLOCK UNIT */}
      <div className={`
       p-8 bg-white 
        flex items-center gap-6 transition-colors shadow-lg shadow-blue-500/50 duration-500
        ${isBreak ? 'bg-blue-50' : 'bg-white'}
      `}>
        <div className="flex flex-col items-center justify-center border-r-[3px] border-black/60 pr-6 min-w-[120px]">
          {isBreak ? <Coffee size={24} className="text-blue-500" /> : <Brain size={24} className="text-red-500" />}
          <span className="font-black uppercase text-[11px] text-black/70 tracking-tighter mt-1">
            {isBreak ? "Break" : "Focus"}
          </span>
        </div>

        <div className="text-6xl text-black/80 font-black tabular-nums tracking-tighter min-w-40">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex-1 space-y-3">
           <div className="flex justify-between items-end">
              <span className="text-[11px]  text-black/70 font-black uppercase tracking-widest">MODE: {currentMode}</span>
              <span className="text-[11px] text-black/70 font-black">{Math.round(progress)}%</span>
           </div>
           <div className="border-2 border-black h-6 bg-zinc-100 relative overflow-hidden ">
              <div 
                className={`h-full transition-all duration-300 border-r-[3px] border-black/60 ${isBreak ? 'bg-blue-400' : 'bg-[#00A3FF]'}`} 
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l-[3px] border-black/60">
          {(isActive  && isFocusing) ?  (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                 <button  
                  className="flex items-center justify-center h-14 w-28 rounded-none font-black uppercase text-sm active:translate-x-0.5 border border-black/5  active:translate-y-0.5 bg-red-400 hover:bg-red-300 text-white shadow-sm shadow-red-900 transition-all cursor-pointer"
                >
                  <Pause size={18} className="mr-1" /> Stop
                </button>
               
               
              </DrawerTrigger>
              
              <DrawerContent className="rounded-none border-t border-black/70 bg-white outline-none">
                <div className="mx-auto w-full max-w-2xl px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    <div className="space-y-2">
                      {/* <div className="inline-block bg-red-400 p-4 border-[3px] border-black shadow-[6px_6px_0px_0px_black] -rotate-2">
                         <AlertOctagon size={40} className="text-white" />
                      </div> */}
                      <div>
                        <DrawerTitle className="text-5xl font-black uppercase italic tracking-[calc(-0.05em)] leading-[0.9] mb-4 text-black/70">
                          Abort <br/> Mission?
                        </DrawerTitle>
                        <DrawerDescription className="font-bold text-zinc-500 uppercase text-xs tracking-[0.2em] leading-relaxed">
                          Stopping now will void this <span className="text-black/80 underline decoration-[3px]">{MODES[currentMode].label}</span> session.
                        </DrawerDescription>
                      </div>
                    </div>

                    <DrawerFooter className="flex flex-col gap-4 p-0">

                      
                       <button  
                          onClick={() => {
                            setIsActive(false); // Stop the timer
                            setIsDrawerOpen(false);
                          }}
                          className="w-full h-20 rounded-none border  bg-red-400 text-white font-black uppercase text-lg  hover:bg-red-300 active:translate-x-[4px]  border-black/5 active:translate-y-[4px] active:shadow-none shadow-sm shadow-red-900 transition-all group flex cursor-pointer  items-center justify-center "
                        >
                           Yes End it  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>

                        
                
                      
                      <DrawerClose asChild>

                         <button 
                          className="flex group w-full items-center justify-center h-20 rounded-none font-black uppercase text-lg active:translate-x-0.5 border active:translate-y-0.5 transition-all border-black/10  hover:bg-black/20 text-black/70 shadow-sm shadow-gray-400 cursor-pointer"
                        >
                          Stay Focused <ArrowLeft className="ml-2 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        {/* <Button 
                          variant="neutral"
                          className="w-full h-16 rounded-none border-[3px] border-black bg-white text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] hover:bg-zinc-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          Stay Focused
                        </Button> */}
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (

            <div 
              onClick={toggleTimer} 
              className="flex items-center justify-center h-14 w-28 rounded-none font-black uppercase text-sm active:translate-x-0.5 border border-black/5  active:translate-y-0.5 bg-[#8edd10] hover:bg-[#acf72b] text-white shadow-sm shadow-green-900 transition-all cursor-pointer"
            >
              <Play size={18} className="mr-1" /> 
              <span>Go</span>
            </div>
           
          )}

            <div 
              onClick={resetTimer} 
              className="flex items-center justify-center h-14 w-28 rounded-none font-black uppercase text-sm active:translate-x-0.5 border active:translate-y-0.5 transition-all border-black/10  hover:bg-black/20 shadow-sm shadow-gray-400 cursor-pointer"
            >
               <RotateCcw size={20} ></RotateCcw>
            </div>
        
        </div>
      </div>

      {/* MODE SELECTOR */}
     

       {isActive && isFocusing ? null : (
        <div className="flex gap-8 justify-center items-center"> {/* Added a wrapper div for the map */}
          {Object.entries(MODES).map(([key, mode]) => (
                  <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  className={`
                    w-full h-14 px-10 rounded-none font-black text-xs uppercase transition-all
                    tracking-[0.2em] shadow-md border border-black/10 shadow-gray-400 
                    hover:bg-[#f4eab7] text-black/70
                    flex items-center justify-center 
                    
                    ${currentMode === key 
                      ? 'bg-[#f8dc55] hover:bg-[#FDE047] text-black/60' 
                      : 'bg-white'}
                  `}
                >
                  <Timer size={16} className="mr-2" />
                  <span>{mode.label} Mode</span>
                </button>
                ))}
        </div>
      )}

       
  
      
    </div>
  );
}