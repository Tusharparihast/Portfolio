import { useEffect, useRef, useState } from "react";

const GREETINGS = [
  { text: "नमस्ते ",    lang: "Nepali"   },
  { text: "Hello",     lang: "English"  },
  { text: "प्रणाम ",    lang: "Maithili" },
  { text: "Bonjour",   lang: "French"   },
  { text: "こんにちは",  lang: "Japanese" },
];

const GREET_DURATION  = 680;
const GREET_FADE      = 200;
const INK_START_AT    = GREETINGS.length * (GREET_DURATION + GREET_FADE) + 300;
const INK_FLOOD_DUR   = 900;
const INK_HOLD        = 250;
const INK_CLEAR_DUR   = 750; 

const NOTIFY_AT       = INK_START_AT + INK_FLOOD_DUR + INK_HOLD;
const DONE_AT         = NOTIFY_AT + INK_CLEAR_DUR;

export default function CatSplash({ onDone }) {
  const [greetIndex, setGreetIndex]     = useState(0);
  const [greetOpacity, setGreetOpacity] = useState(1);
  const [inkPhase, setInkPhase]         = useState("idle");
  const [prayPhase, setPrayPhase]       = useState("praying"); // ── NEW: pray phase tracking ──
  const [done, setDone]                 = useState(false);

  const canvasRef = useRef(null);
  const catRef    = useRef(null);
  const timers    = useRef([]);
  const animRef   = useRef(null);

  const blobsRef  = useRef(null);
  const dripsRef  = useRef(null);
  const originRef = useRef({ cx: 0, cy: 0 });

  const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    if (inkPhase !== "flood") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;

    let cx = W / 2, cy = H / 2;
    if (catRef.current) {
      const box = catRef.current.getBoundingClientRect();
      cx = box.left + box.width  / 2;
      cy = box.top  + box.height / 2 - 10;
    }
    originRef.current = { cx, cy };

    const NUM_BLOBS = 24;
    blobsRef.current = Array.from({ length: NUM_BLOBS }, (_, i) => {
      const angle = (i / NUM_BLOBS) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      return {
        x:      cx + (Math.random() - 0.5) * 40,
        y:      cy + (Math.random() - 0.5) * 40,
        r:      18  + Math.random() * 28,
        vx:     Math.cos(angle) * (0.8 + Math.random() * 0.5),
        vy:     Math.sin(angle) * (0.8 + Math.random() * 0.5),
        growth: 4.5 + Math.random() * 3.5,
        maxR:   Math.max(W, H) * (1.1 + Math.random() * 0.4),
      };
    });

    const NUM_DRIPS = 12;
    dripsRef.current = Array.from({ length: NUM_DRIPS }, () => ({
      x:      cx + (Math.random() - 0.5) * 140,
      y:      cy + 30  + Math.random() * 30,
      w:      4   + Math.random() * 8,
      speed:  3.5 + Math.random() * 4,
      len:    0,
      maxLen: H   * (0.5 + Math.random() * 0.5),
    }));
  }, [inkPhase]);

  useEffect(() => {
    if (inkPhase === "idle" || inkPhase === "done") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W   = canvas.width;
    const H   = canvas.height;

    let startTime = null;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      ctx.clearRect(0, 0, W, H);

      if (inkPhase === "flood") {
        const prog = Math.min(elapsed / INK_FLOOD_DUR, 1);
        const blobs = blobsRef.current || [];
        const drips = dripsRef.current || [];

        drips.forEach((d) => {
          d.len = Math.min(d.len + d.speed * prog * 4, d.maxLen);
          const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
          grad.addColorStop(0,   "#120e0a");
          grad.addColorStop(0.6, "rgba(18,14,10,0.85)");
          grad.addColorStop(1,   "rgba(18,14,10,0)");

          ctx.beginPath();
          ctx.moveTo(d.x - d.w / 2, d.y);
          ctx.bezierCurveTo(
            d.x - d.w / 2 + Math.sin(elapsed * 0.003 + d.x) * 4, d.y + d.len * 0.4,
            d.x + d.w / 2 + Math.sin(elapsed * 0.004 + d.x) * 4, d.y + d.len * 0.7,
            d.x + d.w / 2, d.y + d.len
          );
          ctx.bezierCurveTo(d.x + d.w / 2, d.y + d.len, d.x - d.w / 2, d.y + d.len, d.x - d.w / 2, d.y);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        blobs.forEach((b) => {
          b.x += b.vx * prog * 8;
          b.y += b.vy * prog * 7;
          b.r  = Math.min(b.r + b.growth * prog * 4.2, b.maxR);

          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0,   "#120e0a");
          g.addColorStop(0.7, "rgba(18,14,10,0.98)");
          g.addColorStop(0.9, "rgba(18,14,10,0.75)");
          g.addColorStop(1,   "rgba(18,14,10,0)");

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        });

      } else if (inkPhase === "hold") {
        ctx.fillStyle = "#120e0a";
        ctx.fillRect(0, 0, W, H);

      } else if (inkPhase === "clear") {
        const prog = Math.min(elapsed / INK_CLEAR_DUR, 1);
        ctx.fillStyle = "#120e0a";
        ctx.fillRect(0, 0, W, H);

        ctx.globalAlpha = 1 - prog;
      }

      if (inkPhase !== "done") {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [inkPhase]);

  useEffect(() => {
    GREETINGS.forEach((_, i) => {
      if (i === 0) return;
      const base = i * (GREET_DURATION + GREET_FADE);
      t(() => setGreetOpacity(0), base - GREET_FADE);
      t(() => { setGreetIndex(i); setGreetOpacity(1); }, base);
    });

    t(() => setGreetOpacity(0), INK_START_AT - GREET_FADE - 100);

    // Trigger retraction 300ms before ink starts flooding
    t(() => setPrayPhase("retracting"), INK_START_AT - 300);

    t(() => setInkPhase("flood"),  INK_START_AT);
    t(() => setInkPhase("hold"),   INK_START_AT + INK_FLOOD_DUR);
    t(() => setInkPhase("clear"),  INK_START_AT + INK_FLOOD_DUR + INK_HOLD);
    
    t(() => { if (onDone) onDone(); }, NOTIFY_AT);
    
    t(() => setInkPhase("done"),   DONE_AT - 20);
    t(() => setDone(true),         DONE_AT + 150); 

    return () => timers.current.forEach(clearTimeout);
  }, [onDone]);

  if (done) return null;

  const catFading = inkPhase !== "idle" && inkPhase !== "flood";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Inter:wght@300&display=swap');
        
        .cs2-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #ffffff; 
          background-image: 
            linear-gradient(to right, rgba(0, 52, 110, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 52, 110, 0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          opacity: ${inkPhase === "done" ? 0 : 1};
          transition: opacity 250ms cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: ${inkPhase === "clear" || inkPhase === "done" ? "none" : "auto"};
        }
        .cs2-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }
        .cs2-stage {
          position: relative;
          z-index: 2;
          width: min(300px, 68vw);
          overflow: visible;
          filter: drop-shadow(0 14px 44px rgba(0,0,0,0.06));
          opacity: ${catFading ? 0 : 1};
          transition: opacity 350ms ease-in;
        }
        
        /* ── NEW: WHOLE CAT NAMASTE BOW ── */
        .cs2-cat-bow {
          transform-origin: 110px 240px;
          animation: ${inkPhase === "idle" ? "cs2BowAction 3.2s ease-in-out infinite" : "none"};
        }
        @keyframes cs2BowAction {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(3deg); }
        }

        .cs2-eyes {
          animation: cs2Blink 3.8s step-end infinite;
          transform-origin: 110px 88px;
        }
        @keyframes cs2Blink {
          0%, 90%, 100% { transform: scaleY(1); }
          94%            { transform: scaleY(0.06); }
        }
        .cs2-tail {
          transform-origin: 155px 215px;
          animation: cs2Tail 2.2s ease-in-out infinite;
        }
        @keyframes cs2Tail {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(10deg); }
        }
        .cs2-ear-r {
          transform-origin: 152px 30px;
          animation: cs2Ear 4.2s ease-in-out infinite;
        }
        @keyframes cs2Ear {
          0%, 80%, 100% { transform: rotate(0deg); }
          88%            { transform: rotate(-8deg); }
        }
        .cs2-body {
          transform-origin: 110px 198px;
          animation: cs2Breathe 3.2s ease-in-out infinite;
        }
        @keyframes cs2Breathe {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(1.022); }
        }
        
        /* ── ARMS NAMASTE LOOP + TRANSITION MATRIX ── */
        .cs2-pray-arms {
          opacity: ${prayPhase === "praying" ? 1 : 0};
          transform: ${prayPhase === "praying" ? "scale(1) translateY(0px)" : "scale(0.85) translateY(14px)"};
          transition: opacity 300ms ease-in-out, transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cs2-pray-left {
          transform-origin: 65px 175px;
          animation: cs2PrayL 3.2s ease-in-out infinite;
        }
        .cs2-pray-right {
          transform-origin: 155px 175px;
          animation: cs2PrayR 3.2s ease-in-out infinite;
        }
        @keyframes cs2PrayL {
          0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
          50%       { transform: rotate(2deg) translate(1px, -2px); }
        }
        @keyframes cs2PrayR {
          0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
          50%       { transform: rotate(-2deg) translate(-1px, -2px); }
        }

        .cs2-shadow {
          transform-origin: 110px 254px;
          animation: cs2Shadow 3.2s ease-in-out infinite;
        }
        @keyframes cs2Shadow {
          0%, 100% { transform: scaleX(1);    opacity: 0.08; }
          50%       { transform: scaleX(0.80); opacity: 0.04; }
        }
        .cs2-greet {
          opacity: ${greetOpacity};
          transition: opacity ${GREET_FADE}ms ease;
        }
        .cs2-blush {
          animation: cs2Blush 2.6s ease-in-out infinite;
        }
        @keyframes cs2Blush {
          0%, 100% { opacity: 0.20; }
          50%       { opacity: 0.35; }
        }
      `}</style>
      <div className="cs2-root">
        <canvas className="cs2-canvas" ref={canvasRef} />
        <svg ref={catRef} className="cs2-stage" viewBox="0 0 220 270" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="bodyClip2">
              <ellipse cx="110" cy="198" rx="54" ry="44" />
            </clipPath>
          </defs>
          <ellipse className="cs2-shadow" cx="110" cy="254" rx="50" ry="7" fill="#111622" />
          
          {/* Entire Cat Wrapper for the Bowing/Tilt action */}
          <g className="cs2-cat-bow">
            <g className="cs2-tail">
              <path d="M155,218 Q192,208 196,184 Q200,158 180,146 Q168,138 158,145"
                stroke="#111622" strokeWidth="15" strokeLinecap="round" fill="none" />
              <circle cx="158" cy="145" r="9" fill="#1a202c" />
            </g>
            
            {/* 1. Torso Layer */}
            <g className="cs2-body">
              <ellipse cx="110" cy="198" rx="54" ry="44" fill="#111622" />
              <ellipse cx="110" cy="196" rx="30" ry="28" fill="#1a202c" />
              <g clipPath="url(#bodyClip2)" className="cs2-greet">
                <text x="110" y="195" fontFamily="'Cormorant Garamond', serif" fontWeight="300"
                  fontSize="19" fill="#ffffff" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.04">
                  {GREETINGS[greetIndex].text}
                </text>
                <text x="110" y="212" fontFamily="'Inter', sans-serif" fontWeight="300"
                  fontSize="7" fill="#ffffff" textAnchor="middle" dominantBaseline="middle"
                  letterSpacing="0.2" opacity="0.55">
                  {GREETINGS[greetIndex].lang.toUpperCase()}
                </text>
              </g>
              <ellipse cx="86"  cy="233" rx="16" ry="10" fill="#111622" />
              <ellipse cx="134" cy="233" rx="16" ry="10" fill="#111622" />
              <line x1="80"  y1="229" x2="80"  y2="238" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="86"  y1="228" x2="86"  y2="239" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="92"  y1="229" x2="92"  y2="238" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="128" y1="229" x2="128" y2="238" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="134" y1="228" x2="134" y2="239" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="140" y1="229" x2="140" y2="238" stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
            </g>

            {/* 2. FIXED STACK ORDER: Arms sit precisely on top of body but underneath head highlights */}
            <g className="cs2-pray-arms">
              <g className="cs2-pray-left">
                <path d="M62,185 Q98,158 106,152" stroke="#111622" strokeWidth="13" strokeLinecap="round" fill="none" />
                <circle cx="106" cy="152" r="6.5" fill="#1a202c" />
              </g>
              <g className="cs2-pray-right">
                <path d="M158,185 Q122,158 114,152" stroke="#111622" strokeWidth="13" strokeLinecap="round" fill="none" />
                <circle cx="114" cy="152" r="6.5" fill="#1a202c" />
              </g>
            </g>

            {/* 3. Head Layer */}
            <circle cx="110" cy="90" r="74" fill="#111622" />
            <path d="M52,44 Q38,6 68,22 Q72,26 66,38 Z" fill="#111622" />
            <path d="M55,40 Q44,12 65,24 Q68,28 64,37 Z" fill="#3a2232" />
            <g className="cs2-ear-r">
              <path d="M168,44 Q182,6 152,22 Q148,26 154,38 Z" fill="#111622" />
              <path d="M165,40 Q176,12 155,24 Q152,28 156,37 Z" fill="#3a2232" />
            </g>
            <ellipse className="cs2-blush" cx="64"  cy="110" rx="18" ry="11" fill="#e53e3e" />
            <ellipse className="cs2-blush" cx="156" cy="110" rx="18" ry="11" fill="#e53e3e" />
            <g className="cs2-eyes">
              <ellipse cx="87"  cy="88" rx="16" ry="18" fill="#f7fafc" />
              <ellipse cx="87"  cy="90" rx="9"  ry="14" fill="#111622" />
              <circle  cx="91"  cy="82" r="4.5" fill="white" />
              <circle  cx="83"  cy="94" r="2"   fill="white" opacity="0.55" />
              <ellipse cx="133" cy="88" rx="16" ry="18" fill="#f7fafc" />
              <ellipse cx="133" cy="90" rx="9"  ry="14" fill="#111622" />
              <circle  cx="137" cy="82" r="4.5" fill="white" />
              <circle  cx="129" cy="94" r="2"   fill="white" opacity="0.55" />
            </g>
            <path d="M107,114 Q110,110 113,114 Q117,118 110,124 Q103,118 107,114 Z" fill="#f687b3" />
            <path d="M102,124 Q106,130 110,126 Q114,130 118,124"            stroke="#f687b3" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="38"  y1="112" x2="92"  y2="117" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="34"  y1="121" x2="92"  y2="121" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="38"  y1="130" x2="92"  y2="125" stroke="#ffffff" strokeWidth="0.9" opacity="0.18" />
            <line x1="182" y1="112" x2="128" y2="117" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="186" y1="121" x2="128" y2="121" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="182" y1="130" x2="128" y2="125" stroke="#ffffff" strokeWidth="0.9" opacity="0.18" />
            <path d="M103,20 Q107,11 110,18" stroke="#1a202c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M110,18 Q113,9  117,18" stroke="#1a202c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </>
  );
}