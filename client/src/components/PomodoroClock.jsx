import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button"; 
import { Play, Pause, RotateCcw, Coffee, Brain, Timer, AlertOctagon, ArrowRight } from "lucide-react";
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
        border-[3px] border-black p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
        flex items-center gap-6 transition-colors duration-500
        ${isBreak ? 'bg-blue-50' : 'bg-white'}
      `}>
        <div className="flex flex-col items-center justify-center border-r-[3px] border-black pr-6 min-w-[120px]">
          {isBreak ? <Coffee size={24} className="text-blue-500" /> : <Brain size={24} className="text-red-500" />}
          <span className="font-black uppercase text-[11px] tracking-tighter mt-1">
            {isBreak ? "Break" : "Focus"}
          </span>
        </div>

        <div className="text-6xl font-black tabular-nums tracking-tighter min-w-[160px]">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex-1 space-y-3">
           <div className="flex justify-between items-end">
              <span className="text-[11px] font-black uppercase tracking-widest">MODE: {currentMode}</span>
              <span className="text-[11px] font-black">{Math.round(progress)}%</span>
           </div>
           <div className="border-[3px] border-black h-6 bg-zinc-100 relative overflow-hidden shadow-[2px_2px_0px_0px_black]">
              <div 
                className={`h-full transition-all duration-300 border-r-[3px] border-black ${isBreak ? 'bg-blue-400' : 'bg-[#00A3FF]'}`} 
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l-[3px] border-black">
          {(isActive  && isFocusing) ?  (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  className="h-14 w-28 rounded-none border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-red-400 hover:bg-red-500 text-white transition-all"
                >
                  <Pause size={18} className="mr-1" /> Stop
                </Button>
              </DrawerTrigger>
              
              <DrawerContent className="rounded-none border-t-[3px] border-black bg-white outline-none">
                <div className="mx-auto w-full max-w-2xl px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    <div className="space-y-2">
                      <div className="inline-block bg-red-400 p-4 border-[3px] border-black shadow-[6px_6px_0px_0px_black] -rotate-2">
                         <AlertOctagon size={40} className="text-white" />
                      </div>
                      <div>
                        <DrawerTitle className="text-5xl font-black uppercase italic tracking-[calc(-0.05em)] leading-[0.9] mb-4">
                          Abort <br/> Mission?
                        </DrawerTitle>
                        <DrawerDescription className="font-bold text-zinc-500 uppercase text-xs tracking-[0.2em] leading-relaxed">
                          Stopping now will void this <span className="text-black underline decoration-[3px]">{MODES[currentMode].label}</span> session.
                        </DrawerDescription>
                      </div>
                    </div>

                    <DrawerFooter className="flex flex-col gap-4 p-0">
                      <Button 
                        onClick={() => {
                          setIsActive(false); // Stop the timer
                          setIsDrawerOpen(false);
                        }}
                        className="w-full h-20 rounded-none border-[3px] border-black bg-red-400 text-white font-black uppercase text-lg shadow-[8px_8px_0px_0px_black] hover:bg-red-500 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
                      >
                        Yes, End it <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <DrawerClose asChild>
                        <Button 
                          variant="neutral"
                          className="w-full h-16 rounded-none border-[3px] border-black bg-white text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] hover:bg-zinc-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          Stay Focused
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button 
              onClick={toggleTimer}
              className="h-14 w-28 rounded-none border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-[#A3E635] hover:bg-[#bef264] text-black transition-all"
            >
              <Play size={18} className="mr-1" /> Go
            </Button>
          )}

          <Button 
            variant="neutral" 
            onClick={resetTimer} 
            className="h-14 w-14 rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="flex gap-8 justify-center items-center">
        {Object.entries(MODES).map(([key, mode]) => (
          <Button
            key={key}
            variant="neutral"
            onClick={() => handleModeChange(key)}
            className={`
              h-14 px-10 rounded-none border-[3px] border-black font-black text-xs uppercase transition-all
              tracking-[0.2em] shadow-[6px_6px_0px_0px_black] hover:bg-zinc-50
              ${currentMode === key 
                ? 'bg-[#FDE047] -translate-y-1.5 shadow-[10px_10px_0px_0px_black] hover:bg-[#FDE047]' 
                : 'bg-white'}
            `}
          >
            <Timer size={16} className="mr-2" />
            {mode.label} Mode
          </Button>
        ))}
      </div>
    </div>
  );
}