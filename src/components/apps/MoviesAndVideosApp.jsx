import React, { useState } from 'react';
import { Film, Tv, Play, ExternalLink, Sparkles, Monitor, Clapperboard, Youtube } from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const MOVIE_STREAM_SERVICES = [
  {
    id: 'tubi',
    name: 'Tubi TV',
    category: 'Free Movies & Shows',
    url: 'https://tubitv.com/',
    embedUrl: 'https://tubitv.com/',
    icon: '🍿',
    badge: 'Requested by You',
    description: '100% Free, legal movie streaming with 50,000+ movies, classics, and anime without subscription.',
  },
  {
    id: 'pluto',
    name: 'Pluto TV',
    category: 'Live TV & Cinema',
    url: 'https://pluto.tv/',
    embedUrl: 'https://pluto.tv/',
    icon: '📺',
    badge: 'Requested by You',
    description: 'Drop in and watch hundreds of live channels, crime dramas, comedies, and blockbuster cinema.',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Subscription Streaming',
    url: 'https://www.netflix.com/',
    embedUrl: 'https://www.netflix.com/',
    icon: '🎬',
    badge: 'Requested by You',
    description: 'World leading streaming service for original movies, award-winning series, and anime.',
  },
  {
    id: 'youtube-cinema',
    name: 'YouTube Cinema & Chill',
    category: 'Study & Documentaries',
    url: 'https://www.youtube.com/',
    embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', // Lofi Girl 24/7 stream
    icon: '▶️',
    badge: 'Curated Player',
    description: 'Watch video documentaries, sci-fi movies, crash courses, and relax with 24/7 lofi cinema.',
  },
];

const YOUTUBE_CHILL_VIDEOS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Lofi Girl',
    category: 'Study Music',
  },
  {
    id: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill to',
    channel: 'Lofi Girl',
    category: 'Chill Beats',
  },
  {
    id: 'DWcJFNfaw9c',
    title: 'Synthwave Radio - Chill Synth / Retro Beats',
    channel: 'Lofi Girl',
    category: 'Synthwave',
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Synthwave Relaxing Ambient Study Stream',
    channel: 'ChilledCow',
    category: 'Ambient',
  },
];

export default function MoviesAndVideosApp() {
  const [selectedService, setSelectedService] = useState(MOVIE_STREAM_SERVICES[0]);
  const [currentYtId, setCurrentYtId] = useState('jfKfPfyJRdk');
  const [viewMode, setViewMode] = useState('browser'); // 'browser' or 'hub'

  const handleOpenBlank = (url = selectedService.url) => {
    openAboutBlankCloak(url, 'mission-cisd');
  };

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
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase">
                Tubi • Pluto • Netflix
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Access Tubi TV, Pluto TV, Netflix, and 24/7 YouTube cinema streams with stealth cloaking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenBlank(selectedService.url)}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
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
        {/* Service Highlight Banner */}
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

        {/* Embedded YouTube Cinema Player */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-sm text-white">YouTube Cinema & Chill Live Screen</h4>
            </div>
            <span className="text-xs text-slate-400">Full 1080p Embed Player</span>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1&mute=0`}
              title="YouTube Cinema Stream"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Selector Channels */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Curated Stream:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {YOUTUBE_CHILL_VIDEOS.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => setCurrentYtId(vid.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    currentYtId === vid.id
                      ? 'border-rose-500 bg-rose-950/30 text-white font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <p className="text-xs truncate">{vid.title}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>{vid.channel}</span>
                    <span className="text-rose-400">{vid.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
