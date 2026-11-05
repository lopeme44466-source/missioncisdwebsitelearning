import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Edit3, 
  Check, 
  ShieldAlert, 
  Gamepad2, 
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';

export const GamePlayer = ({ onTriggerPanic }) => {
  const defaultBlob = "blob:https://175195364-atari-embeds.googleusercontent.com/ca243e85-392f-41ac-b7cf-9340dae67589";
  
  const [iframeSrc, setIframeSrc] = useState(() => {
    return localStorage.getItem('prism_custom_game_src') || defaultBlob;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [inputSrc, setInputSrc] = useState(iframeSrc);
  const [reloadKey, setReloadKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const handleSaveSrc = (e) => {
    e?.preventDefault();
    if (!inputSrc.trim()) return;
    setIframeSrc(inputSrc.trim());
    localStorage.setItem('prism_custom_game_src', inputSrc.trim());
    setIsEditing(false);
    setIframeError(false);
    setReloadKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    const el = document.getElementById('zoneFullscreenFrame') || containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          containerRef.current?.requestFullscreen().catch(() => {});
        });
      }
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
    setIframeError(false);
  };

  const handleResetDefault = () => {
    setInputSrc(defaultBlob);
    setIframeSrc(defaultBlob);
    localStorage.setItem('prism_custom_game_src', defaultBlob);
    setIsEditing(false);
    setIframeError(false);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div ref={containerRef} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[820px] max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Atari & Google Sites Unblocked Player
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">
                id: zoneFullscreenFrame
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct fullscreen game embed with responsive controls
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Panic */}
          <button
            onClick={onTriggerPanic}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Instant Disguise (Esc)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Panic [Esc]</span>
          </button>

          {/* Edit Embed URL */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isEditing 
                ? 'bg-indigo-600 text-white border-indigo-500' 
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Change Game Embed URL"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change Embed</span>
          </button>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
            title="Reload Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            title="Enter Fullscreen Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Helpful Guidance Notice */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Notice: <code className="text-slate-300">blob:</code> URLs are browser-session specific. If blank, paste an HTTPS link or play our built-in Breakout & Invaders!</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const testUrl = "https://play2048.co";
              setInputSrc(testUrl);
              setIframeSrc(testUrl);
              localStorage.setItem('prism_custom_game_src', testUrl);
              setReloadKey(k => k + 1);
            }}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer"
          >
            Load 2048 Web
          </button>
        </div>
      </div>

      {/* Edit URL Accordion */}
      {isEditing && (
        <form onSubmit={handleSaveSrc} className="bg-slate-950/95 border-b border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Embed URL / Blob:</span>
          <input
            type="text"
            value={inputSrc}
            onChange={(e) => setInputSrc(e.target.value)}
            placeholder="blob:https://... or https://..."
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs outline-none focus:border-indigo-500"
          />
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
            >
              Reset to Atari Blob
            </button>
          </div>
        </form>
      )}

      {/* Main iFrame Viewport */}
      <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
        {/* Exact Requested Game iFrame */}
        <iframe
          key={reloadKey}
          ref={iframeRef}
          id="zoneFullscreenFrame"
          src={iframeSrc}
          className="w-full h-full border-none select-none bg-black"
          allow="autoplay; fullscreen; keyboard; gamepad; clipboard-read; clipboard-write"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          title="Atari Embed Game"
          onError={() => setIframeError(true)}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-500 shrink-0">Active Source:</span>
          <span className="truncate max-w-xs sm:max-w-md font-mono text-slate-300 text-[11px]">
            {iframeSrc}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Need another game?</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Paste new blob or URL →
          </button>
        </div>
      </div>
    </div>
  );
};
