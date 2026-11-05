import React, { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Music, 
  Tv, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Flame, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  Volume2, 
  Play, 
  Pause, 
  TrendingUp,
  Search,
  Check
} from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 'ig1',
    user: 'mateo_official',
    avatar: '👑',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    caption: 'Gaming setup complete. All unblocked games running at 120 FPS during homeroom 🎮🔥',
    likes: 3842,
    comments: 142,
    time: '2 HOURS AGO'
  },
  {
    id: 'ig2',
    user: 'subway_surfer_clips',
    avatar: '🛹',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    caption: 'High score broken on level 8! Dual screen brainrot mode never fails 🍿',
    likes: 8912,
    comments: 420,
    time: '5 HOURS AGO'
  },
  {
    id: 'ig3',
    user: 'school_memes_daily',
    avatar: '💀',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    caption: 'Teacher: "Why is your screen so quiet?" Me with the Mission CISD disguise on: 🤫',
    likes: 15420,
    comments: 890,
    time: 'YESTERDAY'
  }
];

const TWITTER_TWEETS = [
  {
    id: 'tw1',
    user: 'Mateo',
    handle: '@mateo_learning',
    avatar: '👑',
    time: '25m',
    content: 'Just added OmeTV, Instagram, Twitter, Spotify, and 7 new arcade games to the portal. You guys are never paying attention in physics class again 😭💀',
    likes: 489,
    retweets: 124
  },
  {
    id: 'tw2',
    user: 'School Pro Tips',
    handle: '@schoolprotips',
    avatar: '💡',
    time: '1h',
    content: 'Pro tip: The ESC key disguise turns your entire screen into Mission CISD instantly. Teachers will never know.',
    likes: 1250,
    retweets: 380
  },
  {
    id: 'tw3',
    user: 'Gamer Daily',
    handle: '@gamerhub',
    avatar: '🎮',
    time: '3h',
    content: 'Atari Breakout and Retro Tetris inside an unblocked school portal is peak engineering.',
    likes: 890,
    retweets: 92
  }
];

const REDDIT_POSTS = [
  {
    id: 'rd1',
    sub: 'r/teenagers',
    author: 'u/arcade_legend',
    title: 'Found an unblocked portal that has TikTok, Discord, OmeTV, and YouTube Music all in one place',
    score: 2840,
    comments: 312,
    tag: 'DISCUSSION'
  },
  {
    id: 'rd2',
    sub: 'r/gaming',
    author: 'u/retro_coder',
    title: 'I wrote an Atari Breakout and Asteroids clone in HTML5 canvas that runs without any school firewall blocks',
    score: 5120,
    comments: 640,
    tag: 'GAMING'
  },
  {
    id: 'rd3',
    sub: 'r/AskReddit',
    author: 'u/study_survivor',
    title: 'What is the most clever trick you used to bypass Chromebook school restrictions?',
    score: 9340,
    comments: 1420,
    tag: 'VIRAL'
  }
];

