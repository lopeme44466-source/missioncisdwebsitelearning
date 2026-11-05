import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, Trophy } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

/* =========================================================================
   12. PONG CLASSIC VS AI
   ========================================================================= */
export function PongClassicGame() {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const { playBeep } = useMusic();

  const paddleHeight = 60;
  const paddleWidth = 10;
  const playerYRef = useRef(140);
  const aiYRef = useRef(140);
  const ballRef = useRef({ x: 220, y: 160, vx: 4, vy: 3 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dotted line
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      const b = ballRef.current;
      b.x += b.vx;
      b.y += b.vy;

      // Top/bottom bounce
      if (b.y < 8 || b.y > canvas.height - 8) {
        b.vy *= -1;
        playBeep(400, 'sine', 0.04);
      }

      // AI Paddle Follow
      if (aiYRef.current + paddleHeight / 2 < b.y - 10) aiYRef.current += 3.2;
      else if (aiYRef.current + paddleHeight / 2 > b.y + 10) aiYRef.current -= 3.2;

      // Player Paddle Bounce (left side)
      if (b.x < 25 && b.y > playerYRef.current && b.y < playerYRef.current + paddleHeight) {
        b.vx = Math.abs(b.vx) * 1.05;
        playBeep(600, 'square', 0.05);
      }

      // AI Paddle Bounce (right side)
      if (b.x > canvas.width - 25 && b.y > aiYRef.current && b.y < aiYRef.current + paddleHeight) {
        b.vx = -Math.abs(b.vx) * 1.05;
        playBeep(500, 'square', 0.05);
      }

      // Score Check
      if (b.x < 0) {
        setAiScore((s) => s + 1);
        b.x = canvas.width / 2;
        b.y = canvas.height / 2;
        b.vx = 4;
      } else if (b.x > canvas.width) {
        setPlayerScore((s) => s + 1);
        b.x = canvas.width / 2;
        b.y = canvas.height / 2;
        b.vx = -4;
      }

      // Draw Paddles
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(12, playerYRef.current, paddleWidth, paddleHeight);

      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(canvas.width - 22, aiYRef.current, paddleWidth, paddleHeight);

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
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
    playerYRef.current = Math.max(0, Math.min(canvas.height - paddleHeight, e.clientY - rect.top - paddleHeight / 2));
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[440px]">
        <span className="font-bold text-sm text-sky-400">Pong Classic Retro</span>
        <div className="flex space-x-4 text-xs font-mono">
          <span className="text-sky-400">You: {playerScore}</span>
          <span className="text-red-400">AI: {aiScore}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={440}
        height={300}
        onMouseMove={handleMouseMove}
        className="bg-slate-950 rounded-xl cursor-ns-resize"
      />
    </div>
  );
}

/* =========================================================================
   13. CHROME DINO RUNNER
   ========================================================================= */
export function DinoRunnerGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { playBeep } = useMusic();

  const dinoYRef = useRef(160);
  const dinoVyRef = useRef(0);
  const cactiRef = useRef([]);
  const animFrameRef = useRef(null);

  const jump = () => {
    if (!gameStarted || gameOver) {
      setScore(0);
      setGameOver(false);
      setGameStarted(true);
      dinoYRef.current = 160;
      dinoVyRef.current = 0;
      cactiRef.current = [];
      return;
    }
    if (dinoYRef.current >= 158) {
      dinoVyRef.current = -9;
      playBeep(480, 'sine', 0.05);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameStarted, gameOver]);

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

      // Ground
      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(canvas.width, 190);
      ctx.stroke();

      // Dino physics
      dinoVyRef.current += 0.5; // gravity
      dinoYRef.current += dinoVyRef.current;
      if (dinoYRef.current > 160) {
        dinoYRef.current = 160;
        dinoVyRef.current = 0;
      }

      // Draw Dino (T-rex simple silhouette)
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(40, dinoYRef.current, 24, 30);
      ctx.fillRect(52, dinoYRef.current - 10, 16, 12); // head

      // Spawn Cactus
      if (timer % 80 === 0) {
        cactiRef.current.push({ x: canvas.width, width: 14, height: 26 });
      }

      // Update Cacti
      for (let i = cactiRef.current.length - 1; i >= 0; i--) {
        const c = cactiRef.current[i];
        c.x -= 4.5;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(c.x, 190 - c.height, c.width, c.height);

        // Collision
        if (c.x < 64 && c.x + c.width > 40 && dinoYRef.current + 30 > 190 - c.height) {
          playBeep(180, 'sawtooth', 0.2);
          setGameOver(true);
        }

        if (c.x < -20) {
          cactiRef.current.splice(i, 1);
          setScore((s) => s + 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100">
      <div className="w-full flex justify-between items-center mb-3 max-w-[420px]">
        <span className="font-bold text-sm text-emerald-400">Chrome T-Rex Dino Jump</span>
        <span className="text-emerald-400 font-mono text-xs">Score: {score}</span>
      </div>

      <div onClick={jump} className="relative rounded-xl overflow-hidden border border-slate-700 cursor-pointer">
        <canvas ref={canvasRef} width={420} height={220} className="bg-slate-950 block max-w-full" />
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
            <p className="text-base font-bold text-white">{gameOver ? 'GAME OVER' : 'DINO RUNNER'}</p>
            <p className="text-xs text-slate-400">Click or press Space to jump cacti</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   14. MINESWEEPER LOGIC GAME
   ========================================================================= */
export function MinesweeperGame() {
  const ROWS = 8;
  const COLS = 8;
  const MINES = 8;
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const { playBeep } = useMusic();

  const resetGame = () => {
    let newGrid = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        hasMine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      }))
    );

    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].hasMine) {
        newGrid[r][c].hasMine = true;
        placed++;
      }
    }

    // Compute adjacents
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].hasMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (newGrid[r + dr]?.[c + dc]?.hasMine) count++;
            }
          }
          newGrid[r][c].adjacent = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleClick = (r, c) => {
    if (gameOver || win || grid[r][c].revealed || grid[r][c].flagged) return;

    if (grid[r][c].hasMine) {
      playBeep(200, 'sawtooth', 0.3);
      setGameOver(true);
      // Reveal all mines
      setGrid((prev) =>
        prev.map((row) =>
          row.map((cell) => ({
            ...cell,
            revealed: cell.hasMine ? true : cell.revealed,
          }))
        )
      );
    } else {
      playBeep(520, 'sine', 0.05);
      const next = grid.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c].revealed = true;
      setGrid(next);
    }
  };

  const handleContextMenu = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].revealed) return;
    const next = grid.map((row) => row.map((cell) => ({ ...cell })));
    next[r][c].flagged = !next[r][c].flagged;
    setGrid(next);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-sm mx-auto">
      <div className="w-full flex justify-between items-center mb-3">
        <span className="font-bold text-sm text-amber-400">Minesweeper 8x8</span>
        <button
          onClick={resetGame}
          className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1 p-2 bg-slate-950 rounded-xl border border-slate-800">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleContextMenu(e, r, c)}
              className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition cursor-pointer select-none ${
                cell.revealed
                  ? cell.hasMine
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-indigo-300'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {cell.revealed ? (cell.hasMine ? '💣' : cell.adjacent || '') : cell.flagged ? '🚩' : ''}
            </button>
          ))
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Right click to flag mines, left click to reveal.</p>
    </div>
  );
}

