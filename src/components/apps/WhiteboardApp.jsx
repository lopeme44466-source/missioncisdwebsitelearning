import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Download, 
  Palette, 
  Sliders,
  Check
} from 'lucide-react';

export const WhiteboardApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState('brush'); // 'brush' | 'eraser'

  const COLORS = [
    '#ffffff', // White
    '#6366f1', // Indigo
    '#38bdf8', // Sky Blue
    '#34d399', // Emerald
    '#facc15', // Yellow
    '#fb923c', // Orange
    '#f87171', // Red
    '#e879f9', // Pink
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initial background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = mode === 'eraser' ? '#0f172a' : color;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard_notes_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[740px] max-w-5xl mx-auto">
      {/* Top Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <button
            onClick={() => setMode('brush')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'brush' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> Pen
          </button>
          <button
            onClick={() => setMode('eraser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'eraser' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" /> Eraser
          </button>
        </div>

        {/* Color Palette */}
        {mode === 'brush' && (
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                  color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-110'
                }`}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Brush Size */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Size:</span>
          {[2, 4, 8, 16].map((s) => (
            <button
              key={s}
              onClick={() => setBrushSize(s)}
              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] cursor-pointer ${
                brushSize === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Clear whiteboard"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            title="Save as PNG image"
          >
            <Download className="w-3.5 h-3.5" /> Save Image
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 relative bg-slate-900 cursor-crosshair overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
