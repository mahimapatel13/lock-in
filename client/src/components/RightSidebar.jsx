import React, { useState, useEffect } from 'react';

const FOCUS_QUOTES = [
  "Deep work only.",
  "Flow state active.",
  "Stay in the zone.",
  "One task at a time.",
  "Silence the noise.",
  "Quality over speed.",
  "Eyes on the prize."
];

export default function RightSidebar() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FOCUS_QUOTES.length);
        setFade(true); // Start fade in
      }, 500); // Wait for fade out animation
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

const quotes = [
  "Focus is a form of respect to your future self.",
  "Small progress, every day.",
  "Do the work. Let the results speak.",
  "Deep work beats loud motivation.",
  "Consistency > Intensity.",
  "Build quietly. Win loudly.",
  "Your future is watching you right now.",
  "One clean hour is worth ten distracted ones.",
];

return (
  <div className="w-50 h-screen bg-graph-paper sticky flex flex-col border-l-2">
    <div className="p-4 bg-graph-paper h-full border-black space-y-4 bg-zinc-50 flex flex-col justify-center">
      <div
        className="relative overflow-hidden"
        style={{
          // soft fade at top & bottom so items disappear naturally
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/* The belt */}
        <div className="flex flex-col gap-4 animate-[infiniteScroll_120s_linear_infinite] will-change-transform">
          {/* First copy */}
          {quotes.map((q, i) => (
            <div
              key={i}
              className="text-[11px] leading-relaxed text-zinc-500 font-medium tracking-wide uppercase"
            >
              {q}
            </div>
          ))}

          {/* Second copy (for seamless loop) */}
          {quotes.map((q, i) => (
            <div
              key={`dup-${i}`}
              className="text-[11px] leading-relaxed text-zinc-500 font-medium tracking-wide uppercase"
            >
              {q}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 text-[10px] text-zinc-400 uppercase tracking-wider">
        Stay in the zone.
      </div>
    </div>

    <style jsx>{`
      @keyframes infiniteScroll {
        0% {
          transform: translateY(0%);
        }
        100% {
          transform: translateY(-50%);
        }
      }
    `}</style>
  </div>
);
}