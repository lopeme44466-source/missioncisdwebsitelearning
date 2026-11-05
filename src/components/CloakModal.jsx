import React, { useState } from 'react';
import { X, Shield, Globe, ExternalLink, Check, Copy, Sparkles, AlertCircle } from 'lucide-react';
import { CLOAK_PRESETS, applyCloakPreset, getSavedCloakPreset, openAboutBlankCloak } from '../utils/cloak';

export default function CloakModal({ isOpen, onClose }) {
  const [selectedPreset, setSelectedPreset] = useState(() => getSavedCloakPreset().id);
  const [copied, setCopied] = useState(false);
  const [openedBlank, setOpenedBlank] = useState(false);

  if (!isOpen) return null;

  const handleApply = (presetId) => {
    setSelectedPreset(presetId);
    applyCloakPreset(presetId);
  };

  const handleOpenBlank = () => {
    const success = openAboutBlankCloak(window.location.href, selectedPreset);
    if (success) {
      setOpenedBlank(true);
      setTimeout(() => setOpenedBlank(false), 3000);
    } else {
      alert('Pop-up was blocked by browser! Please allow popups for this site to open about:blank stealth window.');
    }
  };

  const currentPreset = CLOAK_PRESETS.find(p => p.id === selectedPreset) || CLOAK_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Stealth Cloak & about:blank Setup
              </h3>
              <p className="text-xs text-slate-400">
                Disguise your browser tab & launch into an unblockable stealth window
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-slate-300 text-sm">
          {/* Main about:blank Action Button */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-blue-950/70 to-slate-900 border border-indigo-500/40 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Primary Stealth Feature
                </span>
                <h4 className="text-base font-bold text-white mb-1">Open in about:blank Window</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Opens Mateo's Learning Hub inside an invisible <code className="text-amber-300 font-mono">about:blank</code> tab. This leaves zero web history trail and bypasses standard URL keyword blockers!
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleOpenBlank}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition shadow-md cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch in about:blank Now</span>
              </button>

              {openedBlank && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 px-3 py-2 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" /> Opened in new about:blank tab!
                </span>
              )}
            </div>
          </div>

          {/* Tab Cloaking Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Choose Tab Disguise Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CLOAK_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApply(preset.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-xs'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img
                        src={preset.iconUrl}
                        alt=""
                        className="w-5 h-5 rounded object-contain shrink-0 bg-white/10 p-0.5"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="truncate">
                        <p className="font-semibold text-xs text-white truncate">{preset.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{preset.title}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
              Live Browser Tab Title Preview:
            </span>
            <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="truncate">{currentPreset.title}</span>
            </div>
          </div>

          {/* Emergency Key Notice */}
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Emergency Panic Key</p>
              <p className="text-amber-200/80 text-[11px] mt-0.5">
                Press <kbd className="px-1.5 py-0.5 bg-black/40 border border-amber-500/40 rounded font-mono text-[10px]">Esc</kbd> at any time to instantly lock into the Mission CISD student portal disguise.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
