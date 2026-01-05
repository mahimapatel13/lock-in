import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"; 
import { Progress } from "@/components/ui/progress"; 
import { Timer, Zap, Globe, Share2, Activity, ShieldCheck, Cpu } from "lucide-react";

const FocusHero = () => {
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 120, damping: 20 } 
    },
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="hidden lg:flex flex-col justify-center pr-12 max-w-2xl selection:bg-black selection:text-[#5294FF]"
    >
      {/* 1. SYSTEM HEADER */}
      <motion.div variants={itemVars} className="flex items-center gap-6 mb-8">
        {/* <div className="flex items-center gap-2 group">
          <div className="relative">
            <Globe className="w-4 h-4 text-black group-hover:text-[#5294FF] transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5294FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5294FF]"></span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Uptime: 99.9% / Mesh_Active</span>
        </div>
        <div className="h-[1px] flex-1 bg-black/10" />
        <Badge className="rounded-none border-2 border-black bg-white text-black px-2 py-0 text-[9px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          PUBLIC_BETA_01
        </Badge> */}
      </motion.div>

      {/* 2. THE BRAND: THE MANIFESTO */}
      <motion.div variants={itemVars} className="mb-12">
        <div className="relative inline-block">
          <h1 className="text-[120px] font-[1000] uppercase italic leading-[0.7] tracking-[-0.08em] text-black">
            LOCK <br />
            <span className="relative inline-block text-white ml-[-10px] pr-4">
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.4, ease: "circOut" }}
                className="absolute inset-0 bg-black -rotate-1 skew-x-2" 
              />
              <span className="relative z-10">IN</span>
            </span>
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-l-4 border-black pl-6">
          <p className="text-3xl font-[1000] leading-none text-black uppercase italic tracking-tighter">
            Distraction is <span className="text-[#5294FF]">Default.</span> <br />
            Focus is a <span className="underline decoration-[#5294FF] decoration-8 underline-offset-4">Choice.</span>
          </p>
          <p className="text-[14px] font-bold text-black/60 max-w-sm leading-tight mt-2">
            The decentralized engine for deep work. No feeds, no algorithms, no noise. Just you, your circle, and the timer.
          </p>
        </div>
      </motion.div>

      {/* 3. THE INSTRUMENT PANEL */}
      <div className="grid grid-cols-12 gap-4">
        
        {/* TIMER: POMODORO ENGINE */}
        <motion.div
          variants={itemVars}
          whileHover={{ x: 4, y: -4 }}
          className="col-span-7 border-3 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative"
        >
          <div className="flex justify-between items-start mb-4">
             <div className="space-y-1">
               <p className="text-[9px] font-black uppercase opacity-40">Protocol</p>
               <p className="text-xs font-black uppercase italic tracking-tighter">NEURAL_SYNC_MODE</p>
             </div>
             <div className="p-1 border-2 border-black bg-[#5294FF] text-white">
                <Timer className="w-3 h-3" />
             </div>
          </div>
          
          <div className="text-7xl font-[1000] italic tabular-nums tracking-tighter text-black leading-none mb-6">
            25:00
          </div>
          
          <div className="space-y-1">
            <Progress value={65} className="h-2 rounded-none border-2 border-black bg-black/5" />
            <div className="flex justify-between text-[8px] font-black uppercase">
                <span className="text-[#5294FF]">Syncing_Peers...</span>
                <span>Work_Session_04</span>
            </div>
          </div>
        </motion.div>

        {/* TOPOLOGY: P2P VERIFICATION */}
        <motion.div
          variants={itemVars}
          whileHover={{ x: 4, y: -4 }}

          className="col-span-5 border-3 border-black bg-black p-5 shadow-[6px_6px_0px_0px_#5294FF] flex flex-col justify-between overflow-hidden relative"
        >
          <div className="flex justify-between items-center text-white/50">
            <Cpu className="w-4 h-4" />
            <ShieldCheck className="w-4 h-4 text-[#5294FF]" />
          </div>

          <div className="flex gap-1 justify-center py-4">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [8, 24, 8] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="w-1.5 bg-white/40 rounded-full"
              />
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-[1000] uppercase text-white leading-tight italic">
              MESH_LINK <br /> <span className="text-[#5294FF]">VERIFIED</span>
            </p>
          </div>
        </motion.div>

        {/* MARQUEE: THE RALLY CRY */}
        <motion.div
          variants={itemVars}
          className="col-span-12 border-3 border-black bg-[#FFD600] text-black py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, -600] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-8 items-center font-black uppercase italic text-sm tracking-tighter"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                STOP SCROLLING <Zap className="w-3 h-3 fill-black" /> 
                START BUILDING <Zap className="w-3 h-3 fill-black" />
                JOIN THE SWARM <Zap className="w-3 h-3 fill-black" />
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 4. FOOTER */}
      {/* <motion.div variants={itemVars} className="mt-8 flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-widest text-black/40 italic">
          // THE NEW STANDARD FOR DECENTRALIZED PRODUCTIVITY
        </p>
        <div className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-black text-white italic">
            SECURE_PEER_CONNECTED
        </div>
      </motion.div> */}
    </motion.div>
  );
};

export default FocusHero;