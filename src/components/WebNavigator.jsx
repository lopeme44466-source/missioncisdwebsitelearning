import React, { useState } from 'react';
import {
  Search,
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Plus,
  X,
  Shield,
  Tv,
  Film,
  Music,
  Volume2,
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
} from 'lucide-react';
import { openAboutBlankCloak } from '../utils/cloak';

const QUICK_BOOKMARKS = [
  {
    name: 'DuckDuckGo',
    category: 'Search',
    url: 'https://duckduckgo.com',
    icon: '🦆',
    desc: 'Private, unmonitored web search engine',
    directSearch: 'https://duckduckgo.com/?q=',
  },
  {
    name: 'Tubi TV',
    category: 'Movies',
    url: 'https://tubitv.com/',
    icon: '🍿',
    desc: 'Free 100% legal movies and TV shows',
    badge: 'Requested',
  },
  {
    name: 'Pluto TV',
    category: 'Movies',
    url: 'https://pluto.tv/',
    icon: '📺',
    desc: 'Drop in. Watch free TV & live channels',
    badge: 'Requested',
  },
  {
    name: 'Netflix',
    category: 'Movies',
    url: 'https://www.netflix.com/',
    icon: '🎬',
    desc: 'Watch movies, TV shows, and series',
    badge: 'Requested',
  },
  {
    name: 'MyInstants',
    category: 'Fun & Audio',
    url: 'https://www.myinstants.com/',
    icon: '🔊',
    desc: 'Sound buttons, memes & instant soundboard',
    badge: 'Requested',
  },
  {
    name: 'Spotify Web',
    category: 'Music',
    url: 'https://open.spotify.com/',
    icon: '🎵',
    desc: 'Listen to study playlists & podcasts',
    badge: 'Requested',
  },
  {
    name: 'YouTube',
    category: 'Video',
    url: 'https://www.youtube.com/',
    icon: '▶️',
    desc: 'Video lectures, lofi streams & tutorials',
  },
  {
    name: 'Khan Academy',
    category: 'School',
    url: 'https://www.khanacademy.org/',
    icon: '🎓',
    desc: 'SAT prep, Math, AP Bio & Chemistry',
  },
  {
    name: 'Desmos Calculator',
    category: 'Math',
    url: 'https://www.desmos.com/calculator',
    icon: '📈',
    desc: 'Interactive graphing calculator',
  },
  {
    name: 'Wolfram Alpha',
    category: 'Exam AI',
    url: 'https://www.wolframalpha.com/',
    icon: '🧠',
    desc: 'Computational intelligence & step solver',
  },
  {
    name: 'Wikipedia',
    category: 'Research',
    url: 'https://en.wikipedia.org/',
    icon: '📖',
    desc: 'Free open encyclopedia for essays',
  },
  {
    name: 'Quizlet',
    category: 'Study',
    url: 'https://quizlet.com/',
    icon: '🃏',
    desc: 'Flashcards, tests, and study sets',
  },
];

