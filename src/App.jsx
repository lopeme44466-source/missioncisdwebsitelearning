import React, { useState, useEffect } from 'react';
import {
  Camera,
  Gamepad2,
  Compass,
  Film,
  Music,
  Award,
  FlaskConical,
  Volume2,
  Video,
  Shield,
  Sparkles,
  AlertOctagon,
  Home,
  Palette,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Link2,
} from 'lucide-react';

import AppsHub from './components/AppsHub';
import WebNavigator from './components/WebNavigator';
import MissionCisdView from './components/MissionCisdView';
import CloakModal from './components/CloakModal';
import PanicOverlay from './components/PanicOverlay';
import PasteUrlModal from './components/PasteUrlModal';

// Apps
import AiCameraExamApp from './components/apps/AiCameraExamApp';
import ExamCramApp from './components/apps/ExamCramApp';
import PeriodicTableApp from './components/apps/PeriodicTableApp';
import GamesArcadeApp from './components/apps/GamesArcadeApp';
import MoviesAndVideosApp from './components/apps/MoviesAndVideosApp';
import SpotifyApp from './components/apps/SpotifyApp';
import StudentDistractionsApp from './components/apps/StudentDistractionsApp';
import TikTokApp from './components/apps/TikTokApp';
import OmeTvApp from './components/apps/OmeTvApp';

// Tools
import ScientificCalculator from './components/tools/ScientificCalculator';
import FlashcardMaster from './components/tools/FlashcardMaster';
import PomodoroTimer from './components/tools/PomodoroTimer';

import { openAboutBlankCloak, applyCloakPreset, getSavedCloakPreset } from './utils/cloak';
import { useMusic } from './context/MusicContext';

const BACKGROUND_THEMES = [
  { id: 'nebula', name: 'Cosmic Nebula', bgClass: 'bg-gradient-to-br from-[#070913] via-[#0b0f24] to-[#110d29]' },
  { id: 'slate', name: 'Midnight Slate', bgClass: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950' },
  { id: 'cyber', name: 'Cyber Neon', bgClass: 'bg-gradient-to-br from-[#060814] via-[#09152b] to-[#120722]' },
  { id: 'emerald', name: 'Forest Emerald', bgClass: 'bg-gradient-to-br from-[#05130f] via-[#071a17] to-[#040d0e]' },
];

export default function App() {
  const [currentView, setCurrentView] = useState('hub');
  const [isDisguised, setIsDisguised] = useState(false);
  const [showCloakModal, setShowCloakModal] = useState(false);
  const [showPanicOverlay, setShowPanicOverlay] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pendingBrowserUrl, setPendingBrowserUrl] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('nebula');

  const { isPlaying, togglePlay, currentTrack, volume, setVolume, nextTrack } = useMusic();

  // Apply saved cloak preset on launch
  useEffect(() => {
    const saved = getSavedCloakPreset();
    if (saved) applyCloakPreset(saved.id);
  }, []);

  // Emergency Panic Key: Escape toggles Mission CISD disguise
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDisguised((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If disguise is active, render Mission CISD screen
  if (isDisguised) {
    return <MissionCisdView onExitDisguise={() => setIsDisguised(false)} />;
  }

  // If panic overlay is active
  if (showPanicOverlay) {
    return (
      <PanicOverlay
        onRestore={() => setShowPanicOverlay(false)}
        onSwitchToMission={() => {
          setShowPanicOverlay(false);
          setIsDisguised(true);
        }}
      />
    );
  }

  const activeTheme = BACKGROUND_THEMES.find((t) => t.id === currentTheme) || BACKGROUND_THEMES[0];

  return (
    <div className={`min-h-screen ${activeTheme.bgClass} text-slate-100 flex flex-col font-sans transition-colors duration-500`}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / App Title */}
          <div
            onClick={() => setCurrentView('hub')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              M
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                <span>Mateo's Learning</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">AI Exam Solver & Unblocked Suite</p>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setCurrentView('hub')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'hub' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hub</span>
            </button>

            <button
              onClick={() => setCurrentView('camera-exam')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'camera-exam' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Camera Exam</span>
            </button>

            <button
              onClick={() => setCurrentView('exam-cram')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'exam-cram' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Pass Exam</span>
            </button>

            <button
              onClick={() => setCurrentView('games-arcade')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'games-arcade' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              <span>25+ Games</span>
            </button>

            <button
              onClick={() => setCurrentView('web-navigator')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                currentView === 'web-navigator' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Browser</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Quick Paste URL Button */}
            <button
              onClick={() => setShowPasteModal(true)}
              className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Paste any website, game, or video URL"
            >
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Paste URL</span>
            </button>

            {/* Global about:blank Stealth Button */}
            <button
              onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Launch Mateo's Hub inside undetectable about:blank tab"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Open in about:blank</span>
            </button>

            {/* Cloak Settings Modal Toggle */}
            <button
              onClick={() => setShowCloakModal(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Tab Cloak & Favicon Presets"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Emergency Panic Button */}
            <button
              onClick={() => setIsDisguised(true)}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Instantly switch to Mission CISD portal (Esc)"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Panic [Esc]</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {currentView === 'hub' && (
          <AppsHub
            onLaunchApp={(appId) => setCurrentView(appId)}
            onOpenPasteModal={() => setShowPasteModal(true)}
          />
        )}

        {currentView === 'camera-exam' && <AiCameraExamApp />}

        {currentView === 'exam-cram' && <ExamCramApp />}

        {currentView === 'periodic-table' && <PeriodicTableApp />}

        {currentView === 'games-arcade' && <GamesArcadeApp />}

        {currentView === 'web-navigator' && (
          <WebNavigator
            initialUrl={pendingBrowserUrl}
            onClearInitialUrl={() => setPendingBrowserUrl(null)}
          />
        )}

        {currentView === 'movies-videos' && <MoviesAndVideosApp />}

        {currentView === 'spotify-player' && <SpotifyApp />}

        {currentView === 'myinstants' && <StudentDistractionsApp />}

        {currentView === 'tiktok-reels' && <TikTokApp />}

        {currentView === 'ometv-connect' && <OmeTvApp />}

        {currentView === 'calc-tool' && <ScientificCalculator />}

        {currentView === 'flashcards-tool' && <FlashcardMaster />}

        {currentView === 'pomodoro-tool' && <PomodoroTimer />}
      </main>

      {/* Persistent Bottom Bar with Study Beats & Background Switcher */}
      <footer className="sticky bottom-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          {/* Audio Study Beats Player */}
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isPlaying ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title={isPlaying ? 'Pause Study Beats' : 'Play Lofi Study Beats'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <span className="hidden sm:inline font-mono text-[11px] text-slate-300 truncate max-w-xs">
              🎵 {currentTrack?.title} ({currentTrack?.genre})
            </span>
          </div>

          {/* Theme Switcher & Status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
              >
                {BACKGROUND_THEMES.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[10px] text-slate-500 hidden md:inline">
              Press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[9px] text-slate-400">Esc</kbd> for Mission CISD
            </span>
          </div>
        </div>
      </footer>

      {/* Cloak Setup Modal */}
      <CloakModal isOpen={showCloakModal} onClose={() => setShowCloakModal(false)} />

      {/* Paste Your URL Modal */}
      <PasteUrlModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onOpenInBrowser={(url) => {
          setPendingBrowserUrl(url);
          setCurrentView('web-navigator');
        }}
      />
    </div>
  );
}
