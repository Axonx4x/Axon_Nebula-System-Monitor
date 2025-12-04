import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoHexagonProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subValue?: string;
  color?: 'cyan' | 'fuchsia';
}

const InfoHexagon: React.FC<InfoHexagonProps> = ({ icon: Icon, title, value, subValue, color = 'cyan' }) => {
  const isCyan = color === 'cyan';
  const iconColor = isCyan ? 'text-cyan-400' : 'text-fuchsia-400';
  const borderColor = isCyan ? 'border-cyan-500/10' : 'border-fuchsia-500/10';
  const glowColor = isCyan ? 'group-hover:shadow-cyan-500/20' : 'group-hover:shadow-fuchsia-500/20';

  return (
    <div className={`relative group w-48 p-5 rounded-3xl border ${borderColor} bg-slate-900/5 backdrop-blur-xl transition-all duration-500 hover:bg-slate-900/10 hover:scale-105 ${glowColor} hover:shadow-2xl overflow-hidden`}>
      
      {/* Top Accent Line */}
      <div className={`absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent ${isCyan ? 'via-cyan-500/50' : 'via-fuchsia-500/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner transition-transform duration-500 group-hover:rotate-12`}>
            <Icon size={24} className={iconColor} />
        </div>
        
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-sci uppercase tracking-widest text-slate-500 mb-1 group-hover:text-slate-300 transition-colors">{title}</span>
          <span className="text-2xl font-tech font-bold text-white tracking-widest drop-shadow-md truncate">{value}</span>
          {subValue && (
            <span className={`text-[10px] font-tech uppercase tracking-wider mt-1 truncate ${isCyan ? 'text-cyan-500/80' : 'text-fuchsia-500/80'}`}>
              {subValue}
            </span>
          )}
        </div>
      </div>

      {/* Spinning Decorative Corner Gears */}
      <div className={`absolute -top-6 -right-6 w-12 h-12 rounded-full border border-dashed ${isCyan ? 'border-cyan-500/20' : 'border-fuchsia-500/20'} animate-spin-slow opacity-20 group-hover:opacity-40 transition-opacity`}></div>
      <div className={`absolute -bottom-6 -left-6 w-14 h-14 rounded-full border border-dotted ${isCyan ? 'border-cyan-500/20' : 'border-fuchsia-500/20'} animate-spin-reverse-slow opacity-20 group-hover:opacity-40 transition-opacity`}></div>
    </div>
  );
};

export default InfoHexagon;