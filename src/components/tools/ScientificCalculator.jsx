import React, { useState } from 'react';
import { Calculator, Delete, RotateCcw } from 'lucide-react';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');

  const handleDigit = (d) => {
    setDisplay((prev) => (prev === '0' ? d : prev + d));
  };

  const handleOp = (op) => {
    setHistory(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setHistory('');
  };

  const handleFunc = (fn) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      if (fn === 'sin') res = Math.sin((val * Math.PI) / 180);
      else if (fn === 'cos') res = Math.cos((val * Math.PI) / 180);
      else if (fn === 'tan') res = Math.tan((val * Math.PI) / 180);
      else if (fn === 'sqrt') res = Math.sqrt(val);
      else if (fn === 'log') res = Math.log10(val);
      else if (fn === 'ln') res = Math.log(val);
      else if (fn === 'sq') res = val * val;
      setDisplay(res.toFixed(4).replace(/\.?0+$/, ''));
    } catch {
      setDisplay('Error');
    }
  };

  const handleEqual = () => {
    try {
      const full = (history + display).replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${full})`)();
      setDisplay(String(res));
      setHistory('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-sm mx-auto shadow-2xl">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-sm text-white">Scientific Calculator (SAT/AP Approved)</h3>
      </div>

      {/* Screen */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 text-right font-mono">
        <div className="text-[11px] text-slate-500 h-4">{history}</div>
        <div className="text-2xl font-black text-white truncate">{display}</div>
      </div>

      {/* Scientific Functions */}
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'sq', 'pi'].map((f) => (
          <button
            key={f}
            onClick={() => (f === 'pi' ? setDisplay(String(Math.PI.toFixed(5))) : handleFunc(f))}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-indigo-300 font-mono text-xs rounded-lg transition"
          >
            {f === 'sq' ? 'x²' : f === 'pi' ? 'π' : f}
          </button>
        ))}
      </div>

      {/* Main Keypad */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
        <button onClick={handleClear} className="p-3 bg-red-950/40 text-red-400 border border-red-500/30 rounded-lg">C</button>
        <button onClick={() => setDisplay((d) => d.slice(0, -1) || '0')} className="p-3 bg-slate-800 text-slate-300 rounded-lg">⌫</button>
        <button onClick={() => handleOp('%')} className="p-3 bg-slate-800 text-indigo-400 rounded-lg">%</button>
        <button onClick={() => handleOp('÷')} className="p-3 bg-indigo-600/30 text-indigo-300 rounded-lg">÷</button>

        {['7', '8', '9'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">{n}</button>
        ))}
        <button onClick={() => handleOp('×')} className="p-3 bg-indigo-600/30 text-indigo-300 rounded-lg">×</button>

        {['4', '5', '6'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">{n}</button>
        ))}
        <button onClick={() => handleOp('-')} className="p-3 bg-indigo-600/30 text-indigo-300 rounded-lg">-</button>

        {['1', '2', '3'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">{n}</button>
        ))}
        <button onClick={() => handleOp('+')} className="p-3 bg-indigo-600/30 text-indigo-300 rounded-lg">+</button>

        <button onClick={() => handleDigit('0')} className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg col-span-2">0</button>
        <button onClick={() => handleDigit('.')} className="p-3 bg-slate-800 text-white rounded-lg">.</button>
        <button onClick={handleEqual} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg shadow-md">=</button>
      </div>
    </div>
  );
}