/* =========================================================================
   15. CONNECT 4 STRATEGY GAME
   ========================================================================= */
export function Connect4Game() {
  const [board, setBoard] = useState(
    Array(6).fill(null).map(() => Array(7).fill(null))
  );
  const [turn, setTurn] = useState('red'); // 'red' or 'yellow'
  const [winner, setWinner] = useState(null);
  const { playBeep } = useMusic();

  const dropPiece = (col) => {
    if (winner) return;
    for (let r = 5; r >= 0; r--) {
      if (!board[r][col]) {
        const next = board.map((row) => [...row]);
        next[r][col] = turn;
        setBoard(next);
        playBeep(turn === 'red' ? 600 : 700, 'sine', 0.08);
        checkWin(next, r, col, turn);
        setTurn(turn === 'red' ? 'yellow' : 'red');
        break;
      }
    }
  };

  const checkWin = (b, r, c, player) => {
    // Basic 4 in a row check (horizontal)
    let count = 0;
    for (let col = 0; col < 7; col++) {
      if (b[r][col] === player) count++;
      else count = 0;
      if (count >= 4) {
        setWinner(player);
        return;
      }
    }
  };

  const reset = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setTurn('red');
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 max-w-sm mx-auto">
      <div className="w-full flex justify-between items-center mb-3">
        <span className="font-bold text-sm text-indigo-400">Connect 4 In-A-Row</span>
        <button onClick={reset} className="text-xs px-2.5 py-1 bg-slate-800 rounded">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 p-3 bg-blue-900 rounded-xl border border-blue-700 shadow-xl">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => dropPiece(c)}
              className={`w-8 h-8 rounded-full border border-blue-950 transition cursor-pointer flex items-center justify-center ${
                cell === 'red'
                  ? 'bg-red-500 shadow-inner'
                  : cell === 'yellow'
                  ? 'bg-amber-400 shadow-inner'
                  : 'bg-slate-950/80 hover:bg-slate-800'
              }`}
            />
          ))
        )}
      </div>

      {winner && (
        <p className="mt-3 font-bold text-xs text-amber-300">
          Player {winner.toUpperCase()} Wins 4-in-a-row!
        </p>
      )}
    </div>
  );
}