export default function WebNavigator() {
  const [tabs, setTabs] = useState([
    { id: 1, title: 'DuckDuckGo Search', url: 'https://duckduckgo.com' },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('https://duckduckgo.com');
  const [searchEngine, setSearchEngine] = useState('duckduckgo'); // 'duckduckgo' or 'google'
  const [showBookmarks, setShowBookmarks] = useState(true);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleNavigate = (e) => {
    if (e) e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = 'https://' + target;
      } else {
        // Perform search with chosen engine
        if (searchEngine === 'duckduckgo') {
          target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
        } else {
          target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
        }
      }
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: target,
              title: extractHost(target),
            }
          : t
      )
    );
    setUrlInput(target);
    setShowBookmarks(false);
  };

  const extractHost = (u) => {
    try {
      const parsed = new URL(u);
      return parsed.hostname.replace('www.', '');
    } catch {
      return u.slice(0, 20);
    }
  };

  const handleOpenBookmark = (bookmark) => {
    setUrlInput(bookmark.url);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: bookmark.url, title: bookmark.name }
          : t
      )
    );
    setShowBookmarks(false);
  };

  const handleNewTab = () => {
    const newId = Date.now();
    const newTab = { id: newId, title: 'DuckDuckGo', url: 'https://duckduckgo.com' };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput('https://duckduckgo.com');
    setShowBookmarks(true);
  };

  const handleCloseTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      setActiveTabId(filtered[0].id);
      setUrlInput(filtered[0].url);
    }
  };

  const handleOpenInAboutBlank = (url = activeTab?.url || 'https://duckduckgo.com') => {
    openAboutBlankCloak(url, 'mission-cisd');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Tab Strip */}
      <div className="bg-slate-900 border-b border-slate-800 flex items-center px-2 pt-2 gap-1 overflow-x-auto select-none">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setUrlInput(tab.url);
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-xl text-xs max-w-[200px] border-t border-x cursor-pointer transition ${
              tab.id === activeTabId
                ? 'bg-slate-950 text-white border-slate-700 font-semibold shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-transparent hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="hover:text-red-400 hover:bg-slate-800 rounded p-0.5 ml-1 transition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleNewTab}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition mb-1 cursor-pointer"
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Global stealth popout in tab strip */}
        <div className="ml-auto flex items-center gap-2 pb-1 pr-1">
          <button
            onClick={() => handleOpenInAboutBlank()}
            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Open current page in stealth about:blank window"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Open in about:blank</span>
          </button>
        </div>
      </div>

      {/* Navigation & Address Bar */}
      <div className="bg-slate-900 p-2.5 flex items-center space-x-2 border-b border-slate-800">
        <button
          onClick={() => setShowBookmarks(true)}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
            showBookmarks ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Quick Bookmarks"
        >
          <Compass className="w-4 h-4" />
          <span className="hidden md:inline">Bookmarks</span>
        </button>

        {/* Search Engine Selector */}
        <select
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value)}
          className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer focus:border-indigo-500"
        >
          <option value="duckduckgo">🦆 DuckDuckGo (Default)</option>
          <option value="google">🔍 Google Search</option>
        </select>

        {/* URL Input Form */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center relative">
          <div className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search DuckDuckGo or enter web address (e.g. tubitv.com, pluto.tv, netflix.com)..."
            className="w-full bg-slate-950 text-slate-100 text-xs pl-8 pr-16 py-2 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded-lg transition cursor-pointer"
          >
            Go
          </button>
        </form>

        {/* Direct Open in New Tab / about:blank Buttons */}
        <a
          href={activeTab.url}
          target="_blank"
          rel="noreferrer"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer shrink-0"
          title="Open in external browser window"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 flex flex-col">
        {showBookmarks ? (
          /* Bookmarks & Quick Launch Grid */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⚡ Quick Launch & Requested Portals</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Instant launch for Tubi TV, Pluto TV, Netflix, MyInstants, Spotify, DuckDuckGo, and exam tools.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenInAboutBlank('https://duckduckgo.com')}
                  className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch DuckDuckGo in about:blank</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {QUICK_BOOKMARKS.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 inline-flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenBookmark(item)}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Open Inside</span>
                    </button>

                    <button
                      onClick={() => openAboutBlankCloak(item.url, 'mission-cisd')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs transition cursor-pointer"
                      title="Open in about:blank cloaked tab"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                      title="Open direct external window"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Browser info tip */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-start space-x-3">
              <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold mb-0.5">School Firewall Note & about:blank Stealth</p>
                <p className="leading-relaxed">
                  Some school filters restrict third-party iframe embedding for sites like Netflix or Pluto TV directly inside frames. Click <strong className="text-amber-300">Open in about:blank</strong> (the sparkle button) on any card to launch the stealth unblocker tab!
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Live Browser Iframe Container */
          <div className="flex-1 flex flex-col relative w-full h-full">
            {/* Top helper banner for sites that refuse frame embedding */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
              <span className="truncate">
                Viewing: <code className="text-indigo-400 font-mono text-[11px]">{activeTab.url}</code>
              </span>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleOpenInAboutBlank(activeTab.url)}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Open in about:blank</span>
                </button>
                <a
                  href={activeTab.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>External Tab</span>
                </a>
              </div>
            </div>

            <iframe
              src={activeTab.url}
              title={activeTab.title}
              className="flex-1 w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              allow="camera; microphone; fullscreen; autoplay; clipboard-write; encrypted-media"
            />
          </div>
        )}
      </div>
    </div>
  );
}
