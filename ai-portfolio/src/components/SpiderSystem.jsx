import { useEffect, useState, useRef, useCallback } from 'react';

const ICON_KEYS = ['python', 'pytorch', 'opencv', 'postgresql', 'git'];

// ─── SPIDER VISUAL ASSET ─────────────────────────────────────────────────────
function Spider({ eyeBlink, legPhase }) {
  const R = 14;
  const eyeOpen = !eyeBlink;

  const legs = [
    // LEFT side
    { sx: -R * 0.7, sy: -6,  ex: -38, ey: -22, mx: -26, my: -32 },
    { sx: -R * 0.8, sy: 0,   ex: -42, ey: -6,  mx: -30, my: -16 },
    { sx: -R * 0.8, sy: 6,   ex: -40, ey: 14,  mx: -28, my: 4   },
    { sx: -R * 0.6, sy: 12,  ex: -34, ey: 28,  mx: -22, my: 20  },
    // RIGHT side
    { sx:  R * 0.7, sy: -6,  ex:  38, ey: -22, mx:  26, my: -32 },
    { sx:  R * 0.8, sy: 0,   ex:  42, ey: -6,  mx:  30, my: -16 },
    { sx:  R * 0.8, sy: 6,   ex:  40, ey: 14,  mx:  28, my: 4   },
    { sx:  R * 0.6, sy: 12,  ex:  34, ey: 28,  mx:  22, my: 20  },
  ];

  const legWave = (i) => {
    const offset = (i % 4) * (Math.PI / 2);
    return Math.sin(legPhase + offset) * 5;
  };

  return (
    <svg width="90" height="90" viewBox="-45 -45 90 90" style={{ overflow: 'visible' }}>
      {/* Shadow */}
      <ellipse cx="0" cy="22" rx="18" ry="5" fill="rgba(0,0,0,0.10)" />

      {/* Legs */}
      {legs.map((leg, i) => {
        const wave = legWave(i);
        const side = i < 4 ? -1 : 1;
        return (
          <path
            key={i}
            d={`M ${leg.sx} ${leg.sy} Q ${leg.mx + wave * side} ${leg.my + wave * 0.5} ${leg.ex + wave * side * 0.5} ${leg.ey + wave}`}
            stroke="#2d3748"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      })}

      {/* Body Parts */}
      <ellipse cx="0" cy="10" rx="11" ry="13" fill="#1a202c" stroke="#2d3748" strokeWidth="1" />
      <ellipse cx="-3" cy="6" rx="4" ry="5" fill="#4a5568" opacity="0.4" />
      <circle cx="0" cy="-4" r={R} fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
      <ellipse cx="-4" cy="-8" rx="6" ry="4" fill="#4a5568" opacity="0.35" />

      {/* Eyes */}
      <circle cx="-9" cy="-9" r="4.5" fill="white" />
      <circle cx="-9" cy="-9" r="3.5" fill={eyeOpen ? '#1a202c' : 'white'} style={{ transition: 'fill 0.05s' }} />
      {eyeOpen && <circle cx="-7.8" cy="-10.2" r="1.2" fill="white" />}

      <circle cx="9" cy="-9" r="4.5" fill="white" />
      <circle cx="9" cy="-9" r="3.5" fill={eyeOpen ? '#1a202c' : 'white'} style={{ transition: 'fill 0.05s' }} />
      {eyeOpen && <circle cx="10.2" cy="-10.2" r="1.2" fill="white" />}

      <circle cx="-3.5" cy="-12" r="3.5" fill="white" />
      <circle cx="-3.5" cy="-12" r="2.5" fill={eyeOpen ? '#1a202c' : 'white'} style={{ transition: 'fill 0.05s' }} />
      {eyeOpen && <circle cx="-2.6" cy="-13" r="0.9" fill="white" />}

      <circle cx="3.5" cy="-12" r="3.5" fill="white" />
      <circle cx="3.5" cy="-12" r="2.5" fill={eyeOpen ? '#1a202c' : 'white'} style={{ transition: 'fill 0.05s' }} />
      {eyeOpen && <circle cx="4.4" cy="-13" r="0.9" fill="white" />}

      {/* Markings */}
      <path d="M -4 4 Q -5 9 -3 10" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M  4 4 Q  5 9  3 10" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M -3 5 L 3 5 L 1 9 L 3 13 L -3 13 L -1 9 Z" fill="#e53e3e" opacity="0.7" />
    </svg>
  );
}

// ─── PROCEDURAL SPIDER WEB ───────────────────────────────────────────────────
export function SpiderWeb({ containerRef, iconRefs }) {
  const [webData, setWebData] = useState(null);

  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();

      const points = ICON_KEYS.map((key) => {
        const el = iconRefs.current[key];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height / 2,
        };
      }).filter(Boolean);

      if (points.length < 3) return;

      const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
      const cy = points.reduce((s, p) => s + p.y, 0) / points.length;

      const sorted = [...points].sort((a, b) => {
        return Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx);
      });

      const RINGS = 6;
      const spokes = sorted.map((p) => `M ${cx} ${cy} L ${p.x} ${p.y}`);
      const rings = [];

      for (let r = 1; r <= RINGS; r++) {
        const t = r / RINGS;
        const ringPts = sorted.map((p) => ({
          x: cx + (p.x - cx) * t,
          y: cy + (p.y - cy) * t,
        }));

        let d = '';
        const n = ringPts.length;
        for (let i = 0; i < n; i++) {
          const A = ringPts[i];
          const B = ringPts[(i + 1) % n];
          if (i === 0) d += `M ${A.x} ${A.y} `;

          const mx = (A.x + B.x) / 2;
          const my = (A.y + B.y) / 2;
          const mdx = mx - cx;
          const mdy = my - cy;
          const mLen = Math.hypot(mdx, mdy) || 1;
          const push = t * 18; 
          const cpx = mx + (mdx / mLen) * push;
          const cpy = my + (mdy / mLen) * push;

          d += `Q ${cpx} ${cpy} ${B.x} ${B.y} `;
        }
        d += 'Z';
        rings.push(d);
      }

      setWebData({ spokes, rings, cx, cy });
    };

    const t = setTimeout(compute, 700);
    window.addEventListener('resize', compute);
    return () => { clearTimeout(t); window.removeEventListener('resize', compute); };
  }, [containerRef, iconRefs]);

  if (!webData) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="webGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {webData.spokes.map((d, i) => (
        <path key={`spoke-${i}`} d={d} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.0" fill="none" filter="url(#webGlow)" />
      ))}
      {webData.rings.map((d, i) => {
        const t = (i + 1) / webData.rings.length;
        return (
          <path key={`ring-${i}`} d={d} stroke={`rgba(148, 163, 184, ${0.2 + t * 0.25})`} strokeWidth={0.7 + t * 0.5} fill="none" filter="url(#webGlow)" />
        );
      })}
      <circle cx={webData.cx} cy={webData.cy} r="2.5" fill="rgba(148,163,184,0.5)" />
    </svg>
  );
}

