import { useEffect, useRef, useState } from "react";

const GREETINGS = [
  { text: "नमस्ते",    lang: "Nepali"   },
  { text: "प्रणाम",    lang: "Maithili" },
  { text: "Hello",     lang: "English"  },
  { text: "Bonjour",   lang: "French"   },
  { text: "こんにちは",  lang: "Japanese" },
];

const GREET_DURATION = 680;
const GREET_FADE     = 200;
const INK_START_AT   = GREETINGS.length * (GREET_DURATION + GREET_FADE) + 300;
const INK_FLOOD_DUR  = 900;
const INK_HOLD       = 280;
const INK_CLEAR_DUR  = 750;

const NOTIFY_AT = INK_START_AT + INK_FLOOD_DUR + INK_HOLD;
const DONE_AT   = NOTIFY_AT + INK_CLEAR_DUR;

export default function CatSplash({ onDone }) {
  const [greetIndex, setGreetIndex]     = useState(0);
  const [greetOpacity, setGreetOpacity] = useState(1);
  const [inkPhase, setInkPhase]         = useState("idle");
  const [prayPhase, setPrayPhase]       = useState("praying");
  const [done, setDone]                 = useState(false);

  const canvasRef = useRef(null);
  const catRef    = useRef(null);
  const timers    = useRef([]);
  const animRef   = useRef(null);
  const blobsRef  = useRef(null);
  const dripsRef  = useRef(null);

  const t = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  /* ── Canvas blob/drip setup on flood ── */
  useEffect(() => {
    if (inkPhase !== "flood") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;

    let cx = W / 2, cy = H / 2;
    if (catRef.current) {
      const box = catRef.current.getBoundingClientRect();
      cx = box.left + box.width  / 2;
      cy = box.top  + box.height / 2 - 10;
    }

    blobsRef.current = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      return {
        x: cx + (Math.random()-0.5)*40, y: cy + (Math.random()-0.5)*40,
        r: 18 + Math.random()*28,
        vx: Math.cos(angle)*(0.8+Math.random()*0.5),
        vy: Math.sin(angle)*(0.8+Math.random()*0.5),
        growth: 4.5 + Math.random()*3.5,
        maxR: Math.max(W,H)*(1.1+Math.random()*0.4),
      };
    });

    dripsRef.current = Array.from({ length: 12 }, () => ({
      x: cx+(Math.random()-0.5)*180, y: cy+40+Math.random()*30,
      w: 4+Math.random()*8, speed: 3.5+Math.random()*4,
      len: 0, maxLen: H*(0.5+Math.random()*0.5),
    }));
  }, [inkPhase]);

  /* ── Canvas draw loop ── */
  useEffect(() => {
    if (inkPhase === "idle" || inkPhase === "done") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    let startTime = null;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      ctx.clearRect(0, 0, W, H);

      if (inkPhase === "flood") {
        const prog = Math.min(elapsed / INK_FLOOD_DUR, 1);

        (dripsRef.current || []).forEach(d => {
          d.len = Math.min(d.len + d.speed * prog * 4, d.maxLen);
          const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
          grad.addColorStop(0,   "#0a0a0f");
          grad.addColorStop(0.6, "rgba(10,10,15,0.88)");
          grad.addColorStop(1,   "rgba(10,10,15,0)");
          ctx.beginPath();
          ctx.moveTo(d.x - d.w/2, d.y);
          ctx.bezierCurveTo(
            d.x - d.w/2 + Math.sin(elapsed*0.003+d.x)*4, d.y+d.len*0.4,
            d.x + d.w/2 + Math.sin(elapsed*0.004+d.x)*4, d.y+d.len*0.7,
            d.x + d.w/2, d.y+d.len
          );
          ctx.bezierCurveTo(d.x+d.w/2, d.y+d.len, d.x-d.w/2, d.y+d.len, d.x-d.w/2, d.y);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        (blobsRef.current || []).forEach(b => {
          b.x += b.vx * prog * 8;
          b.y += b.vy * prog * 7;
          b.r  = Math.min(b.r + b.growth * prog * 4.2, b.maxR);
          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0,   "#0a0a0f");
          g.addColorStop(0.7, "rgba(10,10,15,0.98)");
          g.addColorStop(0.9, "rgba(10,10,15,0.75)");
          g.addColorStop(1,   "rgba(10,10,15,0)");
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
          ctx.fillStyle = g;
          ctx.fill();
        });

      } else if (inkPhase === "hold") {
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, W, H);

      } else if (inkPhase === "clear") {
        const prog = Math.min(elapsed / INK_CLEAR_DUR, 1);

        /* solid dark fill */
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, W, H);

        /* color-dodge light leak sweep */
        const leakX = -W * 0.3 + prog * W * 1.6;
        const leakGrad = ctx.createLinearGradient(leakX - 120, 0, leakX + 120, 0);
        leakGrad.addColorStop(0,   "rgba(255,255,255,0)");
        leakGrad.addColorStop(0.4, `rgba(180,160,255,${Math.sin(prog * Math.PI) * 0.22})`);
        leakGrad.addColorStop(0.5, `rgba(255,255,255,${Math.sin(prog * Math.PI) * 0.18})`);
        leakGrad.addColorStop(0.6, `rgba(100,200,255,${Math.sin(prog * Math.PI) * 0.14})`);
        leakGrad.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "color-dodge";
        ctx.fillStyle = leakGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";

        /* fade out entire canvas */
        ctx.globalAlpha = 1 - prog;
        ctx.fillStyle   = "#0a0a0f";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      if (inkPhase !== "done") {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [inkPhase]);

  /* ── Timeline ── */
  useEffect(() => {
    GREETINGS.forEach((_, i) => {
      if (i === 0) return;
      const base = i * (GREET_DURATION + GREET_FADE);
      t(() => setGreetOpacity(0), base - GREET_FADE);
      t(() => { setGreetIndex(i); setGreetOpacity(1); }, base);
    });

    t(() => setGreetOpacity(0),         INK_START_AT - GREET_FADE - 100);
    t(() => setPrayPhase("retracting"), INK_START_AT - 320);
    t(() => setInkPhase("flood"),       INK_START_AT);
    t(() => setInkPhase("hold"),        INK_START_AT + INK_FLOOD_DUR);
    t(() => setInkPhase("clear"),       INK_START_AT + INK_FLOOD_DUR + INK_HOLD);
    t(() => { if (onDone) onDone(); },  NOTIFY_AT);
    t(() => setInkPhase("done"),        DONE_AT - 20);
    t(() => setDone(true),              DONE_AT + 150);

    return () => timers.current.forEach(clearTimeout);
  }, [onDone]);

  if (done) return null;

  const catFading  = inkPhase !== "idle" && inkPhase !== "flood";
  const isGreeting = inkPhase === "idle";
  const prayVisible = prayPhase === "praying";
  const prayRetract = prayPhase === "retracting";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400&display=swap');

        .cs-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #ffffff;
          background-image:
            linear-gradient(to right, rgba(0,52,110,0.032) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,52,110,0.032) 1px, transparent 1px);
          background-size: 64px 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          opacity: ${inkPhase === "done" ? 0 : 1};
          transition: opacity 260ms cubic-bezier(0.25,1,0.5,1);
          pointer-events: ${inkPhase === "clear" || inkPhase === "done" ? "none" : "auto"};
        }

        /* ── Main Ambient Background Purple Aura (Upscaled & Adapted) ── */
        .cs-glow-back {
          position: absolute;
          width: 560px; /* Increased from 440px to match larger size */
          height: 560px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at center, 
            rgba(147, 51, 234, 0.20) 0%,   
            rgba(107, 33, 168, 0.09) 48%,  
            rgba(255, 255, 255, 0) 72%
          );
          filter: blur(24px);
          pointer-events: none;
          z-index: 1;
          animation: csBackGlowPulse 4s ease-in-out infinite;
          transition: opacity 300ms ease;
        }
        @keyframes csBackGlowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 0.85; }
        }

        /* ── Tight irregular paw-spot purple glow (Upscaled & Adapted) ── */
        .cs-glow-paw {
          position: absolute;
          width: 155px; /* Increased from 120px */
          height: 125px; /* Increased from 100px */
          top: 50%; left: 50%;
          transform: translate(-50%, -68%);
          background: radial-gradient(ellipse at 50% 60%,
            rgba(147, 51, 234, 0.75) 0%,   
            rgba(124, 58, 237, 0.45) 40%,  
            rgba(168, 85, 247, 0.18) 68%,  
            transparent 100%
          );
          filter: blur(16px);
          pointer-events: none;
          z-index: 1;
          animation: csPawGlow 2.8s ease-in-out infinite;
          border-radius: 68% 32% 55% 45% / 40% 58% 42% 60%;
          transition: opacity 240ms ease-in;
        }
        @keyframes csPawGlow {
          0%   { border-radius: 68% 32% 55% 45% / 40% 58% 42% 60%; transform: translate(-50%,-66%) scale(1)    rotate(0deg);  opacity: 0.9; }
          33%  { border-radius: 45% 55% 70% 30% / 55% 35% 65% 45%; transform: translate(-50%,-66%) scale(1.08) rotate(-6deg); opacity: 1;   }
          66%  { border-radius: 60% 40% 38% 62% / 48% 66% 34% 52%; transform: translate(-50%,-66%) scale(0.94) rotate(5deg);  opacity: 0.85;}
          100% { border-radius: 68% 32% 55% 45% / 40% 58% 42% 60%; transform: translate(-50%,-66%) scale(1)    rotate(0deg);  opacity: 0.9; }
        }

        .cs-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        /* ── Stage Size (Increased for a bigger cat display) ── */
        .cs-stage {
          position: relative;
          z-index: 2;
          width: min(375px, 82vw); /* Increased from min(300px, 68vw) */
          overflow: visible;
          opacity: ${catFading ? 0 : 1};
          transition: opacity 360ms ease-in;
        }

        /* ── Cat animations ── */
        .cs-eyes {
          animation: csBlink 3.8s step-end infinite;
          transform-origin: 110px 88px;
        }
        @keyframes csBlink {
          0%, 90%, 100% { transform: scaleY(1);    }
          94%            { transform: scaleY(0.06); }
        }

        .cs-tail {
          transform-origin: 155px 215px;
          animation: csTail 2.2s ease-in-out infinite;
        }
        @keyframes csTail {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(10deg); }
        }

        .cs-ear-r {
          transform-origin: 152px 30px;
          animation: csEar 4.2s ease-in-out infinite;
        }
        @keyframes csEar {
          0%, 80%, 100% { transform: rotate(0deg);  }
          88%            { transform: rotate(-8deg); }
        }

        .cs-body {
          transform-origin: 110px 198px;
          animation: csBreathe 3.2s ease-in-out infinite;
        }
        @keyframes csBreathe {
          0%, 100% { transform: scaleY(1);     }
          50%       { transform: scaleY(1.022); }
        }

        /* paw group pulse in sync with breathing */
        .cs-paws-group {
          transform-origin: 110px 160px;
          animation: csPawsPulse 3.2s ease-in-out infinite;
          transition: opacity 240ms ease-in;
        }
        @keyframes csPawsPulse {
          0%, 100% { transform: scale(1)    translateY(0px);  }
          50%       { transform: scale(1.06) translateY(-2px); }
        }

        /* subtle full-cat bow during greetings */
        .cs-cat-bow {
          transform-origin: 110px 220px;
          animation: ${isGreeting ? "csBow 3.2s ease-in-out infinite" : "none"};
        }
        @keyframes csBow {
          0%, 100% { transform: rotate(0deg); }
          45%, 55% { transform: rotate(2.5deg); }
        }

        .cs-shadow {
          transform-origin: 110px 254px;
          animation: csShadow 3.2s ease-in-out infinite;
        }
        @keyframes csShadow {
          0%, 100% { transform: scaleX(1);    opacity: 0.08; }
          50%       { transform: scaleX(0.80); opacity: 0.04; }
        }

        .cs-blush {
          animation: csBlush 2.6s ease-in-out infinite;
        }
        @keyframes csBlush {
          0%, 100% { opacity: 0.20; }
          50%       { opacity: 0.36; }
        }

        .cs-greet {
          opacity: ${greetOpacity};
          transition: opacity ${GREET_FADE}ms ease;
        }

        /* ── Namaste arm states ── */
        .cs-pray-left {
          transform-origin: 66px 192px;
          opacity: ${prayRetract ? 0 : prayVisible ? 1 : 0};
          transform: ${prayRetract ? "rotate(55deg) translate(8px, 6px)" : "rotate(0deg)"};
          transition: transform 280ms ease-in, opacity 240ms ease-in;
          animation: ${prayVisible ? "csPrayL 3.2s ease-in-out infinite" : "none"};
        }
        @keyframes csPrayL {
          0%, 100% { transform: rotate(0deg) translate(0,0);      }
          50%       { transform: rotate(2.5deg) translate(1px,-2px); }
        }

        .cs-pray-right {
          transform-origin: 154px 192px;
          opacity: ${prayRetract ? 0 : prayVisible ? 1 : 0};
          transform: ${prayRetract ? "rotate(-55deg) translate(-8px, 6px)" : "rotate(0deg)"};
          transition: transform 280ms ease-in, opacity 240ms ease-in;
          animation: ${prayVisible ? "csPrayR 3.2s ease-in-out infinite" : "none"};
        }
        @keyframes csPrayR {
          0%, 100% { transform: rotate(0deg) translate(0,0);       }
          50%       { transform: rotate(-2.5deg) translate(-1px,-2px); }
        }
      `}</style>

      <div className="cs-root">
        {/* Main Ambient Background Purple Aura */}
        <div 
          className="cs-glow-back" 
          style={{ opacity: inkPhase !== "idle" ? 0 : 1 }} 
        />

        {/* Tight irregular paw-spot glow — fades out before ink */}
        <div
          className="cs-glow-paw"
          style={{ opacity: prayPhase === "retracting" ? 0 : 1 }}
        />

        <canvas className="cs-canvas" ref={canvasRef} />

        <svg
          ref={catRef}
          className="cs-stage"
          viewBox="0 0 220 270"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="csBodyClip">
              <ellipse cx="110" cy="198" rx="54" ry="44" />
            </clipPath>
            <filter id="pawGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* ground shadow */}
          <ellipse className="cs-shadow" cx="110" cy="254" rx="50" ry="7" fill="#111622" />

          {/* tail */}
          <g className="cs-tail">
            <path
              d="M155,218 Q192,208 196,184 Q200,158 180,146 Q168,138 158,145"
              stroke="#111622" strokeWidth="15" strokeLinecap="round" fill="none"
            />
            <circle cx="158" cy="145" r="9" fill="#1a202c" />
          </g>

          {/* full-cat gentle bow wrapper */}
          <g className="cs-cat-bow">

            {/* body */}
            <g className="cs-body">
              <ellipse cx="110" cy="198" rx="54" ry="44" fill="#111622" />
              <ellipse cx="110" cy="196" rx="30"  ry="28" fill="#1a202c" />

              {/* greeting text inside chest */}
              <g clipPath="url(#csBodyClip)" className="cs-greet">
                <text
                  x="110" y="193"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight="300" fontSize="14"
                  fill="#ffffff" textAnchor="middle"
                  dominantBaseline="middle" letterSpacing="0.04"
                >
                  {GREETINGS[greetIndex].text}
                </text>
                <text
                  x="110" y="210"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="300" fontSize="5.5"
                  fill="#ffffff" textAnchor="middle"
                  dominantBaseline="middle"
                  letterSpacing="0.2" opacity="0.52"
                >
                  {GREETINGS[greetIndex].lang.toUpperCase()}
                </text>
              </g>

              {/* paws (feet) */}
              <ellipse cx="86"  cy="233" rx="16" ry="10" fill="#111622" />
              <ellipse cx="134" cy="233" rx="16" ry="10" fill="#111622" />
              {[80,86,92].map(x => (
                <line key={x} x1={x} y1="229" x2={x} y2="238"
                  stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              ))}
              {[128,134,140].map(x => (
                <line key={x} x1={x} y1="229" x2={x} y2="238"
                  stroke="#2d3748" strokeWidth="1.1" strokeLinecap="round" />
              ))}
            </g>

            {/* ── NAMASTE ARMS & COMPLEMENTARY PAWS GESTURE ── */}

            {/* Left sleeve/arm curve transitioning smoothly to center alignment */}
            <g className="cs-pray-left">
              <path
                d="M66,192 Q74,178 94,170 Q104,166 110,158"
                stroke="#718096" strokeWidth="12" strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Right sleeve/arm curve mirroring left path */}
            <g className="cs-pray-right">
              <path
                d="M154,192 Q146,178 126,170 Q116,166 110,158"
                stroke="#718096" strokeWidth="12" strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Detailed joined hands layered directly onto the center vertex (x=110) */}
            <g
              className="cs-paws-group"
              style={{ opacity: prayVisible ? 1 : 0 }}
              filter="url(#pawGlow)"
            >
              {/* Soft cosmic outer alignment ring - adapted to matching purple */}
              <circle cx="110" cy="158" r="15" fill="none" stroke="rgba(147, 51, 234, 0.35)" strokeWidth="3.5"/>
              
              {/* Primary structural pad bases */}
              <circle cx="105" cy="158" r="9" fill="#a8b8cc"/>
              <circle cx="115" cy="158" r="9" fill="#a8b8cc"/>
              
              {/* Realistic interior depth shading overlay */}
              <circle cx="105" cy="158" r="7.5" fill="#8a9aad" />
              <circle cx="115" cy="158" r="7.5" fill="#8a9aad" />

              {/* Specular high-points for stylized 3D volume */}
              <circle cx="102" cy="155" r="2.5" fill="rgba(255,255,255,0.55)"/>
              <circle cx="112" cy="155" r="2.5" fill="rgba(255,255,255,0.55)"/>

              {/* Unified centerline seam separation */}
              <line x1="110" y1="148" x2="110" y2="168" stroke="#4a5a6d" strokeWidth="1.6" strokeLinecap="round"/>

              {/* Balanced alignment of structural toe knuckles */}
              <circle cx="104" cy="149" r="3" fill="#a8b8cc"/>
              <circle cx="110" cy="147.5" r="3" fill="#a8b8cc"/>
              <circle cx="116" cy="149" r="3" fill="#a8b8cc"/>
            </g>

            {/* ── HEAD ── */}
            <circle cx="110" cy="90" r="74" fill="#111622" />

            {/* left ear */}
            <path d="M52,44 Q38,6 68,22 Q72,26 66,38 Z"  fill="#111622" />
            <path d="M55,40 Q44,12 65,24 Q68,28 64,37 Z"  fill="#3a2232" />

            {/* right ear (twitches) */}
            <g className="cs-ear-r">
              <path d="M168,44 Q182,6 152,22 Q148,26 154,38 Z" fill="#111622" />
              <path d="M165,40 Q176,12 155,24 Q152,28 156,37 Z" fill="#3a2232" />
            </g>

            {/* blush cheeks */}
            <ellipse className="cs-blush" cx="64"  cy="110" rx="18" ry="11" fill="#e53e3e" />
            <ellipse className="cs-blush" cx="156" cy="110" rx="18" ry="11" fill="#e53e3e" />

            {/* eyes */}
            <g className="cs-eyes">
              <ellipse cx="87"  cy="88" rx="16" ry="18" fill="#f7fafc" />
              <ellipse cx="87"  cy="90" rx="9"  ry="14" fill="#111622" />
              <circle  cx="91"  cy="82" r="4.5" fill="white" />
              <circle  cx="83"  cy="94" r="2"   fill="white" opacity="0.55" />

              <ellipse cx="133" cy="88" rx="16" ry="18" fill="#f7fafc" />
              <ellipse cx="133" cy="90" rx="9"  ry="14" fill="#111622" />
              <circle  cx="137" cy="82" r="4.5" fill="white" />
              <circle  cx="129" cy="94" r="2"   fill="white" opacity="0.55" />
            </g>

            {/* nose & mouth */}
            <path d="M107,114 Q110,110 113,114 Q117,118 110,124 Q103,118 107,114 Z" fill="#f687b3" />
            <path d="M102,124 Q106,130 110,126 Q114,130 118,124"
              stroke="#f687b3" strokeWidth="1.6" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />

            {/* whiskers */}
            <line x1="38"  y1="112" x2="92"  y2="117" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="34"  y1="121" x2="92"  y2="121" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="38"  y1="130" x2="92"  y2="125" stroke="#ffffff" strokeWidth="0.9" opacity="0.18" />
            <line x1="182" y1="112" x2="128" y2="117" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="186" y1="121" x2="128" y2="121" stroke="#ffffff" strokeWidth="1.1" opacity="0.28" />
            <line x1="182" y1="130" x2="128" y2="125" stroke="#ffffff" strokeWidth="0.9" opacity="0.18" />

            {/* crown / antenna */}
            <path d="M103,20 Q107,11 110,18" stroke="#1a202c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M110,18 Q113,9  117,18" stroke="#1a202c" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          </g>{/* end cs-cat-bow */}
        </svg>
      </div>
    </>
  );
}