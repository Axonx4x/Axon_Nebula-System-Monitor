import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Image as ImageIcon, Music, Film, Maximize2, Repeat } from 'lucide-react';
import { MediaItem } from '../types';

interface AxonMediaInterfaceProps {
  mediaQueue: MediaItem[];
  initialType: 'video' | 'audio' | 'image' | 'file';
  onClose: () => void;
}

const AxonMediaInterface: React.FC<AxonMediaInterfaceProps> = ({ mediaQueue, initialType, onClose }) => {
  // Filter queue based on active tab, but keep track of all files
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'image' | 'file'>(initialType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideshowInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter current items for the view
  const currentItems = mediaQueue.filter(item => {
      if (activeTab === 'video') return item.type === 'video';
      if (activeTab === 'audio') return item.type === 'audio';
      if (activeTab === 'image') return item.type === 'image';
      return true; // file view shows all or generic files
  });

  const activeItem = currentItems[currentIndex] || null;

  useEffect(() => {
    // Reset state when tab changes
    setCurrentIndex(0);
    setIsPlaying(false);
    setProgress(0);
    setIsSlideshow(false);
    if (slideshowInterval.current) clearInterval(slideshowInterval.current);
  }, [activeTab]);

  // Slideshow Logic
  useEffect(() => {
    if (activeTab === 'image' && isSlideshow && currentItems.length > 0) {
      slideshowInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % currentItems.length);
      }, 3000);
    } else if (slideshowInterval.current) {
      clearInterval(slideshowInterval.current);
    }
    return () => { if (slideshowInterval.current) clearInterval(slideshowInterval.current); };
  }, [isSlideshow, activeTab, currentItems.length]);

  // Media Playback Logic
  const togglePlay = () => {
    if (activeTab === 'video' && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    } else if (activeTab === 'audio' && audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    } else if (activeTab === 'image') {
      setIsSlideshow(!isSlideshow);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    const el = e.currentTarget;
    setProgress(el.currentTime);
    setDuration(el.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (activeTab === 'video' && videoRef.current) videoRef.current.currentTime = time;
    if (activeTab === 'audio' && audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (mediaQueue.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Main Glass Panel */}
      <div className="relative w-full max-w-6xl h-[80vh] bg-slate-900/40 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-800/50 to-slate-900">
            <div className="flex items-center gap-4">
               <div className="h-8 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
               <div>
                  <h2 className="text-xl font-sci text-white tracking-widest">AXON MEDIA INTERFACE</h2>
                  <div className="flex gap-4 text-[10px] font-tech text-cyan-500 uppercase tracking-[0.2em] mt-1">
                     <span className={`cursor-pointer hover:text-white ${activeTab==='video' ? 'text-white underline' : ''}`} onClick={()=>setActiveTab('video')}>Video Feed</span>
                     <span className={`cursor-pointer hover:text-white ${activeTab==='image' ? 'text-white underline' : ''}`} onClick={()=>setActiveTab('image')}>Holo-Gallery</span>
                     <span className={`cursor-pointer hover:text-white ${activeTab==='audio' ? 'text-white underline' : ''}`} onClick={()=>setActiveTab('audio')}>Audio Logs</span>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <X className="text-slate-400 group-hover:text-cyan-400" />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* Sidebar Playlist */}
           <div className="w-64 border-r border-white/5 bg-slate-900/30 p-4 overflow-y-auto hidden md:block">
              <h3 className="text-xs font-sci text-slate-500 mb-4 px-2">QUEUE // {activeTab.toUpperCase()}</h3>
              <div className="space-y-2">
                 {currentItems.length === 0 ? (
                   <div className="text-[10px] text-slate-600 px-2 italic">No data stream found...</div>
                 ) : (
                   currentItems.map((item, idx) => (
                     <div 
                        key={item.id} 
                        onClick={() => { setCurrentIndex(idx); setIsPlaying(false); setIsSlideshow(false); }}
                        className={`p-3 rounded border cursor-pointer transition-all ${idx === currentIndex ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-300' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'}`}
                     >
                        <div className="flex items-center gap-2 mb-1">
                           {item.type === 'video' && <Film size={12} />}
                           {item.type === 'audio' && <Music size={12} />}
                           {item.type === 'image' && <ImageIcon size={12} />}
                           <span className="text-xs font-tech truncate w-full">{item.file.name}</span>
                        </div>
                        <div className="text-[9px] opacity-50">{(item.file.size / 1024 / 1024).toFixed(2)} MB</div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           {/* Main Viewer */}
           <div className="flex-1 bg-black/40 relative flex items-center justify-center overflow-hidden">
               {/* Grid Overlay */}
               <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
               
               {activeItem ? (
                 <>
                    {activeTab === 'video' && (
                        <div className="relative w-full h-full flex flex-col">
                            <video 
                                ref={videoRef}
                                src={activeItem.url} 
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => setIsPlaying(false)}
                            />
                            {/* Overlay Controls */}
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                <div className="flex items-center gap-4 mb-2">
                                   <button onClick={togglePlay} className="p-3 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                                   </button>
                                   <div className="flex-1">
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max={duration || 100} 
                                        value={progress} 
                                        onChange={handleSeek}
                                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                      />
                                      <div className="flex justify-between text-[10px] font-mono text-cyan-500 mt-1">
                                          <span>{formatTime(progress)}</span>
                                          <span>{formatTime(duration)}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="text-center text-xs font-sci text-slate-400 tracking-widest">{activeItem.file.name}</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audio' && (
                         <div className="w-full h-full flex flex-col items-center justify-center p-10">
                            {/* Visualizer Circle */}
                            <div className={`w-64 h-64 rounded-full border-4 border-dashed border-fuchsia-500/30 flex items-center justify-center relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
                               <div className="absolute inset-0 rounded-full bg-fuchsia-500/5 blur-2xl animate-pulse"></div>
                               <Music size={64} className="text-fuchsia-400" />
                            </div>
                            
                            <h3 className="mt-8 text-xl font-sci text-white tracking-widest">{activeItem.file.name}</h3>
                            <div className="text-xs font-tech text-fuchsia-400 mt-2">AUDIO STREAM // STEREO</div>

                            <audio ref={audioRef} src={activeItem.url} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
                            
                            {/* Audio Controls */}
                            <div className="w-full max-w-lg mt-8 bg-slate-900/80 p-6 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-6">
                                   <button onClick={togglePlay} className="p-4 rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                   </button>
                                   <div className="flex-1">
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max={duration || 100} 
                                        value={progress} 
                                        onChange={handleSeek}
                                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-fuchsia-500 [&::-webkit-slider-thumb]:rounded-full"
                                      />
                                      <div className="flex justify-between text-[10px] font-mono text-fuchsia-500 mt-1">
                                          <span>{formatTime(progress)}</span>
                                          <span>{formatTime(duration)}</span>
                                      </div>
                                   </div>
                                </div>
                            </div>
                         </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="w-full h-full flex items-center justify-center relative group">
                            <img 
                                src={activeItem.url} 
                                alt="Holo-View" 
                                className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in duration-500"
                            />
                            
                            {/* Slide Show Controls */}
                            <div className="absolute bottom-8 flex items-center gap-4 px-6 py-3 bg-slate-900/80 rounded-full border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => setCurrentIndex(prev => (prev - 1 + currentItems.length) % currentItems.length)} className="p-2 hover:text-cyan-400">
                                    <SkipBack size={20} />
                                </button>
                                <button 
                                    onClick={togglePlay} 
                                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-sci tracking-widest ${isSlideshow ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white'}`}
                                >
                                    {isSlideshow ? 'STOP SCAN' : 'AUTO SCAN'}
                                </button>
                                <button onClick={() => setCurrentIndex(prev => (prev + 1) % currentItems.length)} className="p-2 hover:text-cyan-400">
                                    <SkipForward size={20} />
                                </button>
                            </div>
                            
                            {/* Info Tag */}
                            <div className="absolute top-4 right-4 text-right">
                                <div className="text-xs font-sci text-white drop-shadow-md">{activeItem.file.name}</div>
                                <div className="text-[10px] font-tech text-cyan-400">{(activeItem.file.size / 1024).toFixed(0)} KB // IMG</div>
                            </div>
                        </div>
                    )}
                 </>
               ) : (
                 <div className="flex flex-col items-center opacity-30">
                    <Maximize2 size={48} className="text-slate-500 mb-4 animate-pulse" />
                    <span className="font-tech text-slate-400 tracking-[0.3em]">NO SIGNAL INPUT</span>
                    <span className="text-[10px] text-slate-600 mt-2">Select files from dashboard to initialize stream</span>
                 </div>
               )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AxonMediaInterface;