import React from "react";

interface ContextStat {
  num: string;
  label: string;
}

interface ContextBandProps {
  stats: ContextStat[];
}

export function ContextBand({ stats }: ContextBandProps) {
  return (
    <div className="mx-6 mt-5 flex items-center gap-3 rounded-lg border border-[#0A6AE2]/20 bg-[#0A6AE2]/10 p-3">
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="text-[18px] font-semibold tracking-[-0.5px] text-[#3D94F5] tabular-nums">
              {stat.num}
            </div>
            <div className="mt-1 text-[9px] font-normal uppercase tracking-[0.08em] text-white/35">
              {stat.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-8 w-[1px] bg-[#0A6AE2]/25" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
