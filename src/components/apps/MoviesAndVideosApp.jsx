import React, { useState, useEffect } from 'react';
import {
  Film,
  Tv,
  Play,
  ExternalLink,
  Sparkles,
  Youtube,
  Clipboard,
  Link2,
  Check,
  AlertCircle,
  History,
  Trash2,
  Search,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const str = urlOrId.trim();

  // If already an 11-char YouTube ID (letters, numbers, hyphens, underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Regex matching youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = str.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

const MOVIE_STREAM_SERVICES = [
  {
    id: 'tubi',
    name: 'Tubi TV',
    category: 'Free Movies & Shows',
    url: 'https://tubitv.com/',
    icon: '🍿',
    badge: 'Requested by You',
    description: '100% Free, legal movie streaming with 50,000+ movies, classics, and anime without subscription.',
  },
  {
    id: 'pluto',
    name: 'Pluto TV',
    category: 'Live TV & Cinema',
    url: 'https://pluto.tv/',
    icon: '📺',
    badge: 'Requested by You',
    description: 'Drop in and watch hundreds of live channels, crime dramas, comedies, and blockbuster cinema.',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Subscription Streaming',
    url: 'https://www.netflix.com/',
    icon: '🎬',
    badge: 'Requested by You',
    description: 'World leading streaming service for original movies, award-winning series, and anime.',
  },
  {
    id: 'youtube-cinema',
    name: 'YouTube Cinema & Custom Player',
    category: 'Video & Study',
    url: 'https://www.youtube.com/',
    icon: '▶️',
    badge: 'Paste Any Link',
    description: 'Paste any YouTube video or shorts link to watch directly inside or launch in stealth about:blank.',
  },
];

const CURATED_YOUTUBE_STREAMS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Lofi Girl',
    category: 'Study Lofi',
  },
  {
    id: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill to',
    channel: 'Lofi Girl',
    category: 'Chill Beats',
  },
  {
    id: 'DWcJFNfaw9c',
    title: 'Synthwave Radio - Chill Synth / Retro 80s Beats',
    channel: 'Lofi Girl',
    category: 'Synthwave',
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Deep Focus Ambient Study Wave',
    channel: 'ChilledCow',
    category: 'Binaural Focus',
  },
  {
    id: 'rdGk1n7U74Y',
    title: 'SAT Math Must-Know High Yield Formula Review',
    channel: 'Scalar Learning',
    category: 'Exam Prep',
  },
  {
    id: '4K8T_b4nLio',
    title: 'AP Biology Cellular Respiration & Photosynthesis',
    channel: 'Bozeman Science',
    category: 'Exam Prep',
  },
  {
    id: 'FSyAehMdpyI',
    title: 'Organic Chemistry Tutor - Algebra & Calculus Basics',
    channel: 'The Organic Chemistry Tutor',
    category: 'Exam Prep',
  },
  {
    id: 'f94R_eTkhbI',
    title: 'Minecraft Relaxing Ambient Music & Build Stream',
    channel: 'Chill Gaming',
    category: 'Gaming Chill',
  },
];

