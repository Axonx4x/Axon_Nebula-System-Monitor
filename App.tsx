
import React, { useEffect, useState, useRef } from 'react';
import { Cpu, HardDrive, Activity, Wifi, Image as ImageIcon } from 'lucide-react';
import { SystemData, BatteryStatus, NavigatorWithBattery, MediaItem } from './types';
import { getSimulatedSystemData, updateStorageEstimate, REAL_CORES } from './services/mockDataService';
import CpuVisualizer from './components/CpuVisualizer';
import InfoHexagon from './components/InfoHexagon';
import TechReactor from './components/TechReactor';
import FooterWidgets from './components/FooterWidgets';
import HoloGallery from './components/HoloGallery';
import MediaPlayerWidget from './components/MediaPlayerWidget';

const App: React.FC = () => {
  // Initialize with null or basic default to prevent flicker before first data load
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [battery, setBattery] = useState<BatteryStatus | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaQueue, setMediaQueue] = useState<MediaItem[]>([]);
  const [imageQueue, setImageQueue] = useState<MediaItem[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    updateStorageEstimate();

    const fetchData = async () => {
      const data = await getSimulatedSystemData();
      setSystemData(data);
      setCurrentTime(Date.now());
    };

    // Initial Fetch
    fetchData();

    const interval = setInterval(fetchData, 1000);

    const initBattery = async () => {
      try {
        const nav = navigator as NavigatorWithBattery;
        if (nav.getBattery) {
          const bat = await nav.getBattery();
          
          const updateBattery = () => {
            setBattery({
              charging: bat.charging,
              level: bat.level,
              chargingTime: bat.chargingTime,
              dischargingTime: bat.dischargingTime,
            });
          };

          updateBattery();
          
          bat.addEventListener('levelchange', updateBattery);
          bat.addEventListener('chargingchange', updateBattery);
          
          return () => {
             bat.removeEventListener('levelchange', updateBattery);
             bat.removeEventListener('chargingchange', updateBattery);
          };
        }
      } catch (e) {
        console.warn("Battery API not supported");
      }
    };

    initBattery();

    return () => clearInterval(interval);
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = (Array.from(e.target.files) as File[]).map((file) => {
          const ext = file.name.split('.').pop()?.toLowerCase();
          let type: 'video' | 'audio' = 'audio';

          if (file.type.startsWith('video/')) {
              type = 'video';
          } else if (file.type.startsWith('audio/')) {
              type = 'audio';
          } else if (ext) {
              if (['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'flv', 'm4v', '3gp'].includes(ext)) {
                  type = 'video';
              }
          }
          
          return {
              id: Math.random().toString(36).substr(2, 9),
              file,
              url: URL.createObjectURL(file),
              type
          } as MediaItem;
      });
      setMediaQueue(prev => [...prev, ...newFiles]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       const newFiles = (Array.from(e.target.files) as File[]).map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          url: URL.createObjectURL(file),
          type: 'image'
      } as MediaItem));
      setImageQueue(prev => [...prev, ...newFiles]);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBgImage(URL.createObjectURL(file));
    }
  };

  if (!systemData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-sci">INITIALIZING SYSTEM...</div>;

  const ramPercent = (systemData.ram.used / systemData.ram.total) * 100;

  return (
    <div className="min-h-screen w-full relative bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* --- BACKGROUND LAYERS (Fixed) --- */}
      {bgImage ? (
        <div 
          className="fixed inset-0 bg-cover bg-center pointer-events-none -z-50 transition-all duration-1000 opacity-60"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-slate-950/70"></div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none -z-50"></div>
      )}
      
      {/* Ambient Blobs (Still visible over custom BG for effect) */}
      <div className="fixed top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse -z-40" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse -z-40" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>

      {/* GIANT ROTATING BACKGROUND GEAR */}
      <div className="fixed -right-[20%] top-[10%] w-[80vw] h-[80vw] opacity-[0.03] pointer-events-none animate-spin-super-slow -z-30">
         <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M50 0 L55 10 L90 10 L95 25 L85 35 L95 50 L85 65 L95 80 L90 95 L55 90 L50 100 L45 90 L10 95 L5 80 L15 65 L5 50 L15 35 L5 20 L10 5 L45 10 Z" 
              fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.2" />
         </svg>
      </div>

      <div className="fixed inset-0 opacity-10 pointer-events-none -z-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>
      
      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full min-h-screen h-auto p-6 lg:p-8 flex flex-col gap-8 max-w-[1920px] mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-2 relative drag-region">
          <div className="flex flex-col">
             <h1 className="text-4xl font-sci tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse-fast">
               AXON~TESLA TECH
             </h1>
             <div className="flex items-center gap-2 mt-2">
                <span className="h-[2px] w-8 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                <span className="text-[10px] font-tech text-cyan-500 uppercase tracking-[0.3em]">System Diagnostics // Online</span>
                <span className="h-[2px] w-32 bg-gradient-to-r from-cyan-500/50 to-transparent"></span>
             </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
             <div className="flex items-center justify-end gap-2 text-cyan-400/80 mb-1">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                <span className="text-xs font-sci">LINK ESTABLISHED</span>
             </div>
             <span className="block text-xs font-tech text-slate-500 tracking-[0.2em]">CACHY OS // PLASMA 6.0</span>
             
             {/* Background Changer Button */}
             <button 
                onClick={() => bgInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1 mt-1 rounded bg-slate-800/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
             >
                <ImageIcon size={12} className="text-slate-500 group-hover:text-cyan-400" />
                <span className="text-[9px] font-tech text-slate-500 group-hover:text-white uppercase tracking-widest">Set Wallpaper</span>
             </button>
             <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={handleBgUpload} />
          </div>
        </header>

        {/* MAIN GRID LAYOUT: 3 COLUMNS (System, Core, Media) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
          
          {/* COLUMN 1: System Monitors (3 Cols wide) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <CpuVisualizer usage={systemData.cpuUsage} />
            
            {/* Fluid Graph Container */}
            <div className="flex-1 p-6 rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.1)] min-h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-sci text-fuchsia-400 tracking-widest uppercase mb-1">Thermal Output</span>
                        <span className="text-3xl font-tech text-white">{systemData.cpuTemp.toFixed(1)}°C</span>
                    </div>
                    <Activity size={24} className="text-fuchsia-500/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end gap-[2px] px-6 pb-6 opacity-60">
                     {Array(24).fill(0).map((_, i) => {
                         const h = Math.random() * 80 + 10;
                         return (
                             <div key={i} className="flex-1 bg-gradient-to-t from-fuchsia-600 to-transparent rounded-t-sm transition-all duration-700 ease-in-out" style={{ height: `${h}%` }}></div>
                         )
                     })}
                </div>
            </div>
          </div>

          {/* COLUMN 2: Core Reactor & Stats (5 Cols wide) */}
          <div className="xl:col-span-5 flex flex-col items-center gap-6">
            <div className="flex flex-wrap gap-4 w-full justify-center xl:justify-between">
                <InfoHexagon 
                    icon={HardDrive} 
                    title="Storage" 
                    value={`${systemData.storage.total.toFixed(0)}G`} 
                    subValue="QUOTA"
                />
                <InfoHexagon 
                    icon={Wifi} 
                    title="Network" 
                    value={`${systemData.network.down.toFixed(1)} Mb`} 
                    subValue={`Up: ${systemData.network.up.toFixed(1)}`}
                    color="fuchsia"
                />
            </div>

            <div className="relative z-20 my-4">
               <TechReactor systemData={systemData} />
            </div>

            <div className="flex flex-wrap gap-4 w-full justify-center xl:justify-between">
               <InfoHexagon 
                    icon={Cpu} 
                    title="Proc Unit" 
                    value={`${REAL_CORES} CORE`} 
                    subValue="DETECTED"
                />
                 <InfoHexagon 
                    icon={Activity} 
                    title="GPU Core" 
                    value={`${systemData.gpu.usage.toFixed(0)}%`} 
                    subValue={`${systemData.gpu.temp.toFixed(0)}°C`}
                    color="fuchsia"
                />
            </div>
          </div>

          {/* COLUMN 3: Media Center (4 Cols wide) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="flex-1 min-h-[250px]">
                 <HoloGallery images={imageQueue} onUpload={handleImageUpload} />
             </div>
             
             <div className="flex-1 min-h-[350px]">
                 <MediaPlayerWidget queue={mediaQueue} onUpload={handleMediaUpload} />
             </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-2 pt-0 relative z-20 pb-6">
          <FooterWidgets battery={battery} volume={34} ram={ramPercent} systemDataForExport={systemData} />
        </footer>

      </div>
    </div>
  );
};

export default App;
