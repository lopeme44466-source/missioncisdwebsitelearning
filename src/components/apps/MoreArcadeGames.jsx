import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, Trophy, Flame, Zap, Cookie } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

/* =========================================================================
   6. SLOPE 3D ROLLING BALL RUNNER
   ========================================================================= */
export function SlopeRunnerGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const ballRef = useRef({ x: 0, vx: 0 });
  const segmentsRef = useRef([]);
  const keysRef = useRef({});
  const animFrameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    ballRef.current = { x: 0, vx: 0 };
    segmentsRef.current = [];
    for (let i = 0; i < 20; i++) {
      segmentsRef.current.push({
        z: i * 30,
        curve: Math.sin(i * 0.4) * 60,
        obstacle: i > 4 && Math.random() > 0.6 ? (Math.random() > 0.5 ? 40 : -40) : null,
      });
    }
  };

  useEffect(() => {
    const handleDown = (e) => (keysRef.current[e.key] = true);
    const handleUp = (e) => (keysRef.current[e.key] = false);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const b = ballRef.current;
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) b.vx -= 0.6;
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) b.vx += 0.6;
      b.x += b.vx;
      b.vx *= 0.92;

      // Draw 3D Tunnel Slope segments
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.4;

      segmentsRef.current.forEach((seg) => {
        seg.z -= 1.8;
      });

      if (segmentsRef.current[0]?.z <= 0) {
        segmentsRef.current.shift();
        const lastZ = segmentsRef.current[segmentsRef.current.length - 1].z;
        segmentsRef.current.push({
          z: lastZ + 30,
          curve: Math.sin(Date.now() * 0.002) * 80,
          obstacle: Math.random() > 0.5 ? (Math.random() > 0.5 ? 40 : -40) : null,
        });
        setScore((s) => s + 5);
      }

      // Render wireframe road
      for (let i = segmentsRef.current.length - 1; i >= 0; i--) {
        const seg = segmentsRef.current[i];
        if (seg.z <= 0) continue;
        const scale = 250 / (seg.z + 100);
        const sx = centerX + seg.curve * scale;
        const sy = centerY + 180 * scale;
        const sw = 380 * scale;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = Math.max(1, 3 * scale);
        ctx.strokeRect(sx - sw / 2, sy, sw, 8 * scale);

        // Render obstacle
        if (seg.obstacle !== null) {
          ctx.fillStyle = '#ef4444';
          const ox = sx + seg.obstacle * scale;
          ctx.fillRect(ox - 15 * scale, sy - 30 * scale, 30 * scale, 30 * scale);

          // Near collision check
          if (seg.z < 15 && Math.abs(b.x - (seg.curve + seg.obstacle)) < 25) {
            playBeep(180, 'sawtooth', 0.3);
            setGameOver(true);
          }
        }
      }

      // Check fall off slope
      if (Math.abs(b.x) > 160) {
        playBeep(200, 'sawtooth', 0.2);
        setGameOver(true);
      }

      // Draw Rolling Ball
      ctx.beginPath();
      ctx.arc(centerX + b.x, centerY + 160, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#0284c7';
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[480px]">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">Slope 3D Endless</span>
        </div>
        <span className="text-emerald-400 font-mono text-xs">Score: {score}</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas ref={canvasRef} width={480} height={340} className="bg-slate-950 block max-w-full" />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-emerald-400">
              {gameOver ? 'FALLEN!' : 'SLOPE 3D'}
            </h3>
            {gameOver && <p className="text-sm font-mono text-white">Score: {score}</p>}
            <p className="text-xs text-slate-400 max-w-xs text-center">
              Use Left & Right Arrows (or A & D) to steer the ball along the neon tunnel track!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Play Again' : 'Roll Now'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   7. HELIX DROP TOWER BOUNCE
   ========================================================================= */
export function HelixDropGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { playBeep } = useMusic();

  const towerAngleRef = useRef(0);
  const ballYRef = useRef(80);
  const ballVyRef = useRef(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tower Pillar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(canvas.width / 2 - 25, 0, 50, canvas.height);

      // Helix Discs
      const cy = canvas.height / 2;
      for (let i = 0; i < 6; i++) {
        const dy = (i * 65 + (Date.now() * 0.05) % 65);
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(canvas.width / 2 - 90, dy, 70, 10);
        ctx.fillStyle = '#f43f5e'; // hazard
        ctx.fillRect(canvas.width / 2 + 20, dy, 70, 10);
      }

      // Bouncing ball
      ballVyRef.current += 0.25;
      ballYRef.current += ballVyRef.current;
      if (ballYRef.current > 280) {
        ballVyRef.current = -7;
        playBeep(600, 'sine', 0.05);
        setScore((s) => s + 10);
      }

      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 50, ballYRef.current, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[420px]">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm">Helix Tower Drop</span>
        </div>
        <span className="text-indigo-400 font-mono text-xs">Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width={420} height={340} className="bg-slate-950 rounded-xl max-w-full" />
    </div>
  );
}

