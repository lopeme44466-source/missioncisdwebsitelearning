import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, Music, Sparkles } from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const TIKTOK_VIDEOS = [
  {
    id: 1,
    creator: '@mathtok_hacks',
    song: 'Original Sound - Viral Study Hacks',
    caption: 'How to factor ANY quadratic equation in under 5 seconds! SAT math trick #satmath #exam',
    likes: '248.5K',
    comments: '1,420',
    color: 'from-blue-900 to-indigo-950',
    content: 'x² - 5x + 6 = 0\nFind 2 numbers that multiply to 6 and add to -5:\n-2 and -3!\n(x - 2)(x - 3) = 0\nx = 2, 3! ✨',
  },
  {
    id: 2,
    creator: '@biology_daily',
    song: 'Chill Lofi Beats - Study Vibes',
    caption: 'Mitochondria is NOT just the powerhouse! Here is how the Electron Transport Chain ACTUALLY works 🧬',
    likes: '189.2K',
    comments: '932',
    color: 'from-emerald-900 to-teal-950',
    content: 'Complex I → Q → Complex III → Cytochrome C → Complex IV → ATP Synthase!\nProtons pump out, rush back in = 32 ATP! 🔥',
  },
  {
    id: 3,
    creator: '@studywithmateo',
    song: 'Late Night Focus Beats',
    caption: 'The 3-3-3 rule for passing any exam when you only have 1 night to cram! 📚⚡',
    likes: '512.8K',
    comments: '4,105',
    color: 'from-purple-900 to-slate-950',
    content: '1. Review past exam questions first\n2. Memorize the top 5 high-yield formulas\n3. Sleep 6+ hours so your brain consolidates memory!',
  },
];

export default function TikTokApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});

  const video = TIKTOK_VIDEOS[currentIndex];

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % TIKTOK_VIDEOS.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">📱</span>
          <h2 className="font-bold text-white text-base">TikTok Study & Reels Feed</h2>
        </div>
        <button
          onClick={() => openAboutBlankCloak('https://www.tiktok.com/', 'mission-cisd')}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Open TikTok in about:blank</span>
        </button>
      </div>

      {/* Vertical Reel Viewport */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950">
          {/* Top Reel Header */}
          <div className="flex justify-between items-center text-xs text-white/80 z-10">
            <span className="font-bold">Following</span>
            <span className="font-bold border-b-2 border-white pb-0.5">For You</span>
            <span className="text-slate-400">⚡</span>
          </div>

          {/* Central Card Content */}
          <div className="my-auto p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 font-mono">{video.creator}</span>
            <div className="text-xs font-mono text-white whitespace-pre-line leading-relaxed">
              {video.content}
            </div>
          </div>

          {/* Reel Metadata & Side Actions */}
          <div className="flex items-end justify-between z-10">
            <div className="space-y-1.5 max-w-[220px]">
              <p className="font-bold text-sm text-white">{video.creator}</p>
              <p className="text-xs text-slate-300 leading-tight">{video.caption}</p>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-1">
                <Music className="w-3 h-3 text-white" />
                <span className="truncate">{video.song}</span>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => toggleLike(video.id)}
                className="flex flex-col items-center space-y-1 cursor-pointer"
              >
                <div className={`p-2.5 rounded-full backdrop-blur-md ${liked[video.id] ? 'bg-red-500 text-white' : 'bg-black/50 text-white'}`}>
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-bold">{video.likes}</span>
              </button>

              <button className="flex flex-col items-center space-y-1">
                <div className="p-2.5 rounded-full bg-black/50 text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">{video.comments}</span>
              </button>

              <button onClick={nextVideo} className="p-2.5 rounded-full bg-indigo-600 text-white cursor-pointer shadow-md">
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
