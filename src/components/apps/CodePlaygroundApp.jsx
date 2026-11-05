import React, { useState } from 'react';
import { 
  Code, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal,
  ExternalLink
} from 'lucide-react';

export const CodePlaygroundApp = () => {
  const [htmlCode, setHtmlCode] = useState(
`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0b0f19;
      color: #fff;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #1e293b;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #334155;
    }
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 15px;
    }
    button:hover {
      background: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Student Web Playground 🚀</h2>
    <p>Type HTML, CSS, or JS on the left to see live updates!</p>
    <button onclick="changeColor()">Click Me!</button>
  </div>

  <script>
    function changeColor() {
      const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
      const chosen = colors[Math.floor(Math.random() * colors.length)];
      document.querySelector('button').style.background = chosen;
      document.querySelector('h2').style.color = chosen;
    }
  </script>
</body>
</html>`
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setHtmlCode(
`<!DOCTYPE html>
<html>
<body>
  <h1>Hello World</h1>
</body>
</html>`
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[760px] max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">HTML / CSS / JS Code Playground</h3>
          <span className="text-xs text-slate-500 hidden sm:inline">· Live instant preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-[#0b0f19]">
          <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Editor (index.html)</span>
            <span className="text-emerald-400">Live Sync</span>
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="flex-1 w-full bg-transparent p-4 font-mono text-xs text-slate-200 outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Right: Live Preview */}
        <div className="flex flex-col bg-black">
          <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Live Output Preview</span>
          </div>
          <div className="flex-1 w-full h-full relative">
            <iframe
              srcDoc={htmlCode}
              title="Code Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