/* =========================================================================
   8. SUBWAY DASH 3-LANE RUNNER
   ========================================================================= */
export function SubwayDashGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const laneRef = useRef(1); // 0, 1, 2
  const obstaclesRef = useRef([]);
  const animFrameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    laneRef.current = 1;
    obstaclesRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        laneRef.current = Math.max(0, laneRef.current - 1);
        playBeep(500, 'sine', 0.04);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        laneRef.current = Math.min(2, laneRef.current + 1);
        playBeep(500, 'sine', 0.04);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let timer = 0;

    const loop = () => {
      timer++;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 3 Lanes
      const laneWidth = canvas.width / 3;
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(i * laneWidth, 0, laneWidth, canvas.height);
      }

      // Spawn train cars / barriers
      if (timer % 55 === 0) {
        obstaclesRef.current.push({
          lane: Math.floor(Math.random() * 3),
          y: -50,
          height: 60,
        });
      }

      // Update Obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.y += 6;

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.lane * laneWidth + 10, obs.y, laneWidth - 20, obs.height);

        // Check Collision with player (player is at y: 260)
        if (obs.lane === laneRef.current && obs.y + obs.height > 250 && obs.y < 285) {
          playBeep(180, 'sawtooth', 0.3);
          setGameOver(true);
        }

        if (obs.y > canvas.height) {
          obstaclesRef.current.splice(i, 1);
          setScore((s) => s + 10);
        }
      }

      // Draw Runner Player
      const px = laneRef.current * laneWidth + laneWidth / 2;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, 265, 18, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[420px]">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-sky-400" />
          <span className="font-bold text-sm">Subway Dash 3-Lane</span>
        </div>
        <span className="text-sky-400 font-mono text-xs">Score: {score}</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas ref={canvasRef} width={420} height={340} className="bg-slate-950 block max-w-full" />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-sky-400">
              {gameOver ? 'TRAIN CRASH!' : 'SUBWAY DASH'}
            </h3>
            {gameOver && <p className="text-sm font-mono text-white">Score: {score}</p>}
            <p className="text-xs text-slate-400 max-w-xs text-center">
              Use Left & Right Arrows to switch lanes and dodge oncoming trains!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Play Again' : 'Sprint Now'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   9. STACKER 3D TOWER GAME
   ========================================================================= */
