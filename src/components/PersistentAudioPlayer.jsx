import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Maximize2, 
  X, 
  Radio, 
  Music, 
  Heart,
  FileAudio
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.jsx';

export const PersistentAudioPlayer = ({ onOpenMusic }) => {
  const {
    nowPlaying,
    sourceType,
    isPlaying,
    togglePlay,
    skipNext,
    skipPrevious,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    pauseAudio,
    activeYoutube,
    toggleLike,
    isLiked
  } = useMusic();

  // If nothing is playing and no source has been selected, hide the bottom player
  if (!isPlaying && !activeYoutube && (!nowPlaying.title || nowPlaying.title === 'No Station Selected')) {
    return null;
  }

  const isYt = sourceType === 'youtube';

  return (
    <div className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl backdrop-blur-xl rounded-2xl shadow-2xl p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 text-white animate-in fade-in slide-in-from-bottom-3 duration-300 ${
      isYt
        ? 'bg-[#0f0f0f]/95 border border-red-500/40 shadow-red-950/40'
        : 'bg-slate-900/95 border border-indigo-500/40 shadow-indigo-950/40'
    }`}>
      {/* Left: Thumbnail & Track Info */}
      <div 
        onClick={onOpenMusic}
        className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1 max-w-sm sm:max-w-md"
      >
        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-md">
          <img
            src={nowPlaying.cover}
            alt={nowPlaying.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex items-end gap-0.5 h-3">
                <span className={`w-0.5 animate-pulse rounded-full h-3 ${isYt ? 'bg-red-500' : 'bg-indigo-400'}`}></span>
                <span className={`w-0.5 animate-pulse rounded-full h-2 ${isYt ? 'bg-red-500' : 'bg-indigo-400'}`}></span>
                <span className={`w-0.5 animate-pulse rounded-full h-3.5 ${isYt ? 'bg-red-500' : 'bg-indigo-400'}`}></span>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {isYt ? (
              <span className="text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-800/60">
                YouTube Music
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-1.5 py-0.2 bg-indigo-500/20 rounded">
                {sourceType === 'radio' ? 'Radio' : 'Audio'}
              </span>
            )}
            <span className="text-xs text-neutral-400 truncate hidden sm:inline">Now Playing</span>
          </div>
          <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
            isYt ? 'group-hover:text-red-400 text-white' : 'group-hover:text-indigo-300 text-white'
          }`}>
            {nowPlaying.title}
          </h4>
          <p className="text-[11px] text-neutral-400 truncate">
            {nowPlaying.artist}
          </p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {isYt && (
          <button
            onClick={skipPrevious}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-xl text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md ${
            isYt
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
          }`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {isYt && (
          <button
            onClick={skipNext}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenMusic}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer hidden xs:flex items-center gap-1 text-xs font-semibold"
          title="Open YouTube Music"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isYt ? 'YouTube Music' : 'Open Hub'}</span>
        </button>
      </div>

      {/* Right: Volume & Dismiss */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className={`w-20 h-1.5 bg-neutral-800 rounded-lg cursor-pointer ${
              isYt ? 'accent-red-600' : 'accent-indigo-500'
            }`}
          />
        </div>

        <button
          onClick={pauseAudio}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/10 transition-colors cursor-pointer"
          title="Stop & Close Player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
