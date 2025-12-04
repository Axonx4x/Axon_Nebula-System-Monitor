import React from 'react';
import { Battery, Volume2, CloudRain, Zap, MemoryStick, Download } from 'lucide-react';
import { BatteryStatus } from '../types';

interface FooterWidgetsProps {
  battery: BatteryStatus | null;
  volume: number;
  ram: number;
  systemDataForExport?: any;
}

const GearGauge: React.FC<{ value: number; label: string; icon: React.ReactNode; color: string; charging?: boolean }> = ({ value, label, icon, color, charging }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const colorClass = color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400';
  const strokeClass = color === 'cyan' ? 'stroke-cyan-500' : 'stroke-fuchsia-500';
  const shadowClass = color === 'cyan' ? 'shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'shadow-[0_0_15px_rgba(217,70,239,0.1)]';

  return (
    <div className={`relative flex items-center gap-4 p-4 rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl ${shadowClass} group overflow-hidden`}>
      {/* Background Fluid Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color === 'cyan' ? 'from-cyan-500/5' : 'from-fuchsia-500/5'} to-transparent opacity-30`}></div>
      
      {/* Animated Gear Ring */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
         {/* Rotating Gear Background */}
         <svg className="absolute inset-0 w-full h-full text-slate-700/50 animate-spin-slow" viewBox="0 0 100 100">
            <path d="M50 15 L53 5 L58 5 L61 15 A 35 35 0 0 1 73 20 L82 16 L85 20 L81 29 A 35 35 0 0 1 89 39 L98 42 L98 47 L89 50 A 35 35 0 0 1 89 61 L98 64 L98 69 L89 71 A 35 35 0 0 1 81 81 L85 90 L80 94 L73 90 A 35 35 0 0 1 61 95 L58 105 L53 105 L50 95 A 35 35 0 0 1 39 90 L30 94 L27 90 L31 81 A 35 35 0 0 1 20 71 L11 69 L11 64 L20 61 A 35 35 0 0 1 20 50 L11 47 L11 42 L20 39 A 35 35 0 0 1 27 29 L23 20 L27 16 L35 20 A 35 35 0 0 1 50 15 Z" 
                 fill="none" stroke="currentColor" strokeWidth="1" />
         </svg>

         {/* Value Circle */}
         <svg className="relative w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} className="stroke-slate-800" strokeWidth="6" fill="transparent" />
            <circle 
                cx="50" 
                cy="50" 
                r={radius} 
                className={`${strokeClass} transition-all duration-1000 ease-out`} 
                strokeWidth="6" 
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
            />
         </svg>
         
         {/* Center Icon/Text */}
         <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-sm font-bold font-tech ${colorClass}`}>{value.toFixed(0)}%</span>
            {charging && <Zap size={10} className="text-yellow-400 animate-pulse absolute top-12" />}
         </div>
      </div>

      <div className="flex flex-col z-10 min-w-[80px]">
         <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-xs font-sci tracking-widest text-slate-300">{label}</span>
         </div>
         <span className="text-[10px] text-slate-500 font-tech uppercase tracking-wider truncate">
            {charging ? 'AC Power' : 'Optimized'}
         </span>
         <div className="mt-2 flex gap-1">
             {[1,2,3,4].map(i => (
                 <div key={i} className={`h-1 w-3 rounded-full ${i/4 <= value/100 ? (color==='cyan'?'bg-cyan-500':'bg-fuchsia-500') : 'bg-slate-800'}`}></div>
             ))}
         </div>
      </div>
    </div>
  );
};

const FooterWidgets: React.FC<FooterWidgetsProps> = ({ battery, volume, ram, systemDataForExport }) => {
  const currentDate = new Date();

  const handleDataDownload = () => {
    if (systemDataForExport) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemDataForExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `axon_system_log_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="relative">
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
        
        {/* Left: Gear Gauges Cluster */}
        <div className="xl:col-span-6 flex flex-col md:flex-row gap-4">
          <GearGauge 
              value={battery ? battery.level * 100 : 100} 
              label="POWER" 
              icon={<Battery size={16} className="text-cyan-400" />} 
              color="cyan" 
              charging={battery?.charging}
          />
          <GearGauge 
              value={ram} 
              label="MEMORY" 
              icon={<MemoryStick size={16} className="text-fuchsia-400" />} 
              color="fuchsia" 
          />
          <GearGauge 
              value={volume} 
              label="AUDIO" 
              icon={<Volume2 size={16} className="text-cyan-400" />} 
              color="cyan" 
          />
        </div>

        {/* Center: System Actions */}
        <div className="xl:col-span-3 flex justify-center items-center h-full">
           <div className="flex gap-4 p-3 px-6 rounded-full border border-white/10 bg-slate-900/5 backdrop-blur-md">
              <div 
                className="group relative flex flex-col items-center justify-center w-12 h-12 cursor-pointer"
                onClick={handleDataDownload}
              >
                  <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
                  <Download size={18} className="text-slate-400 group-hover:text-fuchsia-400 transition-colors duration-300 mb-1" />
                  <span className="text-[8px] font-sci text-slate-600 group-hover:text-white transition-colors">LOGS</span>
              </div>
           </div>
        </div>

        {/* Right: Weather & Time Glass Panel */}
        <div className="xl:col-span-3 flex justify-end w-full">
           <div className="relative p-6 rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl w-full text-right overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 to-transparent opacity-20"></div>
              
              <div className="relative z-10">
                  <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-[10px] font-tech text-slate-400 tracking-[0.2em] uppercase">Sector 7 // Galaxidi</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                  </div>
                  
                  <h2 className="text-5xl font-sci text-white mb-1 tracking-tighter drop-shadow-lg">
                      {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </h2>
                  
                  <div className="flex items-center justify-end gap-4 mt-2">
                      <span className="text-xs font-tech text-cyan-300 uppercase tracking-widest">
                          {currentDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="h-4 w-[1px] bg-white/10"></div>
                      <div className="flex items-center gap-2">
                          <CloudRain size={14} className="text-cyan-400" />
                          <span className="text-xs font-tech text-slate-300">24°C</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FooterWidgets;