const SPOTIFY_TRACKS = [
  { id: 'sp1', title: 'Starboy', artist: 'The Weeknd, Daft Punk', duration: '3:50', plays: '2.8B', cover: '⚡' },
  { id: 'sp2', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', plays: '4.1B', cover: '🌆' },
  { id: 'sp3', title: 'As It Was', artist: 'Harry Styles', duration: '2:47', plays: '3.2B', cover: '🎨' },
  { id: 'sp4', title: 'FE!N', artist: 'Travis Scott, Playboi Carti', duration: '3:11', plays: '1.2B', cover: '🔥' },
  { id: 'sp5', title: 'Sunflower', artist: 'Post Malone, Swae Lee', duration: '2:38', plays: '3.5B', cover: '🌻' }
];

export const SocialHubApp = ({ onTriggerPanic }) => {
  const [activeTab, setActiveTab] = useState('instagram'); // 'instagram' | 'twitter' | 'reddit' | 'spotify' | 'twitch'
  const [likedPosts, setLikedPosts] = useState({});
  const [playingTrackId, setPlayingTrackId] = useState('sp1');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[780px] max-w-6xl mx-auto">
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 font-black">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Famous Apps Suite
              </h2>
              <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                Instagram · X · Reddit · Spotify · Twitch
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Unblocked feeds, social media explorers, and 1-click external web app launchers
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onTriggerPanic && (
            <button
              onClick={onTriggerPanic}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Instant Disguise as Mission CISD (Esc)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Panic [Esc]</span>
            </button>
          )}

          {activeTab === 'instagram' && (
            <button
              onClick={() => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-pink-600/25 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Instagram.com</span>
            </button>
          )}

          {activeTab === 'twitter' && (
            <button
              onClick={() => window.open('https://x.com/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open X.com</span>
            </button>
          )}

          {activeTab === 'reddit' && (
            <button
              onClick={() => window.open('https://www.reddit.com/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-600/25 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Reddit.com</span>
            </button>
          )}

          {activeTab === 'spotify' && (
            <button
              onClick={() => window.open('https://open.spotify.com/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Spotify.com</span>
            </button>
          )}

          {activeTab === 'twitch' && (
            <button
              onClick={() => window.open('https://www.twitch.tv/', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-600/25 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Twitch.tv</span>
            </button>
          )}
        </div>
      </div>

      {/* App Tab Switcher Strip */}
      <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <button
          onClick={() => setActiveTab('instagram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'instagram'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>📸 Instagram</span>
        </button>

        <button
          onClick={() => setActiveTab('twitter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'twitter'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🐦 Twitter / X</span>
        </button>

        <button
          onClick={() => setActiveTab('reddit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reddit'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🤖 Reddit</span>
        </button>

        <button
          onClick={() => setActiveTab('spotify')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'spotify'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🎵 Spotify</span>
        </button>

        <button
          onClick={() => setActiveTab('twitch')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'twitch'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🟣 Twitch</span>
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
        {/* TAB 1: INSTAGRAM */}
        {activeTab === 'instagram' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white text-sm">Instagram Feed Explorer</span>
              <button
                onClick={() => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')}
                className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
              >
                Go to Instagram.com <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {INSTAGRAM_POSTS.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-sm">
                        {post.avatar}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">{post.user}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{post.time}</span>
                </div>

                {/* Image */}
                <div className="w-full h-80 bg-black overflow-hidden relative">
                  <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                </div>

                {/* Action Bar */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`transition-colors cursor-pointer ${likedPosts[post.id] ? 'text-rose-500 fill-rose-500' : 'text-slate-300 hover:text-white'}`}
                      >
                        <Heart className="w-5 h-5" fill={likedPosts[post.id] ? '#f43f5e' : 'none'} />
                      </button>
                      <button className="text-slate-300 hover:text-white">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button className="text-slate-300 hover:text-white">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <Bookmark className="w-5 h-5 text-slate-300" />
                  </div>

                  <p className="text-xs font-bold text-white">
                    {((post.likes || 100) + (likedPosts[post.id] ? 1 : 0)).toLocaleString()} likes
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white mr-1.5">{post.user}</strong>
                    {post.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TWITTER / X */}
        {activeTab === 'twitter' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white text-sm">X (Twitter) Trending Feed</span>
              <button
                onClick={() => window.open('https://x.com/', '_blank', 'noopener,noreferrer')}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                Go to X.com <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {TWITTER_TWEETS.map(tweet => (
              <div key={tweet.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow-sm">
                      {tweet.avatar}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white mr-1">{tweet.user}</span>
                      <span className="text-xs text-slate-400">{tweet.handle}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{tweet.time}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {tweet.content}
                </p>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 hover:text-rose-400 cursor-pointer">
                    <Heart className="w-4 h-4" />
                    <span>{tweet.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                    <TrendingUp className="w-4 h-4" />
                    <span>{tweet.retweets}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REDDIT */}
        {activeTab === 'reddit' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white text-sm">Reddit Student Hub</span>
              <button
                onClick={() => window.open('https://www.reddit.com/', '_blank', 'noopener,noreferrer')}
                className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                Go to Reddit.com <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {REDDIT_POSTS.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-orange-400">{post.sub}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{post.author}</span>
                  <span className="ml-auto text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                    {post.tag}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white hover:text-orange-300 transition-colors cursor-pointer">
                  {post.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg">
                    <span>▲</span>
                    <span className="font-bold text-white">{post.score.toLocaleString()}</span>
                    <span>▼</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-white cursor-pointer ml-auto">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SPOTIFY */}
        {activeTab === 'spotify' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white text-sm">Spotify Web Player</span>
              <button
                onClick={() => window.open('https://open.spotify.com/', '_blank', 'noopener,noreferrer')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Go to Spotify.com <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-600/30">
                  {SPOTIFY_TRACKS.find(t => t.id === playingTrackId)?.cover || '🎵'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {SPOTIFY_TRACKS.find(t => t.id === playingTrackId)?.title}
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    {SPOTIFY_TRACKS.find(t => t.id === playingTrackId)?.artist}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Top Charts Track List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
              {SPOTIFY_TRACKS.map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setPlayingTrackId(track.id);
                    setIsPlayingAudio(true);
                  }}
                  className={`p-3.5 flex items-center justify-between text-xs hover:bg-slate-800/60 cursor-pointer transition-colors ${
                    playingTrackId === track.id ? 'bg-emerald-950/40 text-emerald-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-center font-mono text-slate-500">{i + 1}</span>
                    <span className="text-xl">{track.cover}</span>
                    <div>
                      <p className="font-bold text-white text-xs">{track.title}</p>
                      <p className="text-slate-400 text-[11px]">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="font-mono text-[11px]">{track.plays}</span>
                    <span className="font-mono">{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TWITCH */}
        {activeTab === 'twitch' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white text-sm">Twitch Live Gaming Hub</span>
              <button
                onClick={() => window.open('https://www.twitch.tv/', '_blank', 'noopener,noreferrer')}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                Go to Twitch.tv <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Simulated Live Stream Player */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[420px]">
              {/* Stream Screen */}
              <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-6 text-center">
                <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> LIVE
                </span>
                <span className="absolute top-3 right-3 text-slate-400 text-xs font-mono">
                  48,290 Viewers
                </span>

                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-purple-600/30">
                    🎮
                  </div>
                  <h4 className="text-lg font-bold text-white">Minecraft Speedrun World Record Attempt</h4>
                  <p className="text-xs text-slate-400">Streamer: Mateo_Plays · Subscribed ⭐</p>
                </div>
              </div>

              {/* Live Chat Simulator */}
              <div className="w-full md:w-64 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col p-3 text-xs">
                <span className="font-bold text-slate-400 text-[11px] uppercase pb-2 border-b border-slate-800 mb-2">
                  Stream Chat
                </span>
                <div className="flex-1 overflow-y-auto space-y-2 text-[11px]">
                  <p><strong className="text-purple-400">GamerGuy:</strong> POG CHAMP 🔥</p>
                  <p><strong className="text-emerald-400">Alex_TX:</strong> that ender dragon fight was insane</p>
                  <p><strong className="text-amber-400">Sophia:</strong> mateos learning unblocked portal W</p>
                  <p><strong className="text-pink-400">NinjaFan:</strong> 💀💀💀</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
