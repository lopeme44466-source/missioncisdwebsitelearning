import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export default function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const { playBeep } = useMusic();

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      playBeep(880, 'sine', 0.5);
      if (mode === 'focus') {
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        setMode('focus');
        setSecondsLeft(25 * 60);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const toggle = () => setIsActive(!isActive);

  const reset = (mins = 25, newMode = 'focus') => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(mins * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-sm mx-auto shadow-2xl text-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Clock className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-sm text-white">Pomodoro Study Focus Timer</h3>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => reset(25, 'focus')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            mode === 'focus' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => reset(5, 'break')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            mode === 'break' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          5m Break
        </button>
      </div>

      <div className="text-5xl font-mono font-black text-white my-3">
        {mins < 10 ? '0' : ''}{mins}:{secs < 10 ? '0' : ''}{secs}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={toggle}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Pause' : 'Start Focus'}</span>
        </button>
        <button
          onClick={() => reset(mode === 'focus' ? 25 : 5, mode)}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
