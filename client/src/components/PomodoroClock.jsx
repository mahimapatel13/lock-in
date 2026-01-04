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

const MODES = {
  STANDARD: { label: "25/5", work: 25, break: 5 },
  LONG: { label: "50/10", work: 50, break: 10 },
  DEEP: { label: "90/30", work: 90, break: 30 },
};

export default function PomodoroClock() {
  const [currentMode, setCurrentMode] = useState("STANDARD");
  const [minutes, setMinutes] = useState(MODES.STANDARD.work);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleModeChange = useCallback((modeKey) => {
    const mode = MODES[modeKey];
    setCurrentMode(modeKey);
    setIsActive(false);
    setIsBreak(false);
    setMinutes(mode.work);
    setSeconds(0);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);
          setMinutes(nextIsBreak ? MODES[currentMode].break : MODES[currentMode].work);
          setSeconds(0);
          setIsActive(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, isBreak, currentMode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(MODES[currentMode].work);
    setSeconds(0);
  };

  const totalTime = isBreak ? MODES[currentMode].break : MODES[currentMode].work;
  const progress = ((totalTime * 60 - (minutes * 60 + seconds)) / (totalTime * 60)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10"> 
      
      {/* MAIN CLOCK UNIT */}
      <div className={`
        border-[3px] border-black p-5 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
        flex items-center gap-6 transition-colors duration-500
        ${isBreak ? 'bg-blue-50' : 'bg-white'}
      `}>
        <div className="flex flex-col items-center justify-center border-r-[3px] border-black pr-6 min-w-[120px]">
          {isBreak ? <Coffee size={24} /> : <Brain size={24} />}
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
                className="h-full bg-[#00A3FF] transition-all duration-300 border-r-[3px] border-black" 
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l-[3px] border-black">
          {isActive ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  className="h-14 w-28 rounded-none border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-red-400 hover:bg-red-500 text-white transition-all"
                >
                  <Pause size={18} className="mr-1" /> Stop
                </Button>
              </DrawerTrigger>
              
              <DrawerContent 
                className="rounded-none border-t-[4px] border-black bg-white outline-none min-h-[40vh]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px'
                }}
              >
                {/* Content Wrapper */}
                <div className="mx-auto w-full max-w-6xl px-12 py-24">
                  <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-20">
                    
                    {/* LEFT BLOCK */}
                    <div className="flex items-center gap-10 flex-1">
                      <div className="shrink-0 bg-red-400 p-6 border-[3px] border-black shadow-[8px_8px_0px_0px_black] z-10">
                        <AlertOctagon size={56} className="text-white" strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex flex-col justify-center text-left z-10">
                        <DrawerTitle className="text-7xl font-black uppercase italic tracking-tighter leading-[0.8] mb-3">
                          Stop <br/> Session?
                        </DrawerTitle>
                        <DrawerDescription className="font-bold text-black uppercase text-[12px] tracking-[0.25em] leading-none opacity-60">
                          Current progress will be <span className="underline underline-offset-4 decoration-[3px]">voided</span>
                        </DrawerDescription>
                      </div>
                    </div>

                    {/* RIGHT BLOCK */}
                    <DrawerFooter className="flex flex-col gap-5 p-0 w-full md:w-[360px] shrink-0 justify-center z-10">
                      <Button 
                        onClick={() => {
                          toggleTimer();
                          setIsDrawerOpen(false);
                        }}
                        className="w-full h-24 rounded-none border-[3px] border-black bg-red-400 text-white font-black uppercase text-2xl shadow-[10px_10px_0px_0px_black] hover:bg-red-500 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
                      >
                        Yes, End it <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={28} />
                      </Button>
                      
                      <DrawerClose asChild>
                        <Button 
                          variant="neutral"
                          className="w-full h-16 rounded-none border-[3px] border-black bg-white text-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_black] hover:bg-zinc-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          Keep Going
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
              className="h-14 w-28 rounded-none border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-[var(--main)] hover:bg-[var(--main)]/90 text-black transition-all"
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
                ? 'bg-[var(--accent-yellow)] -translate-y-1.5 shadow-[10px_10px_0px_0px_black] hover:bg-[var(--accent-yellow)]' 
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