export default function MoviesAndVideosApp({ initialYtId, onClearInitialYtId }) {
  const [selectedService, setSelectedService] = useState(MOVIE_STREAM_SERVICES[3]); // Default to YouTube
  const [currentYtId, setCurrentYtId] = useState('jfKfPfyJRdk');
  const [pastedYtInput, setPastedYtInput] = useState('');
  const [recentYtVideos, setRecentYtVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (initialYtId) {
      setCurrentYtId(initialYtId);
      setSelectedService(MOVIE_STREAM_SERVICES[3]);
      if (onClearInitialYtId) onClearInitialYtId();
    }
  }, [initialYtId]);

  // Load recent pasted YouTube videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mateos_recent_yt_videos');
      if (saved) {
        setRecentYtVideos(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveToRecentYt = (id, label = '') => {
    try {
      const item = { id, label: label || `Video #${id}` };
      const updated = [item, ...recentYtVideos.filter((v) => v.id !== id)].slice(0, 8);
      setRecentYtVideos(updated);
      localStorage.setItem('mateos_recent_yt_videos', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearHistory = () => {
    setRecentYtVideos([]);
    try {
      localStorage.removeItem('mateos_recent_yt_videos');
    } catch (e) {}
  };

  const handlePasteFromClipboard = async () => {
    setErrorMessage('');
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const cleanText = text.trim();
          setPastedYtInput(cleanText);
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);

          // Auto-play if it's a valid YouTube URL
          const extractedId = extractYouTubeId(cleanText);
          if (extractedId) {
            setCurrentYtId(extractedId);
            saveToRecentYt(extractedId);
          }
        } else {
          setErrorMessage('Clipboard is empty! Right click or press Ctrl+V to paste your YouTube link.');
        }
      }
    } catch (err) {
      setErrorMessage('Clipboard permission was denied. Press Ctrl+V or Cmd+V into the box.');
    }
  };

  const handlePlayPasted = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const id = extractYouTubeId(pastedYtInput);
    if (!id) {
      setErrorMessage('Invalid YouTube URL! Please paste a link like https://www.youtube.com/watch?v=... or youtu.be/...');
      return;
    }
    setCurrentYtId(id);
    saveToRecentYt(id);
  };

  const handleOpenBlankVideo = (videoId = currentYtId) => {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    openAboutBlankCloak(embedUrl, 'mission-cisd');
  };

  const handleOpenBlank = (url = selectedService.url) => {
    openAboutBlankCloak(url, 'mission-cisd');
  };

  const categories = ['All', 'Study Lofi', 'Chill Beats', 'Synthwave', 'Exam Prep', 'Gaming Chill'];
  const filteredStreams = selectedCategory === 'All'
    ? CURATED_YOUTUBE_STREAMS
    : CURATED_YOUTUBE_STREAMS.filter((s) => s.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-md">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Movies, Cinema & YouTube Video Hub</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold uppercase">
                Paste YouTube URL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste any YouTube video/shorts link or stream Tubi TV, Pluto TV, and Netflix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenBlankVideo(currentYtId)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Open current video in stealth about:blank window"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Video in about:blank</span>
          </button>
        </div>
      </div>

      {/* Services Switcher Strip */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2.5 flex items-center space-x-3 overflow-x-auto select-none">
        {MOVIE_STREAM_SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedService(s)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              selectedService.id === s.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-base">{s.icon}</span>
            <span>{s.name}</span>
            {s.badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-rose-200">
                {s.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Stream Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6">
        {/* Service Highlight Banner if Tubi/Pluto/Netflix selected */}
        {selectedService.id !== 'youtube-cinema' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{selectedService.icon}</span>
                <h3 className="text-lg font-bold text-white">{selectedService.name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {selectedService.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenBlank(selectedService.url)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch {selectedService.name} in about:blank</span>
              </button>

              <a
                href={selectedService.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>External Window</span>
              </a>
            </div>
          </div>
        )}

        {/* DEDICATED "PASTE YOUR YOUTUBE URL" CONSOLE */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-red-950/20 to-slate-900 border border-red-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>Paste Your YouTube URL Here</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold uppercase">
                    1080p Embed
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Paste any video link, music track, or tutorial to play on the big screen or open in stealth about:blank
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              {pasteSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Pasted!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste from Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Form Input + Action Buttons */}
          <form onSubmit={handlePlayPasted} className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={pastedYtInput}
                onChange={(e) => {
                  setPastedYtInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=... or youtu.be/...)"
                className="w-full bg-slate-950 text-white text-xs pl-3.5 pr-8 py-3 rounded-xl border border-slate-700 focus:border-red-500 outline-none font-mono"
              />
              {pastedYtInput && (
                <button
                  type="button"
                  onClick={() => setPastedYtInput('')}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Here</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const id = extractYouTubeId(pastedYtInput) || currentYtId;
                  if (id) {
                    saveToRecentYt(id);
                    handleOpenBlankVideo(id);
                  }
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                title="Open pasted YouTube video in stealth about:blank window"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Open in about:blank</span>
              </button>

              <a
                href={extractYouTubeId(pastedYtInput) ? `https://www.youtube.com/watch?v=${extractYouTubeId(pastedYtInput)}` : `https://www.youtube.com/watch?v=${currentYtId}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Open on official YouTube site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </form>

          {errorMessage && (
            <p className="text-[11px] text-red-400 flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 p-2 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Recent Pasted YouTube Videos */}
          {recentYtVideos.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 text-[11px] border-t border-slate-800/80">
              <span className="text-slate-400 shrink-0 flex items-center gap-1">
                <History className="w-3 h-3" /> Recent Pasted:
              </span>
              {recentYtVideos.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentYtId(v.id)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] shrink-0 truncate max-w-[200px] transition cursor-pointer ${
                    currentYtId === v.id
                      ? 'bg-red-950/40 border-red-500 text-red-300 font-bold'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                  title={`Play video ${v.id}`}
                >
                  ▶ {v.id}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[10px] text-slate-500 hover:text-red-400 ml-auto shrink-0 transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Embedded YouTube Cinema Player Screen */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-sm text-white">
                Live Player Screen: <span className="font-mono text-red-400 text-xs">ID #{currentYtId}</span>
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden sm:inline">Unblocked 1080p Embed</span>
              <button
                onClick={() => handleOpenBlankVideo(currentYtId)}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Stealth Popout</span>
              </button>
            </div>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1&mute=0`}
              title="YouTube Cinema Stream"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Curated Channel Library */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Or Choose from Curated Study & Chill Library:
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {filteredStreams.map((vid) => {
                const isPlayingThis = currentYtId === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => setCurrentYtId(vid.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isPlayingThis
                        ? 'border-red-500 bg-red-950/30 text-white font-bold shadow-xs'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs truncate">{vid.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{vid.channel}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800/60">
                      <span className="text-red-400 font-medium">{vid.category}</span>
                      {isPlayingThis && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-600 text-white rounded font-bold">
                          Now Playing
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
