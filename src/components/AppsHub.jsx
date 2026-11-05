import React, { useState } from 'react';
import {
  Camera,
  Gamepad2,
  Film,
  Music,
  Compass,
  Award,
  FlaskConical,
  Calculator,
  Layers,
  Clock,
  Sparkles,
  Volume2,
  Video,
  ExternalLink,
  Search,
  Zap,
} from 'lucide-react';
import { openAboutBlankCloak } from '../utils/cloak';

export const ALL_APPS = [
  {
    id: 'camera-exam',
    title: 'AI Camera Exam & Homework Scanner',
    category: 'Exam AI',
    icon: Camera,
    color: 'from-indigo-600 to-purple-600',
    description: 'Point live webcam at exam questions, textbook math, or biology diagrams for step-by-step Gemini solutions.',
    badge: 'AI Exam Helper',
    highlight: true,
  },
  {
    id: 'exam-cram',
    title: 'Exam Cram & Passing Simulator',
    category: 'Exam AI',
    icon: Award,
    color: 'from-amber-500 to-orange-600',
    description: 'Timed practice exams for SAT Math, AP Bio, AP Chem & US History with 70%+ pass score and cheat sheets.',
    badge: 'Pass Simulator',
    highlight: true,
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table & Molar Mass Solver',
    category: 'Exam AI',
    icon: FlaskConical,
    color: 'from-emerald-600 to-teal-700',
    description: '118-element periodic table, atomic mass lookup, and automated stoichiometry compound mass solver.',
    badge: 'Chemistry Tool',
    highlight: true,
  },
  {
    id: 'games-arcade',
    title: 'Blockbuster Games Arcade (25+ Games)',
    category: 'Gaming',
    icon: Gamepad2,
    color: 'from-rose-600 to-pink-600',
    description: 'Play Fruit Blade Slicer, Geometry Dash, Basketball Hoops, Slope 3D, Subway Dash, Cookie Clicker, and classics.',
    badge: '25+ Unblocked Games',
    highlight: true,
  },
  {
    id: 'web-navigator',
    title: 'Web Navigator & DuckDuckGo Browser',
    category: 'Browser',
    icon: Compass,
    color: 'from-cyan-600 to-blue-600',
    description: 'Private multi-tab browser with DuckDuckGo default search engine, Google, and stealth about:blank cloaker.',
    badge: 'DuckDuckGo Built-In',
  },
  {
    id: 'movies-videos',
    title: 'Movies, Tubi, Pluto & YouTube Cinema',
    category: 'Cinema',
    icon: Film,
    color: 'from-red-600 to-amber-600',
    description: 'Stream Tubi TV, Pluto TV, Netflix, and 24/7 curated YouTube cinema and study streams.',
    badge: 'Tubi • Pluto • Netflix',
  },
  {
    id: 'spotify-player',
    title: 'Spotify Web Player & Soundtracks',
    category: 'Music',
    icon: Music,
    color: 'from-emerald-500 to-green-600',
    description: 'Listen to official Spotify study beats, lofi hip hop, podcasts, and gaming soundtracks without interruption.',
    badge: 'Spotify Official',
  },
  {
    id: 'myinstants',
    title: 'MyInstants Soundboard & Meme Buttons',
    category: 'Audio & Fun',
    icon: Volume2,
    color: 'from-orange-500 to-amber-600',
    description: 'Official myinstants.com soundboard, vine booms, buzzer sounds, and stress fidget clickers.',
    badge: 'myinstants.com',
  },
  {
    id: 'tiktok-reels',
    title: 'TikTok Study & Reels Feed',
    category: 'Social',
    icon: Zap,
    color: 'from-fuchsia-600 to-purple-700',
    description: 'Vertical reel feed with viral study hacks, math tips, and satisfying revision clips.',
  },
  {
    id: 'ometv-connect',
    title: 'OmeTV Video Connect Simulator',
    category: 'Social',
    icon: Video,
    color: 'from-blue-600 to-indigo-700',
    description: 'Connect with simulated student study peers worldwide, camera preview, and official launcher.',
  },
  {
    id: 'calc-tool',
    title: 'Scientific Calculator Pro',
    category: 'Tools',
    icon: Calculator,
    color: 'from-indigo-700 to-blue-800',
    description: 'Full scientific calculator with trigonometric (sin/cos/tan), log, square root, and powers.',
  },
  {
    id: 'flashcards-tool',
    title: 'Flashcard Master',
    category: 'Tools',
    icon: Layers,
    color: 'from-purple-700 to-pink-800',
    description: 'Active recall spaced-repetition flashcards for SAT vocabulary and AP biology definitions.',
  },
  {
    id: 'pomodoro-tool',
    title: 'Pomodoro Focus Timer',
    category: 'Tools',
    icon: Clock,
    color: 'from-teal-600 to-emerald-700',
    description: 'Proven 25-minute focus intervals and 5-minute brain breaks to pass difficult exams.',
  },
];

export default function AppsHub({ onLaunchApp }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Exam AI', 'Gaming', 'Browser', 'Cinema', 'Music', 'Tools'];

  const filteredApps = ALL_APPS.filter((app) => {
    const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mateo's Learning Hub • Version 4.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pass Every Exam with AI Vision & Play 25+ Blockbuster Games
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equipped with our <strong className="text-amber-300">AI Camera Exam Scanner</strong>, practice test passing simulators, 118-element molar mass solver, 25+ unblocked games, Tubi/Pluto/Netflix, Spotify, and undetectable <code className="text-indigo-400 font-mono">about:blank</code> stealth cloaking.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => onLaunchApp('camera-exam')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>AI Camera Scanner</span>
            </button>

            <button
              onClick={() => onLaunchApp('games-arcade')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 border border-slate-700 transition cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Play 25+ Games</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-900/70 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps or games..."
            className="w-full bg-slate-900/80 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-white"
          />
        </div>
      </div>

      {/* Apps Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredApps.map((app) => {
          const IconComp = app.icon;
          return (
            <div
              key={app.id}
              className={`group relative p-5 rounded-2xl bg-slate-900/70 border transition flex flex-col justify-between shadow-lg ${
                app.highlight
                  ? 'border-indigo-500/40 hover:border-indigo-400 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${app.color} text-white shadow-md`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  {app.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {app.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition mb-1">
                  {app.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onLaunchApp(app.id)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Launch App</span>
                </button>

                <button
                  onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs transition cursor-pointer"
                  title="Open in stealth about:blank window"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
