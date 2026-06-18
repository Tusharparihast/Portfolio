import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import BlobCanvas from './BlobCanvas'; // Import your new 3D engine component

export default function Hero() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-white">
      
      {/* 1. STRUCTURAL GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />
      
      {/* 2. LIVE 3D MORPHING IRIDESCENT BLOB LAYER */}
      <div className="absolute w-[500px] h-[500px] right-4 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 opacity-80 md:opacity-90 z-0">
        <BlobCanvas />
      </div>

      {/* 3. FOREGROUND TYPOGRAPHY CONTENT MATRIX (Placed above the z-index mesh flow) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center lg:items-start text-center lg:text-left">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 rounded-md font-mono text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          [SYSTEM STATUS: RUNNING]
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl"
        >
          Engineering Intelligent <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Spatial Pipelines
          </span>
          <span className={`inline-block ml-1 text-blue-600 ${blink ? 'opacity-100' : 'opacity-0'}`}>_</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 font-normal max-w-2xl leading-relaxed mb-10"
        >
          Translating raw pixel streams into production-ready quantitative analytics. Focused on computer vision architectures and custom environment optimization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-500/20 text-center transition-all transform hover:-y-0.5"
          >
            Explore Projects
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium rounded-xl text-sm text-center transition-all"
          >
            Say Hello!
          </a>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 pointer-events-none z-10"
      >
        <FiArrowDown size={20} />
      </motion.div>

    </section>
  );
}