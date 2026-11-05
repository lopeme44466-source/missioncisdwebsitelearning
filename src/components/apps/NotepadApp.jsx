import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Copy, 
  Download, 
  RotateCcw, 
  Check, 
  Save, 
  BookOpen 
} from 'lucide-react';

export const NotepadApp = () => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('prism_student_notes') || 
`# Student Study Notes & Homework Scratchpad

Date: October 31, 2026
Course: AP European History / Calculus BC

## Key Reminders:
- Complete Chapter 7 Equilibrium lab calculations before Thursday
- Review thermodynamic transitions in textile manufacturing
- Formula: integral of (x^2 + 1) dx = (1/3)x^3 + x + C

## Essay Outline Ideas:
1. Introduction: Technological catalyst of Watt's steam power
2. Rural-to-urban population consolidation (Manchester & Leeds)
3. Public health responses: Early municipal sanitary legislation
4. Conclusion: Modern economic labor foundations

(Everything typed here automatically auto-saves to your browser!)`;
  });

  const [copied, setCopied] = useState(false);
  const [savedTime, setSavedTime] = useState('Just now');

  useEffect(() => {
    localStorage.setItem('prism_student_notes', content);
    setSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [content]);

  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charsCount = content.length;
  const linesCount = content.split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `study_notes_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear all notepad text?')) {
      setContent('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[740px] max-w-5xl mx-auto">
      {/* Top Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-sm">Quick Notes & Scratchpad</h3>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            · Auto-saved at {savedTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            title="Download as .txt file"
          >
            <Download className="w-3.5 h-3.5" /> Download TXT
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition-colors cursor-pointer"
            title="Clear all text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-hidden flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your study notes, homework assignments, or scratch ideas here..."
          className="flex-1 w-full bg-transparent border-none outline-none resize-none text-slate-200 font-mono text-sm leading-relaxed placeholder-slate-600"
          autoFocus
        />
      </div>

      {/* Footer Word Counters */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-slate-200">{wordsCount}</strong></span>
          <span>Characters: <strong className="text-slate-200">{charsCount}</strong></span>
          <span>Lines: <strong className="text-slate-200">{linesCount}</strong></span>
        </div>
        <div className="text-slate-500 text-[11px]">
          100% Client-Side & Private
        </div>
      </div>
    </div>
  );
};
