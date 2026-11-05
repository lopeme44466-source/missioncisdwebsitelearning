import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, Trophy, Flame, Zap, Shield, Sparkles } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

/* =========================================================================
   1. FRUIT BLADE SLICER GAME (Fruit Ninja inspired)
   ========================================================================= */
export function FruitBladeSlicerGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const fruitsRef = useRef([]);
  const bladeTrailRef = useRef([]);
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  const FRUIT_TYPES = [
    { name: 'Watermelon', color: '#10b981', innerColor: '#ef4444', radius: 26, points: 10 },
    { name: 'Orange', color: '#f97316', innerColor: '#fed7aa', radius: 22, points: 15 },
    { name: 'Apple', color: '#dc2626', innerColor: '#fef08a', radius: 20, points: 20 },
    { name: 'Banana', color: '#eab308', innerColor: '#fef9c3', radius: 18, points: 25 },
    { name: 'Bomb', color: '#1e293b', innerColor: '#f43f5e', radius: 24, isBomb: true },
  ];

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    fruitsRef.current = [];
    bladeTrailRef.current = [];
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let spawnTimer = 0;

    const gameLoop = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn Fruits periodically
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        const x = 50 + Math.random() * (canvas.width - 100);
        const vx = (Math.random() - 0.5) * 4;
        const vy = -(9 + Math.random() * 5);
        fruitsRef.current.push({
          x,
          y: canvas.height + 20,
          vx,
          vy,
          type,
          sliced: false,
          rotation: 0,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        });
      }

      // Update & Draw Fruits
      for (let i = fruitsRef.current.length - 1; i >= 0; i--) {
        const f = fruitsRef.current[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.22; // gravity
        f.rotation += f.rotSpeed;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);

        if (!f.sliced) {
          ctx.beginPath();
          ctx.arc(0, 0, f.type.radius, 0, Math.PI * 2);
          ctx.fillStyle = f.type.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = f.type.color;
          ctx.fill();

          // Fruit core highlight
          ctx.beginPath();
          ctx.arc(0, 0, f.type.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = f.type.innerColor;
          ctx.fill();

          if (f.type.isBomb) {
            ctx.fillStyle = '#fff';
            ctx.font = '10px bold sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('💣', 0, 4);
          }
        } else {
          // Half 1
          ctx.beginPath();
          ctx.arc(-8, 0, f.type.radius * 0.8, 0, Math.PI);
          ctx.fillStyle = f.type.color;
          ctx.fill();
          // Half 2
          ctx.beginPath();
          ctx.arc(8, 0, f.type.radius * 0.8, Math.PI, Math.PI * 2);
          ctx.fillStyle = f.type.innerColor;
          ctx.fill();
        }
        ctx.restore();

        // Check if fruit fell off screen unsliced
        if (f.y > canvas.height + 40) {
          if (!f.sliced && !f.type.isBomb) {
            setLives((prev) => {
              const next = prev - 1;
              if (next <= 0) setGameOver(true);
              return Math.max(0, next);
            });
          }
          fruitsRef.current.splice(i, 1);
        }
      }

      // Draw Blade Trail
      if (bladeTrailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(bladeTrailRef.current[0].x, bladeTrailRef.current[0].y);
        for (let i = 1; i < bladeTrailRef.current.length; i++) {
          ctx.lineTo(bladeTrailRef.current[i].x, bladeTrailRef.current[i].y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#0284c7';
        ctx.stroke();

        // Fade trail
        bladeTrailRef.current.shift();
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  // Handle blade slicing collision
  const handlePointerMove = (e) => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bladeTrailRef.current.push({ x, y });
    if (bladeTrailRef.current.length > 8) bladeTrailRef.current.shift();

    // Check collision with fruits
    fruitsRef.current.forEach((f) => {
      if (!f.sliced) {
        const dist = Math.hypot(f.x - x, f.y - y);
        if (dist < f.type.radius + 10) {
          f.sliced = true;
          if (f.type.isBomb) {
            playBeep(180, 'sawtooth', 0.4);
            setGameOver(true);
            setLives(0);
          } else {
            playBeep(600 + Math.random() * 300, 'sine', 0.1);
            setScore((s) => s + f.type.points);
          }
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 relative">
      <div className="w-full flex justify-between items-center mb-3 max-w-[500px]">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">Fruit Blade Slicer</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-amber-400">Score: {score}</span>
          <span className="text-red-400">Lives: {'❤️'.repeat(lives)}</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={500}
          height={380}
          onMouseMove={handlePointerMove}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              const touch = e.touches[0];
              handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
            }
          }}
          className="cursor-crosshair bg-slate-950 block max-w-full"
        />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-white">
              {gameOver ? 'GAME OVER!' : 'FRUIT BLADE SLICER'}
            </h3>
            {gameOver && <p className="text-sm font-mono text-amber-400">Final Score: {score}</p>}
            <p className="text-xs text-slate-400 max-w-xs text-center">
              Swipe your mouse or finger to slice flying fruits! Avoid slicing black bombs!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Play Again' : 'Start Slicing'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   2. GEOMETRY NEON DASH GAME (Rhythm Cube Runner)
   ========================================================================= */
export function GeometryNeonDashGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const playerRef = useRef({
    x: 60,
    y: 260,
    vy: 0,
    size: 26,
    rotation: 0,
    groundY: 260,
    isGrounded: true,
  });
  const obstaclesRef = useRef([]);
  const animFrameRef = useRef(null);

  const jump = () => {
    if (!gameStarted || gameOver) return;
    const p = playerRef.current;
    if (p.isGrounded) {
      p.vy = -10.5;
      p.isGrounded = false;
      playBeep(480, 'square', 0.1);
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    playerRef.current = {
      x: 60,
      y: 260,
      vy: 0,
      size: 26,
      rotation: 0,
      groundY: 260,
      isGrounded: true,
    };
    obstaclesRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!gameStarted || gameOver) startGame();
        else jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameCount = 0;

    const loop = () => {
      frameCount++;
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 286, canvas.width, canvas.height - 286);
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 286);
      ctx.lineTo(canvas.width, 286);
      ctx.stroke();

      // Spawn Spikes and Obstacles
      if (frameCount % 75 === 0) {
        const type = Math.random() > 0.4 ? 'spike' : 'block';
        obstaclesRef.current.push({
          x: canvas.width + 20,
          y: type === 'spike' ? 286 : 256,
          type,
          width: 24,
          height: 28,
        });
      }

      // Update Player Physics
      const p = playerRef.current;
      p.y += p.vy;
      p.vy += 0.65; // gravity

      if (p.y >= p.groundY) {
        p.y = p.groundY;
        p.vy = 0;
        p.isGrounded = true;
        // Snap rotation
        p.rotation = Math.round(p.rotation / (Math.PI / 2)) * (Math.PI / 2);
      } else {
        p.rotation += 0.15; // rotate mid-air
      }

      // Draw Player Cube
      ctx.save();
      ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
      ctx.rotate(p.rotation);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#22d3ee';
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      // Inner eye
      ctx.fillStyle = '#fff';
      ctx.fillRect(-p.size / 4, -p.size / 4, p.size / 2, p.size / 2);
      ctx.restore();

      // Update & Draw Obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= 5.5; // scrolling speed

        ctx.fillStyle = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#e11d48';

        if (obs.type === 'spike') {
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y - obs.height);
          ctx.lineTo(obs.x + obs.width, obs.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }

        // Collision Check
        if (
          p.x < obs.x + obs.width &&
          p.x + p.size > obs.x &&
          p.y + p.size > obs.y - (obs.type === 'spike' ? obs.height : 0) &&
          p.y < obs.y + (obs.type === 'block' ? obs.height : 0)
        ) {
          playBeep(220, 'sawtooth', 0.3);
          setGameOver(true);
        }

        // Passed obstacle
        if (obs.x + obs.width < 0) {
          obstaclesRef.current.splice(i, 1);
          setScore((s) => {
            const next = s + 1;
            setHighScore((h) => Math.max(h, next));
            return next;
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 relative">
      <div className="w-full flex justify-between items-center mb-3 max-w-[500px]">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm">Geometry Neon Dash</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-cyan-400">Score: {score}</span>
          <span className="text-amber-400">Best: {highScore}</span>
        </div>
      </div>

      <div
        onClick={jump}
        className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={500} height={340} className="bg-slate-950 block max-w-full" />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-cyan-400">
              {gameOver ? 'CRASHED!' : 'GEOMETRY DASH'}
            </h3>
            {gameOver && <p className="text-sm font-mono text-white">Score: {score}</p>}
            <p className="text-xs text-slate-400 max-w-xs text-center">
              Tap Screen or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">Space</kbd> to jump over spikes!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Retry' : 'Start Running'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   3. BASKETBALL HOOPS PHYSICS GAME
   ========================================================================= */
export function BasketballHoopsGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const { playBeep } = useMusic();

  const ballRef = useRef({
    x: 80,
    y: 280,
    vx: 0,
    vy: 0,
    radius: 18,
    isShot: false,
  });
  const dragStartRef = useRef(null);
  const currentDragRef = useRef(null);
  const hoopRef = useRef({ x: 420, y: 150, radius: 24 });
  const animFrameRef = useRef(null);

  const startNewRound = () => {
    setScore(0);
    setStreak(0);
    setShotsLeft(10);
    setGameOver(false);
    resetBall();
  };

  const resetBall = () => {
    ballRef.current = {
      x: 80 + Math.random() * 40,
      y: 270 + Math.random() * 20,
      vx: 0,
      vy: 0,
      radius: 18,
      isShot: false,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor & Backboard
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 320, canvas.width, 40);

      // Draw Hoop & Backboard
      const h = hoopRef.current;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(h.x + 20, h.y - 45, 8, 70); // backboard
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(h.x - h.radius, h.y);
      ctx.lineTo(h.x + h.radius, h.y);
      ctx.stroke();

      // Net lines
      ctx.strokeStyle = '#ffffff88';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(h.x - h.radius, h.y);
      ctx.lineTo(h.x - 8, h.y + 25);
      ctx.lineTo(h.x + 8, h.y + 25);
      ctx.lineTo(h.x + h.radius, h.y);
      ctx.stroke();

      // Ball Physics
      const b = ballRef.current;
      if (b.isShot) {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.35; // gravity

        // Bounce on floor
        if (b.y + b.radius > 320) {
          b.y = 320 - b.radius;
          b.vy *= -0.6;
          b.vx *= 0.8;
        }

        // Backboard bounce
        if (b.x + b.radius > h.x + 20 && b.x - b.radius < h.x + 28 && b.y > h.y - 45 && b.y < h.y + 25) {
          b.vx = -Math.abs(b.vx) * 0.7;
          playBeep(300, 'sine', 0.05);
        }

        // Check Basket Score
        if (
          b.vy > 0 &&
          Math.abs(b.x - h.x) < h.radius - 4 &&
          Math.abs(b.y - h.y) < 10
        ) {
          playBeep(880, 'sine', 0.2);
          setScore((s) => s + 2);
          setStreak((st) => st + 1);
          b.vy = 2; // slow fall through net
          setTimeout(resetBall, 600);
        }

        // Out of bounds check
        if (b.x > canvas.width + 50 || b.x < -50 || (b.y > 310 && Math.abs(b.vx) < 0.2)) {
          setTimeout(resetBall, 400);
        }
      }

      // Draw Drag Trajectory Line
      if (dragStartRef.current && currentDragRef.current && !b.isShot) {
        const dx = dragStartRef.current.x - currentDragRef.current.x;
        const dy = dragStartRef.current.y - currentDragRef.current.y;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + dx * 1.5, b.y + dy * 1.5);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Basketball
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2;
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handlePointerDown = (e) => {
    if (gameOver || ballRef.current.isShot) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragStartRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    currentDragRef.current = dragStartRef.current;
  };

  const handlePointerMove = (e) => {
    if (!dragStartRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    currentDragRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerUp = () => {
    if (!dragStartRef.current || !currentDragRef.current) return;
    const dx = dragStartRef.current.x - currentDragRef.current.x;
    const dy = dragStartRef.current.y - currentDragRef.current.y;
    const b = ballRef.current;
    b.vx = dx * 0.16;
    b.vy = dy * 0.16;
    b.isShot = true;
    dragStartRef.current = null;
    currentDragRef.current = null;
    playBeep(440, 'triangle', 0.1);

    setShotsLeft((prev) => {
      const next = prev - 1;
      if (next <= 0) setGameOver(true);
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[500px]">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">Basketball Hoops 3D</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-amber-400">Score: {score}</span>
          <span className="text-orange-400">Shots: {shotsLeft}</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={500}
          height={360}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              const t = e.touches[0];
              handlePointerDown({ clientX: t.clientX, clientY: t.clientY });
            }
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              const t = e.touches[0];
              handlePointerMove({ clientX: t.clientX, clientY: t.clientY });
            }
          }}
          onTouchEnd={handlePointerUp}
          className="bg-slate-950 block max-w-full cursor-grab active:cursor-grabbing"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-amber-400">GAME OVER</h3>
            <p className="text-sm font-mono text-white">Final Score: {score} Points</p>
            <button
              onClick={startNewRound}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 text-center">
        Drag back from the ball to aim the arc shot, then release to sink the swish!
      </p>
    </div>
  );
}

/* =========================================================================
   4. BUBBLE SHOOTER GAME
   ========================================================================= */
export function BubbleShooterGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { playBeep } = useMusic();

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  const gridRef = useRef([]);
  const shooterRef = useRef({
    x: 240,
    y: 350,
    angle: -Math.PI / 2,
    color: COLORS[0],
    nextColor: COLORS[1],
  });
  const bulletRef = useRef(null);
  const animFrameRef = useRef(null);

  const initGrid = () => {
    const grid = [];
    for (let r = 0; r < 5; r++) {
      grid[r] = [];
      for (let c = 0; c < 10; c++) {
        grid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    }
    gridRef.current = grid;
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = 22;

    const loop = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Bubbles
      for (let r = 0; r < gridRef.current.length; r++) {
        for (let c = 0; c < 10; c++) {
          const color = gridRef.current[r]?.[c];
          if (color) {
            const bx = c * (radius * 2) + radius + 20;
            const by = r * (radius * 1.8) + radius + 10;
            ctx.beginPath();
            ctx.arc(bx, by, radius - 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.fill();
          }
        }
      }

      // Update Bullet
      const b = bulletRef.current;
      if (b) {
        b.x += b.vx;
        b.y += b.vy;

        // Wall bounce
        if (b.x < radius || b.x > canvas.width - radius) {
          b.vx *= -1;
          playBeep(400, 'sine', 0.05);
        }

        // Stick to top or hit existing bubble
        if (b.y < radius + 10) {
          playBeep(600, 'sine', 0.1);
          bulletRef.current = null;
          setScore((s) => s + 30);
        }
      }

      // Draw Shooter cannon
      const s = shooterRef.current;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, -8, 45, 16);
      ctx.restore();

      // Current bubble to shoot
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius - 2, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = s.color;
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const s = shooterRef.current;
    s.angle = Math.atan2(my - s.y, mx - s.x);
  };

  const handleShoot = () => {
    if (bulletRef.current) return;
    const s = shooterRef.current;
    const speed = 11;
    bulletRef.current = {
      x: s.x,
      y: s.y,
      vx: Math.cos(s.angle) * speed,
      vy: Math.sin(s.angle) * speed,
      color: s.color,
    };
    playBeep(700, 'triangle', 0.1);
    s.color = s.nextColor;
    s.nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[480px]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-sm">Bubble Shooter Match 3</span>
        </div>
        <span className="text-purple-400 font-mono text-xs">Score: {score}</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          onMouseMove={handleMouseMove}
          onClick={handleShoot}
          className="bg-slate-950 block max-w-full cursor-crosshair"
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Aim with mouse and click to shoot colored bubbles to clear the ceiling!
      </p>
    </div>
  );
}

/* =========================================================================
   5. GALAGA SPACE DEFENDER GAME
   ========================================================================= */
export function GalagaSpaceDefenderGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const shipRef = useRef({ x: 240, y: 340, width: 30, height: 26 });
  const lasersRef = useRef([]);
  const aliensRef = useRef([]);
  const animFrameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    lasersRef.current = [];
    aliensRef.current = [];

    // Spawn Squadron
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        aliensRef.current.push({
          x: 60 + c * 45,
          y: 40 + r * 35,
          vx: 1.5,
          type: r === 0 ? 'boss' : 'grunt',
          alive: true,
        });
      }
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 30; i++) {
        const sx = (Math.sin(i * 99) * 1000 + Date.now() * 0.05) % canvas.width;
        const sy = (Math.cos(i * 77) * 1000 + Date.now() * 0.1) % canvas.height;
        ctx.fillRect(Math.abs(sx), Math.abs(sy), 1.5, 1.5);
      }

      // Draw Spaceship
      const s = shipRef.current;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.height / 2);
      ctx.lineTo(s.x - s.width / 2, s.y + s.height / 2);
      ctx.lineTo(s.x + s.width / 2, s.y + s.height / 2);
      ctx.closePath();
      ctx.fill();

      // Lasers
      for (let i = lasersRef.current.length - 1; i >= 0; i--) {
        const l = lasersRef.current[i];
        l.y -= 8;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(l.x - 2, l.y, 4, 12);

        // Check hit alien
        aliensRef.current.forEach((a) => {
          if (a.alive && Math.abs(l.x - a.x) < 18 && Math.abs(l.y - a.y) < 16) {
            a.alive = false;
            lasersRef.current.splice(i, 1);
            playBeep(900, 'sine', 0.1);
            setScore((sc) => sc + 50);
          }
        });

        if (l.y < 0) lasersRef.current.splice(i, 1);
      }

      // Aliens
      let bounce = false;
      aliensRef.current.forEach((a) => {
        if (!a.alive) return;
        a.x += a.vx;
        if (a.x > canvas.width - 30 || a.x < 30) bounce = true;
      });

      if (bounce) {
        aliensRef.current.forEach((a) => {
          a.vx *= -1;
          a.y += 12;
          if (a.y > 310) setGameOver(true);
        });
      }

      aliensRef.current.forEach((a) => {
        if (!a.alive) return;
        ctx.fillStyle = a.type === 'boss' ? '#ef4444' : '#a855f7';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    shipRef.current.x = Math.max(20, Math.min(canvas.width - 20, e.clientX - rect.left));
  };

  const handleShoot = () => {
    if (!gameStarted || gameOver) return;
    const s = shipRef.current;
    lasersRef.current.push({ x: s.x, y: s.y - 15 });
    playBeep(650, 'square', 0.05);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[480px]">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm">Galaga Space Defender</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-indigo-400">Score: {score}</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          onMouseMove={handlePointerMove}
          onClick={handleShoot}
          className="bg-slate-950 block max-w-full cursor-pointer"
        />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-indigo-400">
              {gameOver ? 'MISSION FAILED' : 'GALAGA DEFENDER'}
            </h3>
            {gameOver && <p className="text-sm font-mono text-white">Score: {score}</p>}
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{gameOver ? 'Play Again' : 'Launch Fighter'}</span>
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Move mouse to pilot ship, click to fire blaster cannons!
      </p>
    </div>
  );
}
