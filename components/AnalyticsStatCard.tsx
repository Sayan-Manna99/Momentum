
import React from "react";

type AnalyticsStatCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  valueColor: string;
  subtleColor: string;
};

export const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  title,
  value,
  icon,
  valueColor,
  subtleColor,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-400/20 backdrop-blur-lg p-6 w-full min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:bg-neutral-400/40 hover:border-white/20">

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between">

        {/* Title + Icon */}
        <div className="flex items-start justify-between">

          <p
            className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${subtleColor}`}
          >
            {title}
          </p>

          {icon && (
            <div className={`transition-colors duration-300 ${subtleColor}`}>
              {icon}
            </div>
          )}

        </div>

        {/* Value */}
        <h2
          className={`mt-6 text-4xl md:text-[2.7rem] font-semibold tracking-tight ${valueColor}`}
        >
          {value}
        </h2>

      </div>
    </div>
  );
};






