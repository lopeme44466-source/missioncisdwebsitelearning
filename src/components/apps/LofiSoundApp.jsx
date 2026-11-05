import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Flame, 
  Coffee, 
  Wind, 
  Music
} from 'lucide-react';

export const LofiSoundApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState({
    rain: 0.6,
    whiteNoise: 0.4,
    lofiChords: 0.5,
  });

  const audioCtxRef = useRef(null);
  const nodesRef = useRef({});

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startSounds = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // 1. Synthesize Pink/Brown Noise for Rain
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Filter rain to sound like soft rainfall
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 900;

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(volumes.rain * 0.4, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(ctx.destination);
    rainSource.start();

    // 2. White/Brown Noise for Focus
    const focusGain = ctx.createGain();
    focusGain.gain.setValueAtTime(volumes.whiteNoise * 0.15, ctx.currentTime);
    const focusFilter = ctx.createBiquadFilter();
    focusFilter.type = 'lowpass';
    focusFilter.frequency.value = 400;

    const focusSource = ctx.createBufferSource();
    focusSource.buffer = noiseBuffer;
    focusSource.loop = true;
    focusSource.connect(focusFilter);
    focusFilter.connect(focusGain);
    focusGain.connect(ctx.destination);
    focusSource.start();

    // 3. Gentle synthesized Lofi Drone Chords (warm minor 7th)
    const chordsGain = ctx.createGain();
    chordsGain.gain.setValueAtTime(volumes.lofiChords * 0.07, ctx.currentTime);

    const freqs = [196.00, 246.94, 293.66, 349.23]; // G3, B3, D4, F4
    const oscillators = freqs.map((f) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      osc.connect(chordsGain);
      osc.start();
      return osc;
    });
    chordsGain.connect(ctx.destination);

    nodesRef.current = {
      rainSource,
      rainGain,
      focusSource,
      focusGain,
      chordsGain,
      oscillators,
    };

    setIsPlaying(true);
  };

  const stopSounds = () => {
    try {
      if (nodesRef.current.rainSource) nodesRef.current.rainSource.stop();
      if (nodesRef.current.focusSource) nodesRef.current.focusSource.stop();
      if (nodesRef.current.oscillators) {
        nodesRef.current.oscillators.forEach((osc) => osc.stop());
      }
    } catch {
      // Ignored
    }
    nodesRef.current = {};
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSounds();
    } else {
      startSounds();
    }
  };

  const handleVolumeChange = (type, val) => {
    const num = parseFloat(val);
    setVolumes((prev) => ({ ...prev, [type]: num }));

    if (nodesRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      if (type === 'rain' && nodesRef.current.rainGain) {
        nodesRef.current.rainGain.gain.setValueAtTime(num * 0.4, now);
      }
      if (type === 'whiteNoise' && nodesRef.current.focusGain) {
        nodesRef.current.focusGain.gain.setValueAtTime(num * 0.15, now);
      }
      if (type === 'lofiChords' && nodesRef.current.chordsGain) {
        nodesRef.current.chordsGain.gain.setValueAtTime(num * 0.07, now);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSounds();
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Study Lofi & Ambient Focus Audio</h3>
            <p className="text-xs text-slate-400">Synthesized background audio for homework and test study</p>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            isPlaying 
              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isPlaying ? <><Pause className="w-3.5 h-3.5" /> Pause Audio</> : <><Play className="w-3.5 h-3.5" /> Play Audio</>}
        </button>
      </div>

      {/* Sound Channels */}
      <div className="space-y-4">
        {/* Channel 1: Rain */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Rainfall Ambience</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Math.round(volumes.rain * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.rain}
            onChange={(e) => handleVolumeChange('rain', e.target.value)}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Channel 2: Lofi Chords */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Music className="w-4 h-4 text-indigo-400" />
              <span>Warm Lofi Piano Chords</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Math.round(volumes.lofiChords * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.lofiChords}
            onChange={(e) => handleVolumeChange('lofiChords', e.target.value)}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Channel 3: Brown Focus Noise */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Deep Focus Noise</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Math.round(volumes.whiteNoise * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volumes.whiteNoise}
            onChange={(e) => handleVolumeChange('whiteNoise', e.target.value)}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
