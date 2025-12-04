import React, { useState } from 'react';
import { X, Terminal, Cpu, Database, Activity, Lock, Monitor, Globe, ChevronLeft, HardDrive, Layout, Box } from 'lucide-react';
import { SystemData } from '../types';

interface TechReactorProps {
  systemData: SystemData;
}

const TechReactor: React.FC<TechReactorProps> = ({ systemData }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* --- Main Reactor Widget --- */}
      <div 
        className={`relative w-80 h-80 flex items-center justify-center cursor-pointer group transition-all duration-700 ease-in-out ${isActive ? 'scale-150 opacity-0 pointer-events-none' : 'hover:scale-110 opacity-100'}`}
        onClick={() => setIsActive(true)}
      >
        {/* --- Ambient Glow --- */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-fast group-hover:bg-cyan-400/20 transition-all duration-500"></div>
        
        {/* --- LAYER 1: Large Background Gear (Static or Very Slow) --- */}
        <svg className="absolute inset-0 w-full h-full text-slate-800 animate-spin-super-slow opacity-60 group-hover:opacity-100 group-hover:text-slate-700 transition-all duration-700" viewBox="0 0 100 100">
          <path d="M50 0 L55 10 L90 10 L95 25 L85 35 L95 50 L85 65 L95 80 L90 95 L55 90 L50 100 L45 90 L10 95 L5 80 L15 65 L5 50 L15 35 L5 20 L10 5 L45 10 Z" 
                fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>

        {/* --- LAYER 2: Main Mechanical Gear (Counter-Clockwise) --- */}
        <div className="absolute inset-4 animate-spin-reverse-slower group-hover:animate-spin-fast transition-all">
          <svg className="w-full h-full text-cyan-900/40 group-hover:text-cyan-500/20 transition-colors duration-500" viewBox="0 0 100 100">
            {/* Gear Teeth */}
            <path d="M50 15 L53 5 L58 5 L61 15 A 35 35 0 0 1 73 20 L82 16 L85 20 L81 29 A 35 35 0 0 1 89 39 L98 42 L98 47 L89 50 A 35 35 0 0 1 89 61 L98 64 L98 69 L89 71 A 35 35 0 0 1 81 81 L85 90 L80 94 L73 90 A 35 35 0 0 1 61 95 L58 105 L53 105 L50 95 A 35 35 0 0 1 39 90 L30 94 L27 90 L31 81 A 35 35 0 0 1 20 71 L11 69 L11 64 L20 61 A 35 35 0 0 1 20 50 L11 47 L11 42 L20 39 A 35 35 0 0 1 27 29 L23 20 L27 16 L35 20 A 35 35 0 0 1 50 15 Z" 
                  fill="currentColor" />
            {/* Inner cutout */}
            <circle cx="50" cy="50" r="25" fill="#020617" />
          </svg>
        </div>

        {/* --- LAYER 3: Middle Precision Ring (Clockwise) --- */}
        <div className="absolute inset-10 animate-spin-slow group-hover:animate-spin-fast transition-all">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="1 3" className="group-hover:stroke-cyan-400 group-hover:strokeOpacity-80 transition-all duration-300" />
            <path d="M50 12 L50 18 M88 50 L82 50 M50 88 L50 82 M12 50 L18 50" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" className="group-hover:stroke-white transition-colors duration-300"/>
          </svg>
        </div>

        {/* --- LAYER 4: Inner High-Speed Spinner (Reverse) --- */}
        <div className="absolute inset-16 animate-spin-reverse-slow group-hover:animate-spin-super-fast transition-all">
          <svg className="w-full h-full text-fuchsia-500/30 group-hover:text-fuchsia-400/80 transition-colors duration-300" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="10 15" />
              <circle cx="50" cy="50" r="26" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </div>

        {/* --- CORE: The "Energy Source" --- */}
        <div className="relative z-10 w-28 h-28 bg-slate-900 rounded-full border border-cyan-400/30 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden group-hover:shadow-[0_0_80px_rgba(34,211,238,0.6)] group-hover:scale-105 transition-all duration-300">
          {/* Inner oscillating gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-slate-900 to-fuchsia-900/20 animate-pulse-fast group-hover:animate-none group-hover:bg-cyan-900/40"></div>
          
          {/* Core Tech Text */}
          <div className="relative flex flex-col items-center z-20 group-hover:scale-110 transition-transform">
              <span className="font-sci text-cyan-400 font-bold text-xl tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">AXON</span>
              <span className="font-tech text-[10px] text-fuchsia-400 tracking-[0.3em] group-hover:text-white transition-colors">CORE V2</span>
          </div>
          
          {/* Scanning Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-1/2 w-full animate-float blur-sm group-hover:via-cyan-400/30"></div>
        </div>
        
        {/* Decorative floating particles */}
        <div className="absolute top-10 right-10 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-10 left-10 w-1 h-1 bg-fuchsia-400 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        
        {/* Click Instruction Hint */}
        <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] font-tech text-cyan-500 tracking-[0.3em] bg-slate-900/80 px-2 py-1 rounded border border-cyan-500/20">
          CLICK TO ANALYZE
        </div>
      </div>

      {/* --- HOLOGRAPHIC MODAL OVERLAY --- */}
      {isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-500"
             onClick={(e) => { e.stopPropagation(); setIsActive(false); }}
           ></div>
           
           {/* Modal Content */}
           <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_0_100px_rgba(34,211,238,0.15)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-950/50">
                  <div className="flex items-center gap-4">
                     <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30">
                        <Terminal className="text-cyan-400" size={24} />
                     </div>
                     <div>
                       <h2 className="font-sci text-white tracking-widest text-xl">SYSTEM DIAGNOSTICS</h2>
                       <span className="text-[10px] font-tech text-cyan-500 uppercase tracking-[0.3em]">{systemData.osInfo.platform} // {systemData.osInfo.kernel}</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => setIsActive(false)}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 transition-all hover:border-cyan-500/50"
                  >
                    <span className="text-[10px] font-sci text-slate-300 group-hover:text-white tracking-wider">RETURN</span>
                    <X size={16} className="text-slate-400 group-hover:text-cyan-400" />
                  </button>
              </div>

              {/* Body: Holographic Grid */}
              <div className="flex-1 overflow-y-auto p-8 relative scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-slate-900">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    
                    {/* -- SECTION 1: CORE HARDWARE -- */}
                    <div className="space-y-6 lg:col-span-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CPU */}
                            <div className="relative p-6 rounded-2xl bg-slate-800/20 border border-white/5 overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Cpu size={60} />
                                </div>
                                <h3 className="text-sm font-sci text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-cyan-500"></span> Processor
                                </h3>
                                <div className="space-y-3 font-tech text-sm text-slate-300">
                                    <div className="text-white text-xs mb-2 border-b border-white/5 pb-2">{systemData.cpuName}</div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Cores / Threads</span>
                                        <span className="text-cyan-300 font-bold">{systemData.cpuUsage.length} Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Load Estimate</span>
                                        <span className="text-fuchsia-300">{Math.round(systemData.cpuUsage.reduce((a,b)=>a+b,0)/systemData.cpuUsage.length)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* GPU */}
                            <div className="relative p-6 rounded-2xl bg-slate-800/20 border border-white/5 overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Monitor size={60} />
                                </div>
                                <h3 className="text-sm font-sci text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-fuchsia-500"></span> Graphics
                                </h3>
                                <div className="space-y-3 font-tech text-sm text-slate-300">
                                    <div className="text-white text-xs mb-2 border-b border-white/5 pb-2">{systemData.gpu.name}</div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Utilization</span>
                                        <span className="text-fuchsia-300 font-bold">{systemData.gpu.usage.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Frequency</span>
                                        <span className="text-slate-300">1.15 GHz</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                     {/* -- SECTION 2: OS DETAILS -- */}
                     <div className="relative p-6 rounded-2xl bg-slate-800/20 border border-white/5 overflow-hidden group hover:border-green-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Layout size={60} />
                        </div>
                        <h3 className="text-sm font-sci text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-green-500"></span> Environment
                        </h3>
                        <ul className="space-y-3 font-tech text-xs text-slate-300">
                           <li className="flex justify-between border-b border-white/5 pb-1">
                               <span className="text-slate-500">DE / WM</span>
                               <span>{systemData.osInfo.de} / {systemData.osInfo.wm}</span>
                           </li>
                           <li className="flex justify-between border-b border-white/5 pb-1">
                               <span className="text-slate-500">Shell</span>
                               <span>{systemData.osInfo.shell}</span>
                           </li>
                           <li className="flex justify-between border-b border-white/5 pb-1">
                               <span className="text-slate-500">Resolution</span>
                               <span>{systemData.osInfo.resolution}</span>
                           </li>
                           <li className="flex justify-between border-b border-white/5 pb-1">
                               <span className="text-slate-500">Packages</span>
                               <span>{systemData.osInfo.packages}</span>
                           </li>
                           <li className="flex justify-between border-b border-white/5 pb-1">
                               <span className="text-slate-500">Terminal</span>
                               <span>{systemData.osInfo.terminal}</span>
                           </li>
                            <li className="flex justify-between pt-1">
                               <span className="text-slate-500">Uptime</span>
                               <span className="text-green-300">{systemData.osInfo.uptime}</span>
                           </li>
                        </ul>
                     </div>

                     {/* -- SECTION 3: STORAGE ARRAY -- */}
                     <div className="lg:col-span-3 relative p-6 rounded-2xl bg-slate-800/20 border border-white/5 overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <HardDrive size={60} />
                        </div>
                        <h3 className="text-sm font-sci text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-500"></span> Storage Array
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {systemData.storage.disks.map((disk, idx) => {
                                const percent = (disk.used / disk.total) * 100;
                                return (
                                    <div key={idx} className="bg-slate-900/50 p-3 rounded border border-white/5">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-sci text-slate-300 truncate">
                                            <Box size={12} className="text-cyan-500" />
                                            {disk.path}
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-2 overflow-hidden">
                                            <div 
                                              className={`h-full ${percent > 90 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                                              style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                                            <span>{disk.used.toFixed(2)} GB</span>
                                            <span>{disk.total.toFixed(2)} GB</span>
                                        </div>
                                        <div className="text-[9px] text-slate-600 mt-1 uppercase text-right">{disk.fs}</div>
                                    </div>
                                );
                            })}
                        </div>
                     </div>

                  </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-950 p-6 flex justify-between items-center border-t border-white/10 relative z-20">
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-tech">
                    <Lock size={12} className="text-green-500" />
                    <span>SECURE CONNECTION ESTABLISHED // IP: {systemData.network.ip}</span>
                 </div>
                 <button 
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-sci tracking-widest rounded shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all transform hover:-translate-y-1"
                    onClick={() => setIsActive(false)}
                 >
                    <ChevronLeft size={16} />
                    RETURN TO MONITOR
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default TechReactor;