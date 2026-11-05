import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Search, 
  Upload, 
  Radio, 
  Music, 
  Youtube, 
  FileAudio, 
  Link as LinkIcon, 
  Sparkles, 
  Clock, 
  ListMusic, 
  Disc, 
  Headphones, 
  Flame, 
  Sliders, 
  Check, 
  RotateCcw,
  CloudRain,
  Coffee,
  Waves,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext.jsx';

export const MusicPlayerApp = () => {
  const {
    sourceType,
    isPlaying,
    isLoading,
    errorMsg,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    activeStation,
    activeYoutube,
    activeFile,
    customStreamUrl,
    currentTime,
    duration,
    seekTo,
    playStation,
    playCustomStream,
    playLocalFile,
    playYoutube,
    togglePlay,
    stations,
    popularTracks,
    sleepTimerMinutes,
    setSleepTimerMinutes,
    sleepTimerRemaining
  } = useMusic();

  const [activeTab, setActiveTab] = useState('youtube'); // 'youtube' | 'radio' | 'local' | 'custom' | 'ambient'
  const [searchInput, setSearchInput] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Minecraft Sweden C418',
    'Lofi Girl Chill Beats',
    'Interstellar Theme Hans Zimmer',
    'Chopin Nocturne Op. 9 No. 2'
  ]);

  // Ambient sound synthesizer generators (Web Audio API)
  const [ambientSounds, setAmbientSounds] = useState({
    rain: { active: false, gain: 0.4 },
    cafe: { active: false, gain: 0.3 },
    fire: { active: false, gain: 0.35 },
    vinyl: { active: false, gain: 0.25 }
  });
  const audioCtxRef = useRef(null);
  const ambientNodesRef = useRef({});

  // File input ref
  const fileInputRef = useRef(null);

  // Setup Web Audio for Ambient Layer
  const toggleAmbientSound = (soundType) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setAmbientSounds((prev) => {
        const nextActive = !prev[soundType].active;
        if (nextActive) {
          startAmbientNode(soundType, prev[soundType].gain);
        } else {
          stopAmbientNode(soundType);
        }
        return {
          ...prev,
          [soundType]: { ...prev[soundType], active: nextActive }
        };
      });
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  };

  const startAmbientNode = (type, gainVal) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate brown/pink noise variations
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        // Brown noise + high pass
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'fire') {
        // Crackle effect
        const crackle = Math.random() > 0.992 ? (Math.random() * 2 - 1) * 1.5 : 0;
        data[i] = (Math.random() * 0.1 - 0.05) + crackle;
      } else if (type === 'cafe') {
        // Soft pink noise
        data[i] = (Math.random() * 0.15 - 0.075);
      } else {
        // Vinyl crackle
        const pop = Math.random() > 0.996 ? (Math.random() * 1.2) : 0;
        data[i] = pop;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
    } else if (type === 'fire') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
    }

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    ambientNodesRef.current[type] = { source: noiseSource, gain: gainNode };
  };

  const stopAmbientNode = (type) => {
    if (ambientNodesRef.current[type]) {
      try {
        ambientNodesRef.current[type].source.stop();
        ambientNodesRef.current[type].source.disconnect();
      } catch (e) {}
      delete ambientNodesRef.current[type];
    }
  };

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      Object.keys(ambientNodesRef.current).forEach((key) => {
        try {
          ambientNodesRef.current[key].source.stop();
        } catch (e) {}
      });
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    playYoutube(searchInput.trim());
    if (!recentSearches.includes(searchInput.trim())) {
      setRecentSearches((prev) => [searchInput.trim(), ...prev.slice(0, 5)]);
    }
  };

  const handleCustomStreamSubmit = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    playCustomStream(customUrlInput.trim(), customTitleInput.trim() || 'Custom Radio Stream');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      playLocalFile(file);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 border border-indigo-700/50 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5" />
              <span>Unblocked Student Audio Center</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Hear Any Music <span className="text-indigo-400">Hub</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Listen to any song, YouTube video, artist, or live radio stream without school filters. Music keeps playing even when you play games or take notes.
            </p>
          </div>

          {/* Quick Sleep Timer Pill */}
          <div className="flex items-center gap-3 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-xl p-3 shrink-0">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div className="text-xs">
              <div className="text-slate-400 font-medium">Study Timer</div>
              <div className="text-white font-bold">
                {sleepTimerRemaining !== null
                  ? `${Math.floor(sleepTimerRemaining / 60)}m ${sleepTimerRemaining % 60}s left`
                  : 'Timer Off'}
              </div>
            </div>
            <div className="flex gap-1">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSleepTimerMinutes(sleepTimerMinutes === mins ? null : mins)}
                  className={`px-2 py-1 text-[11px] rounded font-semibold cursor-pointer transition-colors ${
                    sleepTimerMinutes === mins
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Error Notice if any */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button 
              onClick={() => playStation(stations[0])}
              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-500"
            >
              Play Default Station
            </button>
          </div>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'youtube'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Youtube className="w-4 h-4 text-red-400" />
          <span>Search Any Song / YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('radio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'radio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Live 24/7 Radio Stations</span>
        </button>

        <button
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'local'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileAudio className="w-4 h-4 text-amber-400" />
          <span>Play Local MP3 / Files</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4 text-cyan-400" />
          <span>Direct Stream URL</span>
        </button>

        <button
          onClick={() => setActiveTab('ambient')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ambient'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Ambient Sound Mixer</span>
        </button>
      </div>

      {/* TAB CONTENT 1: SEARCH ANY SONG OR YOUTUBE */}
      {activeTab === 'youtube' && (
        <div className="space-y-6">
          {/* Universal Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any song title, artist, phonk, anime OST, or paste YouTube link..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-28 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
              >
                Play Track
              </button>
            </div>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Trending:
            </span>
            {[
              'Lofi Hip Hop Study',
              'Minecraft OST C418',
              'Gym Drift Phonk',
              'Chopin Piano Focus',
              'Synthwave 80s Chill',
              'Anime Ghibli Piano',
              'Linkin Park Numb',
              'Travis Scott Type Beats'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchInput(tag);
                  playYoutube(tag);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Active YouTube Player Container (if selected) */}
          {sourceType === 'youtube' && activeYoutube && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base line-clamp-1">{activeYoutube.title}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{activeYoutube.artist} • Privacy-Mode Embed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Active Stream
                  </span>
                </div>
              </div>

              {/* YouTube Privacy-Enhanced Iframe */}
              <div className="relative aspect-video w-full max-h-[460px] bg-black rounded-xl overflow-hidden shadow-inner">
                <iframe
                  title="Unblocked Music Player"
                  src={activeYoutube.embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <p className="text-xs text-slate-400 text-center">
                Audio streams through the embed player. Switch tabs or minimize without losing your place!
              </p>
            </div>
          )}

          {/* Curated Popular Requests Library */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Popular Student Favorites & Instant Tracks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playYoutube(track)}
                  className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${track.id}/hqdefault.jpg`}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Play className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{track.artist}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                      {track.category}
                    </span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: LIVE RADIO STATIONS */}
      {activeTab === 'radio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              24/7 Commercial-Free Live Streams
            </h2>
            <span className="text-xs text-slate-400">Direct streaming • High audio bitrate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stations.map((st) => {
              const isThisStation = sourceType === 'radio' && activeStation?.id === st.id;
              const isStationPlaying = isThisStation && isPlaying;

              return (
                <div
                  key={st.id}
                  onClick={() => playStation(st)}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between ${
                    isThisStation
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500'
                      : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top: Cover + Badges */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-950">
                      <img
                        src={st.cover}
                        alt={st.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {isStationPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-white animate-pulse rounded-full h-3"></span>
                            <span className="w-1 bg-white animate-pulse rounded-full h-4"></span>
                            <span className="w-1 bg-white animate-pulse rounded-full h-2"></span>
                          </div>
                        ) : (
                          <Play className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                        {st.genre}
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                        {st.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{st.artist}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {st.description}
                  </p>

                  {/* Play Action Strip */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${isStationPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                      {isStationPlaying ? 'Playing Live' : 'Click to Stream'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isThisStation) {
                          togglePlay();
                        } else {
                          playStation(st);
                        }
                      }}
                      className={`p-2 rounded-xl transition-transform active:scale-90 ${
                        isStationPlaying
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 hover:bg-indigo-600 text-slate-200'
                      }`}
                    >
                      {isStationPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LOCAL AUDIO FILE UPLOAD */}
      {activeTab === 'local' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <FileAudio className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Play Any Audio File from Your Device</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Got songs downloaded on your school Chromebook, phone, or flash drive? Drag and drop or browse to play MP3, WAV, M4A, OGG, or FLAC files directly.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Audio File</span>
              </button>
            </div>
          </div>

          {/* If Local File is currently active */}
          {sourceType === 'file' && activeFile && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Disc className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{activeFile.name}</h3>
                    <p className="text-xs text-slate-400">{activeFile.size} • Local Media</p>
                  </div>
                </div>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>

              {/* Seek Scrubber Bar */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: DIRECT STREAM URL */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Stream Any Direct Audio Link</h2>
                <p className="text-xs text-slate-400">
                  Paste any direct online radio URL (.mp3, .aac, .m3u8, Icecast, or Shoutcast stream).
                </p>
              </div>
            </div>

            <form onSubmit={handleCustomStreamSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Audio Stream URL
                </label>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://icecast.example.com/stream.mp3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Custom Station Name (Optional)
                </label>
                <input
                  type="text"
                  value={customTitleInput}
                  onChange={(e) => setCustomTitleInput(e.target.value)}
                  placeholder="e.g. My Favorite Radio"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-cyan-600/30 cursor-pointer active:scale-95"
              >
                Connect & Stream URL
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: AMBIENT SOUND MIXER */}
      {activeTab === 'ambient' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Background Sound Generator (Mix With Music)
            </h2>
            <span className="text-xs text-slate-400">Layered soundscapes using Web Audio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'rain', name: 'Rainfall & Thunder', icon: CloudRain, color: 'text-blue-400' },
              { id: 'cafe', name: 'Cafe Chatter & Lounge', icon: Coffee, color: 'text-amber-400' },
              { id: 'fire', name: 'Campfire Crackle', icon: Flame, color: 'text-orange-400' },
              { id: 'vinyl', name: 'Retro Vinyl Crackle', icon: Disc, color: 'text-purple-400' }
            ].map((sound) => {
              const active = ambientSounds[sound.id].active;
              const Icon = sound.icon;

              return (
                <div
                  key={sound.id}
                  onClick={() => toggleAmbientSound(sound.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg ring-1 ring-purple-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-slate-800 ${sound.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      active ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {active ? 'Active' : 'Off'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{sound.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {active ? 'Generating audio layer...' : 'Click to activate layer'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
