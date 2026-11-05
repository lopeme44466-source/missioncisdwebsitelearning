import React, { useState } from 'react';
import { Volume2, Sparkles, ExternalLink, Zap, Smile, Radio, Award } from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';
import { useMusic } from '../../context/MusicContext';

const SOUND_EFFECTS = [
  { id: 'boom', name: 'Vine Boom', freq: 120, type: 'triangle', dur: 0.4, color: 'from-red-600 to-rose-700' },
  { id: 'bruh', name: 'Bruh Sound', freq: 220, type: 'sawtooth', dur: 0.35, color: 'from-amber-600 to-orange-700' },
  { id: 'airhorn', name: 'MLG Airhorn', freq: 800, type: 'square', dur: 0.3, color: 'from-yellow-500 to-amber-600' },
  { id: 'ding', name: 'Correct Ding', freq: 980, type: 'sine', dur: 0.25, color: 'from-emerald-600 to-teal-700' },
  { id: 'buzzer', name: 'Wrong Buzzer', freq: 150, type: 'sawtooth', dur: 0.45, color: 'from-red-700 to-red-900' },
  { id: 'victory', name: 'Level Complete', freq: 650, type: 'triangle', dur: 0.5, color: 'from-purple-600 to-indigo-700' },
  { id: 'laser', name: 'Blaster Shot', freq: 750, type: 'square', dur: 0.15, color: 'from-cyan-600 to-blue-700' },
  { id: 'gameover', name: 'Oof Fall', freq: 240, type: 'sine', dur: 0.3, color: 'from-slate-700 to-slate-800' },
  { id: 'bell', name: 'School Bell', freq: 580, type: 'sine', dur: 0.6, color: 'from-blue-600 to-indigo-700' },
  { id: 'coin', name: 'Mario Coin', freq: 987, type: 'square', dur: 0.15, color: 'from-yellow-400 to-amber-500' },
  { id: 'pop', name: 'Bubble Pop', freq: 880, type: 'sine', dur: 0.08, color: 'from-pink-500 to-rose-600' },
  { id: 'bass', name: '808 Sub Drop', freq: 80, type: 'sine', dur: 0.6, color: 'from-violet-700 to-purple-900' },
];

export default function StudentDistractionsApp() {
  const { playBeep } = useMusic();
  const [fidgetCount, setFidgetCount] = useState(0);
  const [activeButton, setActiveButton] = useState(null);

  const handlePlaySound = (snd) => {
    setActiveButton(snd.id);
    playBeep(snd.freq, snd.type, snd.dur);
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleOpenMyInstants = () => {
    openAboutBlankCloak('https://www.myinstants.com/', 'mission-cisd');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>MyInstants Soundboard & Distractions Hub</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                myinstants.com
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive instant buttons, meme sound effects, and fidget clickers for study breaks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenMyInstants}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open MyInstants in about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6">
        {/* Direct Link Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl p-2 rounded-xl bg-red-950/60 border border-red-500/30">
              🔊
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Official MyInstants Portal</h3>
              <p className="text-xs text-slate-400">
                Browse millions of meme sounds, anime audio clips, and movie voice lines at <code className="text-amber-300">myinstants.com</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenMyInstants}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch in about:blank</span>
            </button>
            <a
              href="https://www.myinstants.com/"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Built-in Soundboard */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Instant Sound Buttons (Click to Blast)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SOUND_EFFECTS.map((snd) => {
              const isActive = activeButton === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => handlePlaySound(snd)}
                  className={`p-4 rounded-2xl bg-gradient-to-tr ${snd.color} text-white font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer flex flex-col items-center justify-center space-y-2 aspect-square border border-white/20 hover:brightness-110 ${
                    isActive ? 'scale-105 ring-4 ring-white' : ''
                  }`}
                >
                  <Volume2 className="w-6 h-6 shrink-0" />
                  <span className="text-center truncate w-full">{snd.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fidget Clicker Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Exam Stress Fidget Clicker</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Tap rapidly to relieve study tension before big tests.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-xl font-black text-amber-400">
              {fidgetCount} Clicks
            </span>
            <button
              onClick={() => {
                setFidgetCount((c) => c + 1);
                playBeep(400 + (fidgetCount % 20) * 20, 'sine', 0.05);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-90 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Fidget Tap ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
