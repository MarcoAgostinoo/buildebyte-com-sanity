"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// Tipagens
interface Projectile {
  id: number;
  angle: number;
  type: "cannon" | "mg";
  dist: number;      // Distância exata até o alvo
  duration: number;  // Tempo de voo dinâmico baseado na distância
}

interface Particle { 
  id: number; 
  type: "smoke" | "casing" | "mg-casing"; 
  angle?: number; 
}

interface Impact { 
  id: number; 
  x: number; 
  y: number; 
  type: "cannon" | "mg"; 
}

export default function InteractiveTank() {
  const [mounted, setMounted] = useState(false);
  const turretRef = useRef<HTMLDivElement>(null);
  
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0); 
  
  // Guardamos a posição exata do centro da torreta no documento
  const turretCenterRef = useRef({ x: 0, y: 0 });
  // Guardamos a posição exata do mouse
  const mousePosRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  const [isShootingCannon, setIsShootingCannon] = useState(false);
  const[isShootingMG, setIsShootingMG] = useState(false);
  const mgIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const[impacts, setImpacts] = useState<Impact[]>([]); 

  // Evita erros de hidratação do Portal no Next.js
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true),[]);

  // 1. Rastreador e sincronizador de coordenadas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!turretRef.current) return;

      // Otimização: Usa requestAnimationFrame para não bloquear a thread principal
      if (requestRef.current) return;

      requestRef.current = requestAnimationFrame(() => {
        if (!turretRef.current) return;
        const rect = turretRef.current.getBoundingClientRect();
        
        // Encontra o centro do tanque no eixo X e Y globais (considerando o scroll da página)
        const docCenterX = rect.left + window.scrollX + rect.width / 2;
        const docCenterY = rect.top + window.scrollY + rect.height / 2;
        turretCenterRef.current = { x: docCenterX, y: docCenterY };

        const deltaX = e.pageX - docCenterX;
        const deltaY = e.pageY - docCenterY;

        const theta = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setAngle(theta);
        angleRef.current = theta; 
        
        mousePosRef.current = { x: e.pageX, y: e.pageY };
        requestRef.current = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  },[]);

  // 2. Canhão: Colisão perfeita e limpeza da memória após 4s
  const fireCannon = useCallback(() => {
    if (isShootingCannon) return;

    const fireId = Date.now() + Math.random();
    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;

    // Calcula a distância total do tiro
    const deltaX = targetX - turretCenterRef.current.x;
    const deltaY = targetY - turretCenterRef.current.y;
    const dist = Math.max(50, Math.hypot(deltaX, deltaY)); 
    
    // Velocidade do canhão: ~2500 pixels por segundo
    const duration = Math.max(0.1, dist / 2500);

    setIsShootingCannon(true);
    setProjectiles(prev =>[...prev, { id: fireId, angle: angleRef.current, type: "cannon", dist, duration }]);
    
    setParticles(prev =>[
      ...prev,
      { id: fireId + 1, type: "smoke" },
      { id: fireId + 2, type: "casing", angle: angleRef.current }
    ]);

    setTimeout(() => setIsShootingCannon(false), 150);

    const impactTime = duration * 1000;

    // CRATERA: Aparece EXATAMENTE quando o tiro colide
    setTimeout(() => {
      setImpacts(prev =>[...prev.slice(-30), { id: fireId, x: targetX, y: targetY, type: "cannon" }]);
      
      // FADE-OUT & CLEANUP: Remove a cratera da memória após 4 segundos
      setTimeout(() => {
        setImpacts(prev => prev.filter(impact => impact.id !== fireId));
      }, 4000);

    }, impactTime);

    // Limpa a bala e fumaça do ar após o impacto
    setTimeout(() => {
      setProjectiles(prev => prev.filter(p => p.id !== fireId));
      setParticles(prev => prev.filter(p => p.id !== fireId + 1 && p.id !== fireId + 2));
    }, impactTime + 1000); 
  }, [isShootingCannon]);

  // 3. Metralhadora: Dispersão sincronizada e limpeza da memória
  const startMG = useCallback(() => {
    if (mgIntervalRef.current) return;
    setIsShootingMG(true);

    const fireMGBullet = () => {
      const fireId = Date.now() + Math.random();
      
      // Cria a "imprecisão" da arma
      const targetX = mousePosRef.current.x + (Math.random() - 0.5) * 80;
      const targetY = mousePosRef.current.y + (Math.random() - 0.5) * 80;

      // Recalcula o ângulo para o ponto disperso
      const deltaX = targetX - turretCenterRef.current.x;
      const deltaY = targetY - turretCenterRef.current.y;
      const specificAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const dist = Math.max(40, Math.hypot(deltaX, deltaY));

      // MG atira balas mais rápidas: ~3500 pixels por segundo
      const duration = Math.max(0.05, dist / 3500);

      setProjectiles(prev =>[...prev, { id: fireId, angle: specificAngle, type: "mg", dist, duration }]);
      setParticles(prev => [...prev, { id: fireId, type: "mg-casing" }]);
      
      const impactTime = duration * 1000;

      // Buraco de bala da MG aparece no impacto
      setTimeout(() => {
        setImpacts(prev =>[...prev.slice(-100), { id: fireId, x: targetX, y: targetY, type: "mg" }]);
        
        // FADE-OUT & CLEANUP: Remove os buraquinhos de bala após 4 segundos
        setTimeout(() => {
           setImpacts(prev => prev.filter(impact => impact.id !== fireId));
        }, 4000);

      }, impactTime);

      setTimeout(() => {
        setProjectiles(prev => prev.filter(p => p.id !== fireId));
        setParticles(prev => prev.filter(p => p.id !== fireId));
      }, impactTime + 500);
    };

    fireMGBullet(); 
    mgIntervalRef.current = setInterval(fireMGBullet, 80); 
  },[]);

  const stopMG = useCallback(() => {
    setIsShootingMG(false);
    if (mgIntervalRef.current) {
      clearInterval(mgIntervalRef.current);
      mgIntervalRef.current = null;
    }
  },[]);

  // 4. Inputs
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) fireCannon();
      if (e.button === 2) startMG();
    };
    const handleMouseUp = (e: MouseEvent) => { 
      if (e.button === 2) stopMG(); 
    };
    const handleContextMenu = (e: MouseEvent) => { 
      e.preventDefault(); 
      stopMG(); 
    };
    
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      stopMG();
    };
  },[fireCannon, startMG, stopMG]);

  return (
    <>
      <div className="relative w-36 h-40 flex items-center justify-center drop-shadow-2xl select-none overflow-visible z-10">
        
        {/* ESTEIRAS */}
        <div className={`absolute left-1 top-0 w-7 h-40 rounded-md border border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] transition-transform duration-75 ${isShootingCannon ? "-translate-y-1" : ""}`} style={{ background: 'repeating-linear-gradient(0deg, #1c1917, #1c1917 4px, #0c0a09 4px, #0c0a09 8px)' }}></div>
        <div className={`absolute right-1 top-0 w-7 h-40 rounded-md border border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] transition-transform duration-75 ${isShootingCannon ? "translate-y-1" : ""}`} style={{ background: 'repeating-linear-gradient(0deg, #1c1917, #1c1917 4px, #0c0a09 4px, #0c0a09 8px)' }}></div>
        
        {/* CHASSI */}
        <div className="absolute w-20 h-28 bg-[#3a4032] border-2 border-[#22261d] rounded-sm shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] flex flex-col items-center">
          <div className="w-full h-8 border-b-2 border-black/40 shadow-inner rounded-t-sm flex items-start justify-center pt-1 relative">
             <div className="absolute left-1 top-1 w-1.5 h-1.5 rounded-full bg-yellow-200/50 shadow-[0_0_5px_#fef08a]"></div><div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-yellow-200/50 shadow-[0_0_5px_#fef08a]"></div><div className="w-10 h-4 bg-[#2f3329] rounded-b-sm border-x border-b border-black/30"></div>
          </div>
          <div className="absolute bottom-1 w-12 h-6 flex flex-col justify-evenly bg-black/80 rounded-sm p-1 border border-white/5">
            <div className="w-full h-0.5 bg-zinc-700/50"></div><div className="w-full h-0.5 bg-zinc-700/50"></div><div className="w-full h-0.5 bg-zinc-700/50"></div><div className="w-full h-0.5 bg-zinc-700/50"></div>
          </div>
        </div>

        {/* TORRETA */}
        <div ref={turretRef} className="absolute flex items-center justify-center z-20 w-16 h-16 origin-center" style={{ transform: `rotate(${angle}deg)` }}>
          
          {/* Canhão Principal */}
          <div className={`absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center origin-left z-10 transition-transform ${isShootingCannon ? "duration-75 -translate-x-2" : "duration-500 translate-x-0 ease-out"}`}>
            <div className="w-6 h-6 -ml-3 bg-[#2f3329] border border-[#1a1c16] rounded-sm shadow-md z-10"></div>
            <div className="w-18 h-2.5 bg-linear-to-b from-[#404040] via-[#262626] to-[#171717] border-y border-black"></div>
            <div className="w-4 h-3.5 bg-linear-to-b from-[#525252] to-[#171717] rounded-sm border border-black relative flex justify-center items-center">
               {isShootingCannon && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center pointer-events-none origin-left">
                    <div className="absolute w-12 h-12 bg-white blur-[2px] rounded-full mix-blend-overlay animate-tank-flash z-30"></div><div className="absolute w-16 h-16 -left-4 bg-linear-to-r from-yellow-300 to-orange-600 rounded-full blur-md mix-blend-screen animate-tank-fireball z-20"></div><div className="absolute w-8 h-16 border-r-4 border-white rounded-[50%] opacity-50 animate-tank-shockwave z-40"></div>
                  </div>
               )}
               {particles.filter(p => p.type === "smoke").map(p => (<div key={p.id} className="absolute left-full w-6 h-6 bg-stone-500/30 rounded-full blur-xl animate-tank-smoke pointer-events-none"></div>))}
            </div>
          </div>

          {/* Metralhadora .50 cal */}
          <div className="absolute top-4 left-[35px] flex items-center origin-left z-30">
             <div className={`flex items-center transition-transform ${isShootingMG ? "-translate-x-1" : ""}`}>
               <div className="w-5 h-2 bg-[#1f221c] border border-black rounded-sm shadow-md"></div>
               <div className="w-7 h-0.5 bg-zinc-800 border-y border-black relative">
                   {isShootingMG && (<div className="absolute left-full top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"><div className="w-full h-full bg-yellow-200 rounded-full blur-[1px] animate-mg-flash mix-blend-screen"></div></div>)}
               </div>
             </div>
          </div>
          
          <div className={`absolute w-16 h-16 bg-[#4a523e] border border-black rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.6),0_10px_15px_-3px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform z-20 ${isShootingCannon ? "duration-75 -translate-x-1" : "duration-300 ease-out"}`}>
            <div className="relative w-7 h-7 bg-[#2f3329] border-2 border-black rounded-full flex items-center justify-center shadow-inner"><div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div></div>
            {particles.filter(p => p.type === "casing").map(p => (<div key={p.id} className="absolute top-2 left-1/2 w-4 h-1.5 bg-yellow-600 rounded-sm border border-yellow-800 animate-shell-eject pointer-events-none"></div>))}
            {particles.filter(p => p.type === "mg-casing").map(p => (<div key={p.id} className="absolute top-2.5 left-[45px] w-1.5 h-0.5 bg-yellow-400 rounded-sm animate-mg-shell-eject pointer-events-none"></div>))}
          </div>
        </div>

        {/* --- PROJÉTEIS (Com distância exata e animação injetada) --- */}
        {projectiles.map(proj => (
          <div key={proj.id} className="absolute z-50 pointer-events-none top-1/2 left-1/2 origin-left" style={{ transform: `rotate(${proj.angle}deg)` }}>
            {proj.type === "cannon" ? (
               <div 
                 className="flex items-center absolute -mt-0.5 -ml-0.5" 
                 style={{ 
                   animation: `precise-strike-cannon ${proj.duration}s linear forwards`,
                   "--target-dist": `${proj.dist}px` 
                 } as React.CSSProperties}
               >
                 <div className="w-16 h-1 bg-linear-to-r from-transparent via-orange-400 to-yellow-100 shadow-[0_0_15px_#fcd34d] rounded-full"></div>
                 <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
               </div>
            ) : (
               <div 
                 className="flex items-center absolute" 
                 style={{ 
                   top: '-16px', left: '0px',
                   animation: `precise-strike-mg ${proj.duration}s linear forwards`,
                   "--target-dist": `${proj.dist}px`
                 } as React.CSSProperties}
               >
                 <div className="w-10 h-0.5 bg-linear-to-r from-transparent via-yellow-400 to-white shadow-[0_0_6px_#facc15] rounded-full"></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* --- RENDERIZAÇÃO DA DESTRUIÇÃO NA TELA --- */}
      {mounted && createPortal(
        <div className="absolute top-0 left-0 w-full pointer-events-none z-[9999]">
          {impacts.map((impact) => (
            <div 
              key={impact.id} 
              // A classe animate-impact-fade-away faz o buraco sumir suavemente
              className="absolute pointer-events-none animate-impact-fade-away" 
              style={{ left: impact.x, top: impact.y }}
            >
              {impact.type === "cannon" ? (
                <>
                  <div className="absolute w-16 h-16 -ml-8 -mt-8 bg-zinc-950 rounded-full shadow-[inset_0_0_20px_black,0_0_8px_rgba(0,0,0,0.8)]"></div>
                  <div className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-[3px] border-orange-500 mix-blend-screen animate-crater-glow"></div>
                  <div className="absolute w-4 h-4 -ml-2 -mt-2 bg-white rounded-full shadow-[0_0_50px_20px_#fcd34d] animate-impact-flash mix-blend-overlay"></div>
                  <div className="absolute w-20 h-20 -ml-10 -mt-10 bg-black/40 rounded-full blur-xl animate-crater-smoke"></div>
                </>
              ) : (
                <>
                  <div className="absolute w-3 h-3 -ml-1.5 -mt-1.5 bg-black rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.3),inset_0_3px_5px_rgba(0,0,0,1)]"></div>
                  <div className="absolute w-2 h-2 -ml-1 -mt-1 bg-yellow-300 rounded-full blur-[1px] shadow-[0_0_10px_#facc15] animate-mg-impact-flash mix-blend-screen"></div>
                </>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}