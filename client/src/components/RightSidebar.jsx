import React, { useState, useEffect } from 'react';

const FOCUS_QUOTES = [
  // Your originals
  "Deep work only.",
  "Flow state active.",
  "Stay in the zone.",
  "One task at a time.",
  "Silence the noise.",
  "Quality over speed.",
  "Eyes on the prize.",

  // Short focus mantras
  "Do the work.",
  "No distractions.",
  "Lock in.",
  "Finish what you start.",
  "Progress over perfection.",
  "Focus is power.",
  "Attention is currency.",
  "Make it count.",
  "Be present.",
  "Cut the noise.",
  "Work, then rest.",
  "Start. Don’t scroll.",
  "Build, don’t browse.",
  "Consistency wins.",
  "Small steps, daily.",
  "Discipline beats motivation.",
  "Less, but better.",
  "Clarity over chaos.",
  "Stay deliberate.",
  "One goal. One path.",
  "Deep focus, deep results.",
  "Slow is smooth. Smooth is fast.",
  "Work with intent.",
  "Choose depth.",
  "No zero days.",
  "Focus creates momentum.",
  "Attention decides direction.",
  "Eliminate the unnecessary.",
  "Stay sharp.",
  "Commit to the task.",
  "Do it properly.",
  "Momentum > motivation.",
  "Make time, don’t find it.",
  "Finish strong.",
  "Train your attention.",
  "Control your focus.",
  "Work in silence.",
  "Let results speak.",
  "Ignore the noise.",
  "Execute.",
  "Be hard to distract.",
  "Single-tasking mode.",
  "Think less. Do more.",
  "Depth over dopamine.",
  "Earn the break.",
  "Stay on the path.",
  "Focus is a choice.",
  "Do fewer things better.",
  "Build before you consume.",
  "Show up and work."
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
  <div className="w-50 h-screen overflow-visible bg-graph-paper sticky flex flex-col">
    <div className="p-4 bg-graph-paper h-full border-black/50 space-y-4 bg-zinc-50 flex flex-col justify-center">
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