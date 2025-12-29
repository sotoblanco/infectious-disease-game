import React, { useRef, useEffect, useState } from 'react';
import { SimulationConfig } from '../types';
import { BrainCircuit } from 'lucide-react';

interface Props {
  config: SimulationConfig;
  aiReasoning?: string;
  onGameEnd: (results: { remainingBacteria: number; remainingAmmo: number; kidneyDamage: number }) => void;
  onUpdateStats: (bpDrop: number, kidneyHit: number) => void;
}

export const ShooterGame: React.FC<Props> = ({ config, aiReasoning, onGameEnd, onUpdateStats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State Refs
  const gameState = useRef({
    bullets: [] as { x: number; y: number; vx: number; vy: number; active: boolean }[],
    bacteria: [] as { x: number; y: number; r: number; active: boolean; hp: number; wobble: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    ammo: config.ammoCount,
    lastTime: 0,
    mouseAngle: -Math.PI / 2,
    gameOver: false,
    kidneyDamageAccumulated: 0
  });

  const [ammoDisplay, setAmmoDisplay] = useState(config.ammoCount);

  // Initialize Game
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = 600; // Fixed height
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Create bacteria grid
    const cols = 8;
    const padding = 40;
    const spacing = (width - padding * 2) / (cols - 1);
    
    const newBacteria = [];
    for (let i = 0; i < config.bacteriaCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const xOffset = row % 2 === 0 ? 0 : spacing / 2;
      
      newBacteria.push({
        x: padding + col * spacing + xOffset,
        y: 50 + row * 45,
        r: 18,
        active: true,
        hp: config.isCorrectDrug ? 1 : 4,
        wobble: Math.random() * Math.PI * 2
      });
    }
    
    // Reset State
    gameState.current.bacteria = newBacteria;
    gameState.current.ammo = config.ammoCount;
    gameState.current.gameOver = false;
    gameState.current.kidneyDamageAccumulated = 0;
    gameState.current.bullets = [];
    gameState.current.particles = [];
    gameState.current.lastTime = 0;
    
    setAmmoDisplay(config.ammoCount);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const sx = canvasRef.current.width / 2;
      const sy = canvasRef.current.height;
      gameState.current.mouseAngle = Math.atan2(my - sy, mx - sx);
    };

    const handleClick = () => {
      if (gameState.current.gameOver || gameState.current.ammo <= 0) return;
      
      const angle = gameState.current.mouseAngle;
      const speed = 15;
      
      gameState.current.bullets.push({
        x: canvasRef.current!.width / 2,
        y: canvasRef.current!.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        active: true
      });
      
      gameState.current.ammo--;
      setAmmoDisplay(gameState.current.ammo);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animationId: number;
    
    const gameLoop = (timestamp: number) => {
      if (!gameState.current.lastTime) gameState.current.lastTime = timestamp;
      const dt = (timestamp - gameState.current.lastTime) / 1000;
      gameState.current.lastTime = timestamp;

      // Robust check: Canvas must exist, Game must not be over
      if (canvasRef.current && !gameState.current.gameOver) {
         update(dt);
         draw();
         
         // Only request next frame if game is still running after update
         if (!gameState.current.gameOver) {
            animationId = requestAnimationFrame(gameLoop);
         }
      }
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [config]);

  const update = (dt: number) => {
    const state = gameState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update Bullets
    state.bullets.forEach(b => {
      if (!b.active) return;
      b.x += b.vx;
      b.y += b.vy;

      if (b.x <= 0 || b.x >= canvas.width) b.vx *= -1;
      
      // Top collision (Missed)
      if (b.y < 0) {
        b.active = false;
        const damage = config.toxicityPerShot * 0.5; 
        state.kidneyDamageAccumulated += damage;
        onUpdateStats(0, damage);
      }
      // Bottom collision (Backwards shot)
      else if (b.y > canvas.height) {
        b.active = false;
        const damage = config.toxicityPerShot * 0.5;
        state.kidneyDamageAccumulated += damage;
      }
    });

    // Update Bacteria
    let activeBacteriaCount = 0;
    
    state.bacteria.forEach(b => {
      if (!b.active) return;
      activeBacteriaCount++;
      
      b.wobble += dt * 3;
      
      // MOVEMENT LOGIC: Only move if speed > 0
      if (config.bacteriaSpeed > 0) {
        b.y += config.bacteriaSpeed * dt * 5;
      }

      state.bullets.forEach(bullet => {
        if (!bullet.active) return;
        
        const dx = b.x - bullet.x;
        const dy = b.y - bullet.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < b.r + 5) { 
          bullet.active = false;
          b.hp--;
          
          for(let i=0; i<5; i++) {
            state.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 1.0,
              color: config.bacteriaColor
            });
          }

          if (b.hp <= 0) {
            b.active = false;
          }
        }
      });
    });

    // Update Particles
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt * 2;
    });
    state.particles = state.particles.filter(p => p.life > 0);

    // End Conditions
    if (activeBacteriaCount === 0) {
      endGame(0, state.ammo);
    } else if (state.ammo <= 0 && state.bullets.filter(b => b.active).length === 0) {
      endGame(activeBacteriaCount, 0);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = gameState.current;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Kidney Zone
    const gradient = ctx.createLinearGradient(0, 0, 0, 20);
    gradient.addColorStop(0, '#7f1d1d');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0, canvas.width, 30);

    // Bacteria
    state.bacteria.forEach(b => {
      if (!b.active) return;
      
      const wobbleX = Math.cos(b.wobble) * 2;
      const wobbleY = Math.sin(b.wobble) * 2;

      ctx.beginPath();
      ctx.arc(b.x + wobbleX, b.y + wobbleY, b.r, 0, Math.PI * 2);
      ctx.fillStyle = config.bacteriaColor;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(b.x + wobbleX - 5, b.y + wobbleY - 5, b.r/3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      if (b.hp > 1) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Bullets
    ctx.fillStyle = '#ffffff';
    state.bullets.forEach(b => {
      if (!b.active) return;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Particles
    state.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Shooter
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height);
    const angle = isNaN(state.mouseAngle) ? -Math.PI/2 : state.mouseAngle;
    ctx.rotate(angle + Math.PI/2);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-10, -50, 20, 50);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-2, -70, 4, 20);
    ctx.restore();
  };

  const endGame = (remainingBacteria: number, remainingAmmo: number) => {
    if (gameState.current.gameOver) return;
    gameState.current.gameOver = true;
    
    // Defer the callback to prevent race conditions with component unmounting
    setTimeout(() => {
      onGameEnd({
        remainingBacteria,
        remainingAmmo,
        kidneyDamage: gameState.current.kidneyDamageAccumulated
      });
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto">
        <div ref={containerRef} className="relative w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 cursor-crosshair">
        <div className="absolute top-4 right-4 bg-black/50 p-2 rounded text-white font-mono pointer-events-none select-none z-10">
            AMMO: {ammoDisplay}
        </div>
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-red-300 font-mono text-xs pointer-events-none select-none z-10">
            DON'T MISS!<br/>KIDNEY DAMAGE RISK
        </div>
        
        {/* In-Game Reasoning Overlay */}
        {aiReasoning && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 border-t border-purple-500/50 z-10 flex items-start gap-3">
                <BrainCircuit className="text-purple-400 shrink-0 mt-1" size={20} />
                <div className="text-xs md:text-sm">
                    <span className="text-purple-400 font-bold uppercase block mb-1">Clinical Simulation Adjustments:</span>
                    <p className="text-slate-200 leading-tight opacity-90">{aiReasoning}</p>
                </div>
            </div>
        )}

        <canvas ref={canvasRef} />
        </div>
    </div>
  );
};