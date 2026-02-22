
import { React, createContext, useContext, useCallback,useMemo, useState, useEffect } from "react";
import api from "@/utils/api";

const PomodoroContext = createContext();

export const usePomodoro = () => {
    return useContext(PomodoroContext);
}

const MODES = {
  STANDARD: { label: "25/5", work: 1, break: 1 },
  LONG: { label: "50/10", work: 1, break: 1 },
  DEEP: { label: "90/30", work: 1, break: 1 },
};


// const MODES = {
//   STANDARD: { label: "25/5", work: 25, break: 5 },
//   LONG: { label: "50/10", work: 50, break: 10 },
//   DEEP: { label: "90/30", work: 90, break: 30 },
// };
export const PomodoroProvider = ({ children }) => {

  const [currentMode, setCurrentMode] = useState("STANDARD");
  const [minutes, setMinutes] = useState(MODES.STANDARD.work);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  // const [isFocusing, setIsFocusing] = useState(false)
  


  const handleModeChange = useCallback((modeKey) => {
    console.log("handling change..")
    const mode = MODES[modeKey];
    setCurrentMode(modeKey);
    setIsActive(false);
    setIsBreak(false);
    setMinutes(mode.work);
    setSeconds(0);
  }, []);

  const endSession = async () => {

    console.log("ending session!")
    const payload = {
      end_time: new Date().toISOString()
    };

    console.log(payload.end_time); 
    // Output example: "2026-01-10T15:22:00.000Z"

    try{
      const resp = await api.post("/session/end", payload)
      return resp.data
    } catch(error){
      console.log(error)
      const message = error.message || "Failed to record session"
      throw new Error(message);
    }

  }
  const startSession = async () => {

    console.log("starting session!")

    const payload = {
      start_time: new Date().toISOString()
    };

    console.log(payload.start_time); 
    // Output example: "2026-01-10T15:22:00.000Z"

    try{
      const resp = await api.post("/session/start", payload)
      return resp.data
    } catch(error){
      console.log(error)
      const message = error.message || "Failed to record session"
      throw new Error(message);
    }

  }
  // useEffect(() => {
  //   console.log("Internal Hook State -> Active:", isActive, "Break:", isBreak);
  // }, [isActive, isBreak]);
  useEffect(() => {
    let interval = null;
    // setIsFocusing (isActive && !isBreak);
    // console.log("focs", isFocusing)
    if (isActive) {
      // if(!isBreak){
      //   try {
      //     const resp = startSession()
      //     console.log(resp)
      //   } catch (e) {
      //     console.log(e.message)
      //   }
      // }
      interval = setInterval(() => { 
        if(seconds == 0 && minutes == MODES[currentMode].work){
          startSession()
        }     
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          // Timer reached zero
          if (!isBreak) {
            try {
              const resp = endSession()
              console.log(resp)
            } catch (e) {
              console.log(e.message)
            }
          }
          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);
          setMinutes(nextIsBreak ? MODES[currentMode].break : MODES[currentMode].work);
          setSeconds(0);
          setIsActive(false); // Stop timer at transition
          // setIsFocusing(false)
          //send request to backend
          
        }

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, isBreak, currentMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  }
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(MODES[currentMode].work);
    setSeconds(0);
  };

  const totalTime = isBreak ? MODES[currentMode].break : MODES[currentMode].work;
  const progress = ((totalTime * 60 - (minutes * 60 + seconds)) / (totalTime * 60)) * 100;

    const value = useMemo(() => ({
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
    }), [ isBreak, seconds, isActive, minutes, currentMode, progress, handleModeChange]);


  return (
    <PomodoroContext.Provider value={value}>
        {children}
    </PomodoroContext.Provider>
  )

};