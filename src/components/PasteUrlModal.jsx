import React, { useState, useEffect } from 'react';
import {
  Link2,
  Clipboard,
  ExternalLink,
  Sparkles,
  Globe,
  X,
  History,
  Trash2,
  Check,
  AlertCircle,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { openAboutBlankCloak } from '../utils/cloak';

export default function PasteUrlModal({ isOpen, onClose, onOpenInBrowser }) {
  const [url, setUrl] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load recent URLs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mateos_recent_pasted_urls');
      if (saved) {
        setRecentUrls(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sanitizeUrl = (input) => {
    let clean = input.trim();
    if (!clean) return '';
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    return clean;
  };

  const saveToHistory = (validUrl) => {
    try {
      const updated = [validUrl, ...recentUrls.filter((u) => u !== validUrl)].slice(0, 8);
      setRecentUrls(updated);
      localStorage.setItem('mateos_recent_pasted_urls', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearHistory = () => {
    setRecentUrls([]);
    try {
      localStorage.removeItem('mateos_recent_pasted_urls');
    } catch (e) {}
  };

  const handlePasteFromClipboard = async () => {
    setErrorMessage('');
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2000);
        } else {
          setErrorMessage('Clipboard is empty! Right-click or press Ctrl+V / Cmd+V to paste manually.');
        }
      } else {
        setErrorMessage('Clipboard access not supported by browser. Press Ctrl+V or Cmd+V to paste.');
      }
    } catch (err) {
      setErrorMessage('Permission to read clipboard was denied. Please paste with Ctrl+V / Cmd+V.');
    }
  };

  const handleOpenBlank = () => {
    setErrorMessage('');
    const target = sanitizeUrl(url);
    if (!target) {
      setErrorMessage('Please enter or paste a valid web address first!');
      return;
    }
    saveToHistory(target);
    const success = openAboutBlankCloak(target, 'mission-cisd');
    if (success) {
      onClose();
    } else {
      setErrorMessage('Pop-up was blocked by your browser! Please allow popups for about:blank stealth.');
    }
  };

  const handleOpenInAppBrowser = () => {
    setErrorMessage('');
    const target = sanitizeUrl(url);
    if (!target) {
      setErrorMessage('Please enter or paste a valid web address first!');
      return;
    }
    saveToHistory(target);
    onOpenInBrowser(target);
    onClose();
  };

  const handleOpenExternal = () => {
    setErrorMessage('');
    const target = sanitizeUrl(url);
    if (!target) {
      setErrorMessage('Please enter or paste a valid web address first!');
      return;
    }
    saveToHistory(target);
    window.open(target, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleSelectRecent = (historyUrl) => {
    setUrl(historyUrl);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Paste Your URL & Stealth Launcher</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                  Universal
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Paste any website, game, video link, or proxy to launch securely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-slate-200 text-xs leading-relaxed">
          {/* Main URL Input Box with Direct Paste Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>Enter or Paste Your URL</span>
              </label>
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition"
              >
                {copiedSuccess ? (
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

            <div className="relative flex items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOpenBlank();
                }}
                placeholder="Paste your URL here (e.g., https://tubitv.com, roblox.com, myinstants.com)..."
                autoFocus
                className="w-full bg-slate-950 text-white text-xs pl-3.5 pr-20 py-3.5 rounded-2xl border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition font-mono shadow-inner"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Clear URL"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="text-[11px] text-red-400 flex items-center gap-1.5 bg-red-950/30 border border-red-500/30 p-2 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* Action Launch Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Primary Stealth Action: about:blank */}
            <button
              onClick={handleOpenBlank}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex flex-col items-center justify-center space-y-1 shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95 group"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Open in about:blank</span>
              </div>
              <span className="text-[10px] font-normal opacity-85 text-slate-900">
                100% Stealth & Unblocked
              </span>
            </button>

            {/* In-App Browser Action */}
            <button
              onClick={handleOpenInAppBrowser}
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 shadow-lg shadow-indigo-600/20 transition cursor-pointer active:scale-95 group"
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Open in Browser</span>
              </div>
              <span className="text-[10px] font-normal opacity-80 text-indigo-100">
                Load inside Web Navigator
              </span>
            </button>

            {/* External New Tab */}
            <button
              onClick={handleOpenExternal}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center space-y-1 border border-slate-700 transition cursor-pointer active:scale-95"
            >
              <div className="flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4" />
                <span>External Tab</span>
              </div>
              <span className="text-[10px] font-normal text-slate-400">
                Regular new tab
              </span>
            </button>
          </div>

          {/* Quick Popular Presets for Instant Pasting */}
          <div className="space-y-2 pt-1">
            <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider block">
              Quick Suggestions & Popular Requested Links:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Tubi TV', url: 'https://tubitv.com/' },
                { name: 'Pluto TV', url: 'https://pluto.tv/' },
                { name: 'Netflix', url: 'https://www.netflix.com/' },
                { name: 'MyInstants', url: 'https://www.myinstants.com/' },
                { name: 'Spotify Web', url: 'https://open.spotify.com/' },
                { name: 'YouTube', url: 'https://www.youtube.com/' },
                { name: 'DuckDuckGo', url: 'https://duckduckgo.com/' },
                { name: 'Khan Academy', url: 'https://www.khanacademy.org/' },
                { name: 'Desmos', url: 'https://www.desmos.com/calculator' },
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUrl(p.url);
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700/60 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pasted History Section */}
          {recentUrls.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Recently Pasted URLs</span>
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                {recentUrls.map((hUrl, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition"
                  >
                    <span
                      onClick={() => handleSelectRecent(hUrl)}
                      className="font-mono text-[11px] text-cyan-300 truncate cursor-pointer hover:underline flex-1"
                      title={hUrl}
                    >
                      {hUrl}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          openAboutBlankCloak(hUrl, 'mission-cisd');
                          onClose();
                        }}
                        className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition"
                        title="Open in about:blank"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>blank</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenInBrowser(hUrl);
                          onClose();
                        }}
                        className="px-2 py-0.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition"
                        title="Open in Browser"
                      >
                        <Globe className="w-3 h-3" />
                        <span>browse</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Stealth Explanation */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300">How "Open in about:blank" Works</p>
              <p className="leading-relaxed mt-0.5">
                When you click <strong className="text-amber-300">Open in about:blank</strong>, your pasted link opens in an isolated browser window with the Mission CISD tab disguise. Your browsing history is not logged, and school web filters cannot inspect the URL.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