export function Stacker3DGame() {
  const [stackHeight, setStackHeight] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { playBeep } = useMusic();

  const handlePlaceBlock = () => {
    if (gameOver) {
      setStackHeight(0);
      setGameOver(false);
      return;
    }
    playBeep(440 + stackHeight * 30, 'square', 0.1);
    setStackHeight((h) => h + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-amber-400 mb-1">Stacker Tower</h3>
      <p className="text-xs text-slate-400 mb-4 font-mono">Current Height: {stackHeight} Blocks</p>

      <div
        onClick={handlePlaceBlock}
        className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 flex flex-col-reverse items-center justify-start p-4 overflow-hidden cursor-pointer shadow-inner relative"
      >
        {Array.from({ length: stackHeight }).map((_, i) => (
          <div
            key={i}
            className="w-44 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded border border-amber-300 shadow-md shrink-0 mb-1"
          />
        ))}

        {stackHeight === 0 && (
          <div className="m-auto text-center text-xs text-slate-500">
            Click anywhere inside to drop and stack blocks high!
          </div>
        )}
      </div>
      <button
        onClick={handlePlaceBlock}
        className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
      >
        Drop Block [Click]
      </button>
    </div>
  );
}

/* =========================================================================
   10. KNIFE HIT TARGET GAME
   ========================================================================= */
export function KnifeHitGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [knivesLeft, setKnivesLeft] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const { playBeep } = useMusic();

  const rotationRef = useRef(0);
  const embeddedAnglesRef = useRef([0, 1.2, 2.5]);
  const animFrameRef = useRef(null);

  const throwKnife = () => {
    if (gameOver || knivesLeft <= 0) return;
    const currentRot = rotationRef.current;
    // Check if hit existing knife
    const hitExisting = embeddedAnglesRef.current.some((ang) => {
      const diff = Math.abs((ang - currentRot) % (Math.PI * 2));
      return diff < 0.25 || diff > Math.PI * 2 - 0.25;
    });

    if (hitExisting) {
      playBeep(200, 'sawtooth', 0.2);
      setGameOver(true);
    } else {
      playBeep(750, 'sine', 0.08);
      embeddedAnglesRef.current.push(currentRot);
      setScore((s) => s + 10);
      setKnivesLeft((k) => k - 1);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotationRef.current += 0.03;
      const cx = canvas.width / 2;
      const cy = 120;
      const woodRadius = 55;

      // Draw Rotating Wood Target
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotationRef.current);

      ctx.beginPath();
      ctx.arc(0, 0, woodRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#b45309';
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Embedded Knives
      embeddedAnglesRef.current.forEach((ang) => {
        ctx.save();
        ctx.rotate(ang);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-3, woodRadius, 6, 25);
        ctx.restore();
      });

      ctx.restore();

      // Ready Knife at bottom
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 4, 250, 8, 35);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 3, 285, 6, 15); // hilt

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[380px]">
        <span className="font-bold text-sm text-amber-400">Knife Hit Target</span>
        <span className="text-xs font-mono">Knives: {knivesLeft} • Score: {score}</span>
      </div>

      <div onClick={throwKnife} className="cursor-pointer">
        <canvas ref={canvasRef} width={380} height={340} className="bg-slate-950 rounded-xl" />
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Click or tap to throw blade. Never hit an existing knife!
      </p>
    </div>
  );
}

/* =========================================================================
   11. COOKIE CLICKER SUPREME
   ========================================================================= */
export function CookieClickerGame() {
  const [cookies, setCookies] = useState(0);
  const [cps, setCps] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Grandma Baker', cost: 15, cpsAdd: 1, count: 0 },
    { id: 2, name: 'Cookie Farm', cost: 100, cpsAdd: 8, count: 0 },
    { id: 3, name: 'Cookie Factory', cost: 1100, cpsAdd: 45, count: 0 },
    { id: 4, name: 'Quantum Portal', cost: 12000, cpsAdd: 260, count: 0 },
  ]);
  const { playBeep } = useMusic();

  // Tick CPS
  useEffect(() => {
    const timer = setInterval(() => {
      setCookies((prev) => prev + cps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [cps]);

  const handleCookieClick = () => {
    playBeep(520, 'sine', 0.05);
    setCookies((prev) => prev + clickPower);
  };

  const buyUpgrade = (up) => {
    if (cookies < up.cost) return;
    setCookies((c) => c - up.cost);
    setCps((current) => current + up.cpsAdd);
    setUpgrades((list) =>
      list.map((item) =>
        item.id === up.id
          ? {
              ...item,
              count: item.count + 1,
              cost: Math.round(item.cost * 1.15),
            }
          : item
      )
    );
    playBeep(880, 'triangle', 0.1);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Big Cookie */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h3 className="text-xl font-black text-amber-400">Cookie Clicker</h3>
        <div>
          <p className="text-2xl font-mono font-bold text-white">{Math.floor(cookies)}</p>
          <p className="text-xs text-amber-300 font-mono">+{cps} cookies / sec</p>
        </div>

        <button
          onClick={handleCookieClick}
          className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 shadow-2xl active:scale-95 transition flex items-center justify-center cursor-pointer border-4 border-amber-400 hover:rotate-3 group"
        >
          <Cookie className="w-20 h-20 text-amber-950 group-hover:scale-110 transition" />
        </button>
        <span className="text-[11px] text-slate-400">Click Big Cookie!</span>
      </div>

      {/* Upgrades Store */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bakery Upgrades</h4>
        {upgrades.map((up) => {
          const canAfford = cookies >= up.cost;
          return (
            <button
              key={up.id}
              onClick={() => buyUpgrade(up)}
              disabled={!canAfford}
              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                canAfford
                  ? 'border-amber-500/40 bg-amber-950/20 text-white hover:bg-amber-950/40'
                  : 'border-slate-800 bg-slate-950/50 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <p className="font-bold text-white">{up.name} ({up.count})</p>
                <p className="text-[10px] text-amber-400">+{up.cpsAdd} CPS</p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-300">{up.cost} 🍪</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
