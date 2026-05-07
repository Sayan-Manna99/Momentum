import React from "react";

type AnalyticsStatCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
};

const getColors = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("completed"))  return { value: "text-green-400",  subtle: "text-green-400/60 group-hover:text-green-400" };
  if (t.includes("progress"))   return { value: "text-yellow-400", subtle: "text-yellow-400/60 group-hover:text-yellow-400" };
  if (t.includes("not"))        return { value: "text-cyan-400",   subtle: "text-cyan-400/60 group-hover:text-cyan-400" };
  return { value: "text-white", subtle: "text-white/50 group-hover:text-white/70" };
};

export const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({ title, value, icon }) => {
  const { value: valueColor, subtle } = getColors(title);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-400/20 backdrop-blur-lg p-6 w-full min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:bg-neutral-400/40 hover:border-white/20">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <p className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${subtle}`}>
            {title}
          </p>
          {icon && <div className={`transition-colors duration-300 ${subtle}`}>{icon}</div>}
        </div>

        <h2 className={`mt-6 text-4xl md:text-[2.7rem] font-semibold tracking-tight ${valueColor}`}>
          {value}
        </h2>
      </div>
    </div>
  );
};