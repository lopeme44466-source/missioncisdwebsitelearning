import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

// Import game components
import {
  FruitBladeSlicerGame,
  GeometryNeonDashGame,
  BasketballHoopsGame,
  BubbleShooterGame,
  GalagaSpaceDefenderGame,
} from './BlockbusterArcadeGames';

import {
  SlopeRunnerGame,
  HelixDropGame,
  SubwayDashGame,
  Stacker3DGame,
  KnifeHitGame,
  CookieClickerGame,
} from './MoreArcadeGames';

import {
  PongClassicGame,
  DinoRunnerGame,
  MinesweeperGame,
  Connect4Game,
} from './ExtraArcadeGames';

// Classic canvas mini-games: Snake, Flappy, Breakout, 2048
function ClassicSnakeGame() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 8 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  React.useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 15),
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 110);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[400px]">
        <span className="font-bold text-sm text-emerald-400">Retro Snake Classic</span>
        <span className="text-emerald-400 font-mono text-xs">Score: {score}</span>
      </div>
      <div className="relative w-[400px] h-[300px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute rounded-sm bg-emerald-400"
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              width: '18px',
              height: '18px',
            }}
          />
        ))}
        <div
          className="absolute rounded-full bg-red-500 shadow-md"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            width: '18px',
            height: '18px',
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
            <span className="font-bold text-white text-lg">Game Over!</span>
            <button
              onClick={() => {
                setSnake([{ x: 5, y: 5 }]);
                setScore(0);
                setGameOver(false);
              }}
              className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RetroFlappyBird() {
  const [birdY, setBirdY] = useState(120);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const flap = () => {
    if (gameOver) {
      setBirdY(120);
      setVelocity(0);
      setScore(0);
      setGameOver(false);
      return;
    }
    setVelocity(-7);
  };

  React.useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBirdY((y) => {
        const next = y + velocity;
        if (next > 270 || next < 0) {
          setGameOver(true);
          return y;
        }
        return next;
      });
      setVelocity((v) => v + 0.45); // gravity
      setScore((s) => s + 1);
    }, 30);
    return () => clearInterval(interval);
  }, [velocity, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[360px]">
        <span className="font-bold text-sm text-amber-400">Flappy Bird Flight</span>
        <span className="text-amber-400 font-mono text-xs">Score: {score}</span>
      </div>
      <div
        onClick={flap}
        className="relative w-[360px] h-[300px] bg-sky-950 rounded-xl border border-slate-800 overflow-hidden cursor-pointer"
      >
        <div
          className="absolute w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 transition-transform shadow-md"
          style={{ top: `${birdY}px`, left: '60px' }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
            <span className="font-bold text-white text-lg">Crashed!</span>
            <span className="text-xs text-slate-300">Click to Fly Again</span>
          </div>
        )}
      </div>
    </div>
  );
}

const GAME_CATALOG = [
  { id: 'fruit-slicer', name: 'Fruit Blade Slicer', category: 'Blockbuster', icon: '🍉', comp: FruitBladeSlicerGame },
  { id: 'geometry-dash', name: 'Geometry Neon Dash', category: 'Blockbuster', icon: '⚡', comp: GeometryNeonDashGame },
  { id: 'basketball-hoops', name: 'Basketball Hoops 3D', category: 'Sports', icon: '🏀', comp: BasketballHoopsGame },
  { id: 'bubble-shooter', name: 'Bubble Match 3 Shooter', category: 'Puzzle', icon: '🔮', comp: BubbleShooterGame },
  { id: 'galaga', name: 'Galaga Space Defender', category: 'Shooter', icon: '🚀', comp: GalagaSpaceDefenderGame },
  { id: 'slope-3d', name: 'Slope 3D Endless Tunnel', category: 'Runner', icon: '🌐', comp: SlopeRunnerGame },
  { id: 'subway-dash', name: 'Subway Dash 3-Lane', category: 'Runner', icon: '🏃', comp: SubwayDashGame },
  { id: 'helix-drop', name: 'Helix Drop Tower', category: 'Arcade', icon: '🌀', comp: HelixDropGame },
  { id: 'knife-hit', name: 'Knife Hit Target', category: 'Skill', icon: '🗡️', comp: KnifeHitGame },
  { id: 'cookie-clicker', name: 'Cookie Clicker Supreme', category: 'Idle', icon: '🍪', comp: CookieClickerGame },
  { id: 'stacker-3d', name: 'Stacker Tower', category: 'Skill', icon: '🧱', comp: Stacker3DGame },
  { id: 'pong-classic', name: 'Pong Classic Retro', category: 'Retro', icon: '🏓', comp: PongClassicGame },
  { id: 'dino-runner', name: 'Chrome T-Rex Dino Jump', category: 'Runner', icon: '🦖', comp: DinoRunnerGame },
  { id: 'minesweeper', name: 'Minesweeper 8x8', category: 'Strategy', icon: '💣', comp: MinesweeperGame },
  { id: 'connect-4', name: 'Connect 4 In-A-Row', category: 'Strategy', icon: '🔴', comp: Connect4Game },
  { id: 'snake', name: 'Retro Snake Classic', category: 'Retro', icon: '🐍', comp: ClassicSnakeGame },
  { id: 'flappy-bird', name: 'Flappy Bird Flight', category: 'Arcade', icon: '🐥', comp: RetroFlappyBird },
];

export default function GamesArcadeApp() {
  const [selectedGameId, setSelectedGameId] = useState('fruit-slicer');
  const [filterCategory, setFilterCategory] = useState('All');

  const selectedGame = GAME_CATALOG.find((g) => g.id === selectedGameId) || GAME_CATALOG[0];
  const GameComponent = selectedGame.comp;

  const categories = ['All', 'Blockbuster', 'Runner', 'Retro', 'Skill', 'Puzzle', 'Sports'];

  const filteredGames = filterCategory === 'All'
    ? GAME_CATALOG
    : GAME_CATALOG.filter((g) => g.category === filterCategory);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Blockbuster Games Arcade (25+ Playable Games)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                Unblocked
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Fruit Blade Slicer, Geometry Dash, Basketball Hoops, Slope 3D, Cookie Clicker, and classics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Arcade Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Game Screen (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="w-full">
            <GameComponent />
          </div>
        </div>

        {/* Right: Games Selector List & Categories (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Choose Game ({filteredGames.length})
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Game List Items */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
              {filteredGames.map((game) => {
                const isSelected = selectedGameId === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/30 text-white font-bold shadow-xs'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <span className="text-xl shrink-0">{game.icon}</span>
                      <div className="truncate">
                        <p className="text-xs text-white truncate">{game.name}</p>
                        <span className="text-[10px] text-amber-400/80 font-normal">{game.category}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold shrink-0">
                        Playing
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
