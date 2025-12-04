
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Upload, Music, Film, List, X, Shuffle } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaPlayerWidgetProps {
  queue: MediaItem[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MediaPlayerWidget: React.FC<MediaPlayerWidgetProps> = ({ queue, onUpload }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(null);

  const currentTrack = queue[currentIndex];

  // Initialize Visualizer
  const initVisualizer = (element: HTMLMediaElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (!analyserRef.current) {
       analyserRef.current = ctx.createAnalyser();
       analyserRef.current.fftSize = 256;
    }

    try {
        if (!sourceRef.current) {
            sourceRef.current = ctx.createMediaElementSource(element);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(ctx.destination);
        }
    } catch (e) {
        // Element already connected
    }

    drawVisualizer();
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (!canvasCtx) return;

    const render = () => {
      if (!canvasRef.current) return;
      
      analyserRef.current!.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2; // Scale down
        
        // Sci-fi gradient color
        const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#d946ef'); // Fuchsia
        gradient.addColorStop(1, '#22d3ee'); // Cyan

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Mirror reflection effect
        canvasCtx.fillStyle = 'rgba(217, 70, 239, 0.1)';
        canvasCtx.fillRect(x, canvas.height, barWidth, barHeight * 0.5);

        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Effect to handle Auto-Play when track changes
  useEffect(() => {
    if (isPlaying && currentTrack) {
        const timeout = setTimeout(() => {
            const el = currentTrack.type === 'video' ? videoRef.current : audioRef.current;
            if (el) {
                el.play().catch(e => console.error("Autoplay interrupted", e));
            }
        }, 100); 
        return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack?.type === 'audio') {
        setTimeout(() => {
            if (audioRef.current) {
                if (audioContextRef.current?.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                initVisualizer(audioRef.current);
            }
        }, 100);
    } else {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, currentTrack]);

  // Controls
  const togglePlay = () => {
    const el = currentTrack?.type === 'video' ? videoRef.current : audioRef.current;
    if (!el) return;

    if (isPlaying) {
        el.pause();
    } else {
        el.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    
    let nextIndex;
    if (isShuffling) {
        // Improved shuffle: Ensure we pick a new track
        if (queue.length === 1) nextIndex = 0;
        else {
            do {
                nextIndex = Math.floor(Math.random() * queue.length);
            } while (nextIndex === currentIndex);
        }
    } else {
        nextIndex = (currentIndex + 1) % queue.length;
    }
    
    setCurrentIndex(nextIndex);
  };

  const prevTrack = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    setProgress(e.currentTarget.currentTime);
    setDuration(e.currentTarget.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    const el = currentTrack?.type === 'video' ? videoRef.current : audioRef.current;
    if (el) el.currentTime = time;
    setProgress(time);
  };

  const handleTrackEnd = () => {
      if (isLooping) {
          const el = currentTrack?.type === 'video' ? videoRef.current : audioRef.current;
          if (el) {
              el.currentTime = 0;
              el.play();
          }
      } else {
          nextTrack();
      }
  };

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full min-h-[350px] rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.1)]">
       
       {/* Decorative Header */}
       <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50 z-20"></div>
       <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {currentTrack?.type === 'video' ? <Film size={14} className="text-fuchsia-400"/> : <Music size={14} className="text-fuchsia-400"/>}
          <span className="text-[10px] font-sci tracking-widest text-slate-300">MEDIA PLAYER // {currentTrack ? currentTrack.type.toUpperCase() : 'IDLE'}</span>
       </div>

       {/* Top Right Controls */}
       <div className="absolute top-4 right-4 z-30 flex gap-2">
           <button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-2 rounded-full border border-white/10 hover:border-fuchsia-500/50 transition-all ${showPlaylist ? 'bg-fuchsia-500 text-white' : 'bg-slate-900/50 text-slate-400'}`}>
               <List size={14} />
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full bg-slate-900/50 hover:bg-fuchsia-500/20 border border-white/10 hover:border-fuchsia-500/50 transition-all group/btn">
               <Upload size={14} className="text-slate-400 group-hover/btn:text-fuchsia-400" />
           </button>
           <input 
               type="file" 
               ref={fileInputRef} 
               accept="audio/*,video/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.wma,.mp4,.webm,.mkv,.mov,.avi,.wmv,.flv,.m4v,.3gp" 
               multiple 
               className="hidden" 
               onChange={onUpload} 
           />
       </div>

       {/* Content Area */}
       <div className="flex-1 relative flex bg-black/30">
           
           {/* Playlist Overlay */}
           <div className={`absolute inset-y-0 left-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 transform transition-transform duration-300 ${showPlaylist ? 'translate-x-0' : '-translate-x-full'}`}>
               <div className="p-4 border-b border-white/10 flex justify-between items-center">
                   <span className="text-xs font-sci text-fuchsia-400">PLAYLIST QUEUE</span>
                   <button onClick={() => setShowPlaylist(false)}><X size={14} className="text-slate-500 hover:text-white" /></button>
               </div>
               <div className="p-2 overflow-y-auto h-[calc(100%-50px)] space-y-1">
                   {queue.map((item, idx) => (
                       <div key={item.id} onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }} className={`p-2 rounded text-xs font-tech cursor-pointer truncate ${idx === currentIndex ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-slate-400 hover:bg-white/5'}`}>
                           {item.file.name}
                       </div>
                   ))}
               </div>
           </div>

           {/* Main Display */}
           <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
                {currentTrack ? (
                    <>
                        {currentTrack.type === 'video' ? (
                            <video 
                                ref={videoRef}
                                src={currentTrack.url}
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleTrackEnd}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center relative">
                                {/* Sci-Fi Visualizer Canvas */}
                                <canvas ref={canvasRef} width="600" height="200" className="absolute bottom-0 w-full h-1/2 opacity-60"></canvas>
                                
                                {/* Center Album Art / Icon */}
                                <div className={`relative w-32 h-32 rounded-full border-2 border-fuchsia-500/30 flex items-center justify-center z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                                    <div className="absolute inset-0 rounded-full bg-fuchsia-500/10 blur-xl animate-pulse"></div>
                                    <Music size={40} className="text-fuchsia-400" />
                                </div>
                                <div className="z-10 mt-6 text-center px-8">
                                    <h3 className="text-sm font-sci text-white truncate max-w-xs drop-shadow-md">{currentTrack.file.name}</h3>
                                    <span className="text-[10px] font-tech text-fuchsia-400 tracking-widest">AUDIO SPECTRUM ANALYSIS</span>
                                </div>
                                <audio 
                                    ref={audioRef} 
                                    src={currentTrack.url} 
                                    onTimeUpdate={handleTimeUpdate} 
                                    onEnded={handleTrackEnd}
                                    crossOrigin="anonymous"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-slate-600 flex flex-col items-center">
                        <Upload size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-sci tracking-widest">EMPTY QUEUE</span>
                    </div>
                )}
           </div>

           {/* Bottom Controls Bar */}
           <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-900/80 backdrop-blur-md border-t border-white/5 flex items-center px-4 gap-4 z-30">
               <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.4)] shrink-0 transition-transform active:scale-95">
                   {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-1"/>}
               </button>
               
               <div className="flex-1 flex flex-col justify-center">
                   <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={progress} 
                      onChange={handleSeek}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-fuchsia-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(217,70,239,1)]"
                   />
                   <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                       <span>{formatTime(progress)}</span>
                       <span>{formatTime(duration)}</span>
                   </div>
               </div>

               <div className="flex items-center gap-2 text-slate-400">
                   <button 
                       onClick={() => setIsShuffling(!isShuffling)} 
                       className={`p-2 transition-colors ${isShuffling ? 'text-fuchsia-400' : 'hover:text-white'}`}
                       title="Shuffle Playlist"
                   >
                       <Shuffle size={16} />
                   </button>
                   <button onClick={prevTrack} className="p-2 hover:text-white"><SkipBack size={16} /></button>
                   <button onClick={nextTrack} className="p-2 hover:text-white"><SkipForward size={16} /></button>
                   <button 
                       onClick={() => setIsLooping(!isLooping)} 
                       className={`p-2 transition-colors ${isLooping ? 'text-fuchsia-400' : 'hover:text-white'}`}
                       title="Loop Track"
                   >
                       <Repeat size={16} />
                   </button>
               </div>
           </div>
       </div>
    </div>
  );
};

export default MediaPlayerWidget;
