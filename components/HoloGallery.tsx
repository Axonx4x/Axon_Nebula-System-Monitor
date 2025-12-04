import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Maximize2, SkipForward, SkipBack, Pause, Play } from 'lucide-react';
import { MediaItem } from '../types';

interface HoloGalleryProps {
  images: MediaItem[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HoloGallery: React.FC<HoloGalleryProps> = ({ images, onUpload }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlay && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col h-full min-h-[300px] rounded-3xl border border-white/10 bg-slate-900/5 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.1)]">
       {/* Decorative Header */}
       <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 z-20"></div>
       <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <ImageIcon size={14} className="text-cyan-400" />
          <span className="text-[10px] font-sci tracking-widest text-slate-300">HOLO-GALLERY</span>
       </div>

       {/* Upload Action */}
       <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-slate-900/50 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 transition-all group/btn"
          >
             <Upload size={14} className="text-slate-400 group-hover/btn:text-cyan-400" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.ico" 
            multiple 
            className="hidden" 
            onChange={onUpload}
          />
       </div>

       {/* Main Display Area */}
       <div className="flex-1 relative overflow-hidden bg-black/20">
          {images.length > 0 ? (
            <>
               {/* Image with Ken Burns Effect */}
               <div key={currentIndex} className="absolute inset-0 animate-in fade-in duration-700">
                  <img 
                    src={images[currentIndex].url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[10s] ease-linear"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
               </div>
               
               {/* Controls Overlay */}
               <div className="absolute bottom-0 inset-x-0 p-4 flex justify-between items-end bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-xs font-tech text-cyan-200">
                      <div className="truncate max-w-[150px]">{images[currentIndex].file.name}</div>
                      <div className="text-[9px] text-slate-400">INDEX: {currentIndex + 1} / {images.length}</div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={prevImage} className="p-1 hover:text-cyan-400"><SkipBack size={16} /></button>
                     <button onClick={() => setIsAutoPlay(!isAutoPlay)} className="p-1 hover:text-cyan-400">
                        {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
                     </button>
                     <button onClick={nextImage} className="p-1 hover:text-cyan-400"><SkipForward size={16} /></button>
                  </div>
               </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
               <Maximize2 size={32} className="mb-2" />
               <span className="text-[10px] font-tech uppercase tracking-widest">No Visual Data</span>
            </div>
          )}

          {/* Sci-Fi Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
       </div>
    </div>
  );
};

export default HoloGallery;