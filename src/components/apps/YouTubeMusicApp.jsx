import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Search, 
  Plus, 
  Trash2, 
  ListMusic, 
  Flame, 
  Sparkles, 
  Clock, 
  Link as LinkIcon, 
  Radio, 
  FileAudio, 
  ExternalLink, 
  Tv, 
  Music, 
  Check, 
  ChevronRight, 
  X,
  Disc,
  Headphones,
  Sliders,
  FolderPlus
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext.jsx';
import { YT_MUSIC_MOODS, parseYouTubeUrl } from '../../data/youtubeMusicData.js';

// Iconic YouTube Music Logo component
export const YouTubeMusicLogo = ({ size = 'md' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';
  
  const iconSize = isLarge ? 'w-10 h-10' : isSmall ? 'w-6 h-6' : 'w-8 h-8';
  const textSize = isLarge ? 'text-2xl' : isSmall ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative ${iconSize} rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0`}>
        {/* Outer concentric ring circle */}
        <div className="absolute inset-1 rounded-full border border-white/40 flex items-center justify-center">
          {/* Inner Play Triangle */}
          <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-white ml-0.5" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`${textSize} font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]`}>
          Music
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/60 px-1.5 py-0.5 rounded">
          Unblocked
        </span>
      </div>
    </div>
  );
};

export const YouTubeMusicApp = () => {
  const {
    sourceType,
    isPlaying,
    activeYoutube,
    activeStation,
    activeFile,
    playerMode,
    setPlayerMode,
    playYoutube,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    queue,
    currentQueueIndex,
    addToQueue,
    removeFromQueue,
    clearQueue,
    skipNext,
    skipPrevious,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    likedSongs,
    toggleLike,
    isLiked,
    userPlaylists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    quickPicks,
    trendingCharts,
    curatedPlaylists,
    stations,
    playStation,
    playLocalFile,
    sleepTimerMinutes,
    setSleepTimerMinutes,
    sleepTimerRemaining
  } = useMusic();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'charts' | 'mixes' | 'library' | 'paste' | 'radio'
  const [selectedMood, setSelectedMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlStatus, setUrlStatus] = useState(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [lyricsActive, setLyricsActive] = useState(false);

  // Filter quick picks based on selected mood
  const filteredPicks = selectedMood === 'all'
    ? quickPicks
    : quickPicks.filter((track) => track.category === selectedMood);

  // Filter trending charts based on mood
  const filteredCharts = selectedMood === 'all'
    ? trendingCharts
    : trendingCharts.filter((track) => track.category === selectedMood);

  // Filter playlists based on mood
  const filteredPlaylists = selectedMood === 'all'
    ? curatedPlaylists
    : curatedPlaylists.filter((pl) => pl.category === selectedMood || pl.category === 'all');

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if input is a direct YouTube URL
    const parsed = parseYouTubeUrl(searchQuery.trim());
    if (parsed && (parsed.type === 'video' || parsed.type === 'playlist')) {
      playYoutube(searchQuery.trim());
    } else {
      playYoutube(searchQuery.trim(), searchQuery.trim(), 'YouTube Search');
    }
  };

  // Handle Direct Paste URL Submission
  const handlePasteUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const parsed = parseYouTubeUrl(urlInput.trim());
    if (!parsed) {
      setUrlStatus({ error: 'Please enter a valid YouTube or YouTube Music link.' });
      return;
    }

    playYoutube(urlInput.trim());
    setUrlStatus({ success: `Playing ${parsed.type === 'playlist' ? 'Playlist' : 'Track'}!` });
    setUrlInput('');
    setTimeout(() => setUrlStatus(null), 4000);
  };

  // Play a full curated mix
  const handlePlayMix = (mix) => {
    // If the mix has a featured track, play it and set up related queue
    const matchingTracks = quickPicks.filter(
      (t) => t.category === mix.category || mix.category === 'all'
    );
    const mixQueue = matchingTracks.length > 0 ? matchingTracks : quickPicks;
    playYoutube(mixQueue[0], mixQueue[0].title, mixQueue[0].artist, mixQueue);
  };

  // Handle New Playlist Creation
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const created = createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setIsCreatingPlaylist(false);
    if (created) setSelectedPlaylist(created);
  };

  const currentPlayingId = activeYoutube?.id || activeYoutube?.videoId;

  return (
    <div className="space-y-6">
      {/* YOUTUBE MUSIC TOP APP BAR */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Background ambient red glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4">
            <YouTubeMusicLogo size="md" />
            <div className="h-6 w-px bg-white/15 hidden sm:block" />
            <p className="text-xs text-neutral-400 hidden sm:block max-w-xs">
              Play any song, music video, artist or playlist unblocked with background audio.
            </p>
          </div>

          {/* Quick Search & Hotkeys */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, albums, artists, or paste link..."
                className="w-full bg-neutral-900/90 border border-white/15 rounded-full pl-10 pr-24 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Sleep Timer Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>
                {sleepTimerRemaining !== null
                  ? `${Math.floor(sleepTimerRemaining / 60)}m left`
                  : 'Timer Off'}
              </span>
            </div>
          </div>
        </div>

        {/* MOOD & GENRE CHIPS BAR (Iconic YouTube Music feature) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {YT_MUSIC_MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-NAVIGATION BAR */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Top Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('mixes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'mixes'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mixes & Vibe</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <ListMusic className="w-4 h-4 text-indigo-400" />
            <span>Library ({likedSongs.length} Liked)</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            <span>Paste Link</span>
          </button>

          <button
            onClick={() => setActiveTab('radio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'radio'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>24/7 Live Radio</span>
          </button>
        </div>

        {/* Queue Drawer Button */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            isQueueOpen
              ? 'bg-white text-black'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-white/10'
          }`}
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>Queue ({queue.length})</span>
        </button>
      </div>

      {/* YOUTUBE MUSIC MAIN STAGE / NOW PLAYING SHOWCASE */}
      {sourceType === 'youtube' && activeYoutube && (
        <div className="bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            {/* Left: Track Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10 shadow-md">
                <img
                  src={activeYoutube.cover}
                  alt={activeYoutube.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-950/80 px-1.5 py-0.5 rounded">
                    YouTube Music
                  </span>
                  <span className="text-xs text-neutral-400 truncate">{activeYoutube.album}</span>
                </div>
                <h3 className="text-white font-bold text-sm sm:text-base truncate">
                  {activeYoutube.title}
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  {activeYoutube.artist}
                </p>
              </div>
            </div>

            {/* Right: Authentic "Song" vs "Video" Switcher (Music.YouTube trope) */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-neutral-900 p-1 rounded-full border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setPlayerMode('song')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                    playerMode === 'song'
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Song</span>
                </button>
                <button
                  onClick={() => setPlayerMode('video')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                    playerMode === 'video'
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>
              </div>

              {/* Like / Heart */}
              <button
                onClick={() => toggleLike(activeYoutube)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isLiked(currentPlayingId)
                    ? 'bg-red-600/20 text-red-500'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                }`}
                title={isLiked(currentPlayingId) ? 'Liked' : 'Like Song'}
              >
                <Heart className={`w-4 h-4 ${isLiked(currentPlayingId) ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* MAIN PLAYER CANVAS (Song View vs Video View) */}
          {playerMode === 'video' ? (
            <div className="relative aspect-video w-full max-h-[460px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                title="YouTube Music Video Player"
                src={activeYoutube.embedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative bg-gradient-to-b from-neutral-900 to-black rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 overflow-hidden">
              {/* Blurred album backdrop */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${activeYoutube.cover})` }}
              />

              {/* Left: Big Album Art Canvas */}
              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                  <img
                    src={activeYoutube.cover}
                    alt={activeYoutube.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="flex items-end gap-1 h-6">
                        <span className="w-1 bg-red-500 rounded-full animate-bounce h-6"></span>
                        <span className="w-1 bg-red-500 rounded-full animate-bounce h-4 delay-75"></span>
                        <span className="w-1 bg-red-500 rounded-full animate-bounce h-7 delay-150"></span>
                        <span className="w-1 bg-red-500 rounded-full animate-bounce h-3 delay-100"></span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{activeYoutube.title}</h2>
                  <p className="text-sm font-semibold text-neutral-400">{activeYoutube.artist} • {activeYoutube.album}</p>
                </div>
              </div>

              {/* Right: Music Controls & Lyrics Peek */}
              <div className="relative z-10 flex-1 max-w-md w-full space-y-6">
                {/* Simulated Lyrics / Up Next preview toggle */}
                <div className="bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/10 pb-2">
                    <span className="font-bold uppercase tracking-wider text-neutral-300">
                      {lyricsActive ? 'Lyrics' : 'Up Next'}
                    </span>
                    <button
                      onClick={() => setLyricsActive(!lyricsActive)}
                      className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      {lyricsActive ? 'Show Up Next' : 'Show Lyrics'}
                    </button>
                  </div>

                  {lyricsActive ? (
                    <div className="space-y-1.5 text-xs text-neutral-300 font-medium max-h-32 overflow-y-auto pr-2">
                      <p className="text-white font-bold">♪ Singing with YouTube Music ♪</p>
                      <p>Playing: {activeYoutube.title}</p>
                      <p className="text-neutral-500">Artist: {activeYoutube.artist}</p>
                      <p className="italic text-neutral-400">Streamed unblocked without firewall blocks or ads.</p>
                      <p className="text-emerald-400 font-semibold">Background streaming active across all tabs.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 text-xs">
                      {queue.slice(currentQueueIndex + 1, currentQueueIndex + 4).map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => playYoutube(item)}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img src={item.cover} alt="" className="w-6 h-6 rounded object-cover" />
                            <span className="text-neutral-200 truncate">{item.title}</span>
                          </div>
                          <span className="text-neutral-500 shrink-0">{item.duration}</span>
                        </div>
                      ))}
                      {queue.length <= currentQueueIndex + 1 && (
                        <p className="text-neutral-500 text-center py-2">Queue finished. Click any song to add.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Audio Controls Bar */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isShuffle ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={skipPrevious}
                    className="p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Previous Song"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                  </button>

                  <button
                    onClick={skipNext}
                    className="p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Next Song"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      repeatMode !== 'off' ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={`Repeat: ${repeatMode}`}
                  >
                    {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-500" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-32 accent-red-600 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Under player embed helper info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Powered by YouTube Music Privacy Embed (no cookies/ad trackers).</span>
            <span>Plays continuously while you use Study Tools, Atari Game, or Web Navigator.</span>
          </div>
        </div>
      )}

      {/* QUEUE DRAWER (Collapsible) */}
      {isQueueOpen && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-red-500" />
              <h3 className="text-white font-bold text-base">Up Next Queue ({queue.length})</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearQueue}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                Clear Queue
              </button>
              <button
                onClick={() => setIsQueueOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto pr-1">
            {queue.map((track, idx) => {
              const isCurrent = idx === currentQueueIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                    isCurrent
                      ? 'bg-red-600/20 border border-red-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    onClick={() => playYoutube(track)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-neutral-500 w-5">
                      {isCurrent ? <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" /> : idx + 1}
                    </span>
                    <img
                      src={track.cover}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-red-400' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-500">{track.duration}</span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: HOME (Quick Picks & Top Highlights) */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Section 1: Quick Picks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                  START RADIO FROM A SONG
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Quick Picks
                </h2>
              </div>
              <button
                onClick={() => handlePlayMix(curatedPlaylists[0])}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play All</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPicks.map((track) => {
                const isSelected = currentPlayingId === track.id;
                return (
                  <div
                    key={track.id}
                    className="group relative bg-[#0f0f0f] border border-white/10 hover:border-white/25 rounded-2xl p-3 transition-all duration-300 hover:bg-neutral-900 shadow-md flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Play Overlay Button */}
                      <button
                        onClick={() => playYoutube(track, track.title, track.artist, filteredPicks)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        title="Play Song"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </button>

                      {isSelected && isPlaying && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          Playing
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2">
                        <span>{track.duration}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track);
                            }}
                            className={`p-1 rounded hover:text-red-500 cursor-pointer ${
                              isLiked(track.id) ? 'text-red-500' : 'text-neutral-500'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked(track.id) ? 'fill-red-500' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToQueue(track);
                            }}
                            className="p-1 rounded hover:text-white text-neutral-500 cursor-pointer"
                            title="Add to Queue"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Recommended Music Mixes */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                MIXED FOR YOU
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Playlists & Supermixes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaylists.map((mix) => (
                <div
                  key={mix.id}
                  onClick={() => handlePlayMix(mix)}
                  className="group relative bg-[#0f0f0f] border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all hover:bg-neutral-900 cursor-pointer overflow-hidden flex items-center gap-4"
                >
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${mix.gradient} shrink-0 overflow-hidden relative shadow-lg`}>
                    <img
                      src={mix.cover}
                      alt={mix.title}
                      className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <Play className="w-6 h-6 fill-white text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      YouTube Music Mix
                    </span>
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                      {mix.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {mix.subtitle}
                    </p>
                    <span className="text-[10px] text-neutral-500 mt-1 inline-block">
                      {mix.tracksCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP CHARTS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              GLOBAL & UNITED STATES
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Trending Top 100 Charts
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              The hottest tracks trending across YouTube and YouTube Music right now.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
            {filteredCharts.map((track) => {
              const isCurrent = currentPlayingId === track.id;
              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 sm:px-5 transition-colors hover:bg-neutral-900 ${
                    isCurrent ? 'bg-red-600/10' : ''
                  }`}
                >
                  <div
                    onClick={() => playYoutube(track, track.title, track.artist, filteredCharts)}
                    className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 cursor-pointer"
                  >
                    <span className={`w-6 text-center text-sm sm:text-base font-black ${
                      track.rank <= 3 ? 'text-red-500' : 'text-neutral-500'
                    }`}>
                      #{track.rank}
                    </span>

                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md"
                    />

                    <div className="min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${
                        isCurrent ? 'text-red-400' : 'text-white'
                      }`}>
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist} • {track.album}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-neutral-500 hidden sm:inline">{track.plays}</span>
                    <span className="text-xs text-neutral-400">{track.duration}</span>

                    <button
                      onClick={() => toggleLike(track)}
                      className={`p-1.5 rounded-lg hover:text-red-500 cursor-pointer ${
                        isLiked(track.id) ? 'text-red-500' : 'text-neutral-500'
                      }`}
                      title="Like track"
                    >
                      <Heart className={`w-4 h-4 ${isLiked(track.id) ? 'fill-red-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => addToQueue(track)}
                      className="p-1.5 rounded-lg hover:text-white text-neutral-500 cursor-pointer"
                      title="Add to Queue"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MIXES & VIBES */}
      {activeTab === 'mixes' && (
        <div className="space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              MOODS & SOUNDTRACKS
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Curated Mixes & Audio Hubs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedPlaylists.map((mix) => (
              <div
                key={mix.id}
                className="bg-[#0f0f0f] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden shadow-xl transition-all hover:bg-neutral-900 group"
              >
                <div className={`relative h-44 bg-gradient-to-br ${mix.gradient} overflow-hidden`}>
                  <img
                    src={mix.cover}
                    alt={mix.title}
                    className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      {mix.tracksCount}
                    </span>
                    <h3 className="text-lg font-black text-white">
                      {mix.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {mix.subtitle}
                  </p>

                  <button
                    onClick={() => handlePlayMix(mix)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Mix Station</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USER LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
                YOUR MUSIC VAULT
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <ListMusic className="w-6 h-6 text-indigo-400" />
                Library & Custom Playlists
              </h2>
            </div>

            <button
              onClick={() => setIsCreatingPlaylist(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer self-start"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Playlist</span>
            </button>
          </div>

          {/* New Playlist Modal / Inline form */}
          {isCreatingPlaylist && (
            <form onSubmit={handleCreatePlaylist} className="bg-neutral-900 border border-white/10 rounded-2xl p-4 flex gap-3">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist title (e.g. Study Session, Hype Beats)..."
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPlaylist(false)}
                className="px-3 py-2 bg-neutral-800 text-neutral-400 hover:text-white text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Liked Songs Collection */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              Liked Songs ({likedSongs.length})
            </h3>

            {likedSongs.length === 0 ? (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 text-center text-neutral-400 text-xs">
                You haven't liked any songs yet. Click the heart icon on any song to save it here!
              </div>
            ) : (
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                {likedSongs.map((track, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 sm:px-4 hover:bg-neutral-900 transition-colors"
                  >
                    <div
                      onClick={() => playYoutube(track, track.title, track.artist, likedSongs)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <img
                        src={track.cover}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-neutral-500">{track.duration}</span>
                      <button
                        onClick={() => toggleLike(track)}
                        className="p-1 text-red-500 hover:text-neutral-400 transition-colors cursor-pointer"
                        title="Remove from Liked"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Playlists */}
          <div className="space-y-3 pt-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-indigo-400" />
              Custom Student Playlists ({userPlaylists.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{pl.name}</h4>
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                      {pl.tracks.length} tracks
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {pl.description || 'Personal playlist'}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (pl.tracks.length > 0) {
                          playYoutube(pl.tracks[0], pl.tracks[0].title, pl.tracks[0].artist, pl.tracks);
                        }
                      }}
                      disabled={pl.tracks.length === 0}
                      className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play Playlist</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PASTE ANY LINK */}
      {activeTab === 'paste' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <LinkIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">Paste Any YouTube Music Link</h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
              Bypass school network blockers. Paste any song, playlist, or music video URL from music.youtube.com or youtube.com.
            </p>
          </div>

          <form onSubmit={handlePasteUrl} className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300">YouTube or YouTube Music URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://music.youtube.com/watch?v=... or https://youtube.com/watch?v=..."
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {urlStatus && (
              <div className={`p-3 rounded-xl text-xs ${
                urlStatus.error
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {urlStatus.error || urlStatus.success}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Stream Link Unblocked</span>
            </button>
          </form>

          {/* Quick Examples */}
          <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Supported Link Formats
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <code>https://music.youtube.com/watch?v=4NRXx6U8ABQ</code>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <code>https://www.youtube.com/watch?v=xpVfcZ0ZcFM</code>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <code>https://youtu.be/d5gf9dXbPi0</code>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <code>https://music.youtube.com/playlist?list=RDCLAK5uy_...</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: 24/7 LIVE RADIO & LOCAL FILES (Fallback options) */}
      {activeTab === 'radio' && (
        <div className="space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              NO ADS • 100% UPTIME
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Radio className="w-6 h-6 text-emerald-400" />
              Live 24/7 Radio & Local Audio
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Pure audio streams that consume almost zero CPU and bandwidth on Chromebooks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((st) => (
              <div
                key={st.id}
                onClick={() => playStation(st)}
                className="bg-[#0f0f0f] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 cursor-pointer transition-all hover:bg-neutral-900 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.cover}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {st.genre}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-300">
                      {st.name}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate">
                      {st.artist}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {st.description}
                </p>
              </div>
            ))}
          </div>

          {/* Local MP3 File Player */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <FileAudio className="w-4 h-4 text-amber-400" />
                Play Offline Local MP3 Files
              </h3>
              <p className="text-xs text-neutral-400">
                Downloaded an audio file or school lecture? Play it right here offline.
              </p>
            </div>

            <label className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors shrink-0">
              <span>Choose Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) playLocalFile(file);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