// ─── CRAWLING CONTROLLER ─────────────────────────────────────────────────────
export function CrawlingSpider({ containerRef, iconRefs }) {
  const [pos, setPos] = useState({ x: 0, y: 0, angle: 0 });
  const [eyeBlink, setEyeBlink] = useState(false);
  const [legPhase, setLegPhase] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);

  const animRef = useRef(null);
  const legRef = useRef(null);
  const blinkRef = useRef(null);
  const currentIdxRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });
  const moveTimeoutRef = useRef(null);

  const getIconPos = useCallback((key) => {
    if (!containerRef.current || !iconRefs.current[key]) return null;
    const cRect = containerRef.current.getBoundingClientRect();
    const iRect = iconRefs.current[key].getBoundingClientRect();
    return {
      x: iRect.left - cRect.left + iRect.width / 2,
      y: iRect.top - cRect.top + iRect.height / 2,
    };
  }, [containerRef, iconRefs]);

  const pickRandomNext = useCallback(() => {
    const cur = currentIdxRef.current;
    let next;
    do {
      next = Math.floor(Math.random() * ICON_KEYS.length);
    } while (next === cur && ICON_KEYS.length > 1);
    return next;
  }, []);

  const crawlTo = useCallback((nextIdx) => {
    const target = getIconPos(ICON_KEYS[nextIdx]);
    if (!target) {
      moveTimeoutRef.current = setTimeout(() => crawlTo(nextIdx), 500);
      return;
    }

    const startX = posRef.current.x;
    const startY = posRef.current.y;
    const dx = target.x - startX;
    const dy = target.y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const duration = Math.max(2200, dist * 8.5);
    const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    setIsCrawling(true);
    let start = null;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const perpX = -dy / dist;
      const perpY =  dx / dist;
      const wobble = Math.sin(progress * Math.PI * 7) * 4;

      const newPos = {
        x: startX + dx * ease + perpX * wobble,
        y: startY + dy * ease + perpY * wobble,
        angle: targetAngle
      };
      
      posRef.current = newPos;
      setPos({ ...newPos });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        posRef.current = { x: target.x, y: target.y, angle: targetAngle };
        setPos({ x: target.x, y: target.y, angle: targetAngle });
        setIsCrawling(false);
        currentIdxRef.current = nextIdx;

        const pause = 1500 + Math.random() * 1200;
        moveTimeoutRef.current = setTimeout(() => {
          crawlTo(pickRandomNext());
        }, pause);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
  }, [getIconPos, pickRandomNext]);

  useEffect(() => {
    const t = setTimeout(() => {
      const p = getIconPos(ICON_KEYS[0]);
      if (p) {
        posRef.current = { x: p.x, y: p.y, angle: 0 };
        setPos({ x: p.x, y: p.y, angle: 0 });
        currentIdxRef.current = 0;
        moveTimeoutRef.current = setTimeout(() => crawlTo(pickRandomNext()), 1000);
      }
    }, 900);
    return () => {
      clearTimeout(t);
      clearTimeout(moveTimeoutRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [getIconPos, pickRandomNext, crawlTo]);

  useEffect(() => {
    legRef.current = setInterval(() => {
      if (isCrawling) setLegPhase((prev) => prev + 0.22);
    }, 30);
    return () => clearInterval(legRef.current);
  }, [isCrawling]);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      blinkRef.current = setTimeout(() => {
        setEyeBlink(true);
        setTimeout(() => { setEyeBlink(false); scheduleBlink(); }, 120);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(blinkRef.current);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) rotate(${pos.angle}deg)`,
        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))',
        willChange: 'left, top, transform',
      }}
    >
      <Spider eyeBlink={eyeBlink} legPhase={legPhase} />
    </div>
  );
}