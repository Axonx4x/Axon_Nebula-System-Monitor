import React from 'react';

interface CpuVisualizerProps {
  usage: number[];
}

const CpuVisualizer: React.FC<CpuVisualizerProps> = ({ usage }) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.1)]">
      {/* Decorative Corner Lines */}
      <div className="absolute top-0 left-0 w-16 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 w-[1px] h-16 bg-gradient-to-b from-cyan-500 to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2 z-10">
          <h3 className="text-cyan-400 font-sci text-xs tracking-[0.2em] uppercase flex items-center gap-2">
            <span className="w-1 h-3 bg-cyan-500 rounded-sm"></span>
            CPU Thread Load
          </h3>
          <span className="text-[10px] font-tech text-slate-500">8 CORES ACTIVE</span>
      </div>
      
      <div className="flex flex-col gap-3 z-10">
        {usage.map((core, i) => (
          <div key={i} className="flex items-center gap-3">
             <span className="text-[10px] w-4 text-slate-500 font-tech opacity-60">
                 {i < 10 ? `0${i}` : i}
             </span>
             
             {/* Segmented Track */}
             <div className="flex-1 flex gap-[2px] h-2">
                {Array.from({ length: 20 }).map((_, idx) => {
                    const threshold = (idx + 1) * 5;
                    const isActive = core >= threshold;
                    let color = 'bg-cyan-500';
                    if (idx > 15) color = 'bg-fuchsia-500'; // High load color
                    
                    return (
                        <div 
                            key={idx}
                            className={`flex-1 rounded-[1px] transition-all duration-300 ${isActive ? `${color} shadow-[0_0_5px_rgba(34,211,238,0.4)]` : 'bg-slate-800/30'}`}
                        ></div>
                    );
                })}
             </div>
             
             {/* Value */}
             <span className={`text-[10px] w-8 text-right font-tech ${core > 80 ? 'text-fuchsia-300' : 'text-cyan-300'} opacity-90`}>
                {core.toFixed(0)}%
             </span>
          </div>
        ))}
      </div>
      
      {/* Background Tech Details */}
      <div className="absolute bottom-2 right-4 text-[8px] font-tech text-slate-700 tracking-[0.3em] uppercase opacity-40">
        Axon-Monitor.sys // v2.4
      </div>
    </div>
  );
};

export default CpuVisualizer;