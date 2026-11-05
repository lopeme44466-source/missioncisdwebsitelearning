import React, { useState } from 'react';
import { Music, Play, Pause, ExternalLink, Sparkles, Volume2, Radio, Headphones } from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const SPOTIFY_PLAYLISTS = [
  {
    id: 'lofi-beats',
    title: 'Lofi Beats for Deep Focus',
    uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
    desc: 'Beats to relax, study, and pass exams without distraction',
  },
  {
    id: 'peaceful-piano',
    title: 'Peaceful Piano Concentration',
    uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    desc: 'Calm ambient piano notes for late-night cram sessions',
  },
  {
    id: 'synthwave-retro',
    title: 'Synthwave / Retrowave Gaming',
    uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    desc: 'Upbeat neon retro electronica for arcade games & gaming',
  },
  {
    id: 'top-gaming',
    title: 'Top Gaming Tracks 2025',
    uri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdfOcg1fm0VG?utm_source=generator&theme=0',
    desc: 'Adrenaline hype songs for Minecraft, Roblox & Fruit Slicer',
  },
];

export default function SpotifyApp() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(SPOTIFY_PLAYLISTS[0]);

  const handleOpenBlank = () => {
    openAboutBlankCloak('https://open.spotify.com/', 'mission-cisd');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Spotify Web Player & Study Soundtracks</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                Official Embed
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Listen to study playlists, podcasts, and gaming beats while working
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenBlank}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
          </button>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Spotify Embed (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black min-h-[380px]">
            <iframe
              src={selectedPlaylist.uri}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Embed Player"
              className="w-full"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{selectedPlaylist.title}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{selectedPlaylist.desc}</p>
            </div>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition"
            >
              Open Spotify App
            </a>
          </div>
        </div>

        {/* Right: Playlists List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Featured Curated Playlists
          </span>

          <div className="space-y-2">
            {SPOTIFY_PLAYLISTS.map((pl) => (
              <button
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center space-x-3 ${
                  selectedPlaylist.id === pl.id
                    ? 'border-emerald-500 bg-emerald-950/30 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs text-white truncate font-semibold">{pl.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{pl.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick External Web Player link */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
            <span className="font-bold text-emerald-400 block">Want full Spotify catalog?</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Launch the complete unblocked Spotify web player inside an undetectable about:blank tab with your saved library.
            </p>
            <button
              onClick={handleOpenBlank}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer shadow-md text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Full Spotify in about:blank</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
