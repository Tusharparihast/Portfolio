import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { FiArrowDown, FiExternalLink, FiFileText } from 'react-icons/fi';
import { SiPython, SiPytorch, SiPostgresql, SiGit } from 'react-icons/si';
import { SpiderWeb, CrawlingSpider } from './SpiderSystem';

export default function Hero() {
  const [blink, setBlink] = useState(true);
  const containerRef = useRef(null);
  const iconRefs = useRef({});

  useEffect(() => {
    const interval = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  const setIconRef = (key) => (el) => { iconRefs.current[key] = el; };

  return (
    <section className="relative min-h-screen w-full max-w-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-white z-10">
      
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12">
        
        {/* LEFT COLUMN: TYPOGRAPHY */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-3xl"
          >
            Building Intelligent Systems <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              That Think, Automate &amp; Scale
            </span>
            <span className={`inline-block ml-1 text-blue-600 ${blink ? 'opacity-100' : 'opacity-0'}`}>_</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 font-normal max-w-2xl leading-relaxed mb-8"
          >
            Combining Artificial Intelligence, Computer Vision, and Data Analytics with software engineering to build high-utility systems. Focused on developing robust, end-to-end automation pipelines that turn unstructured data into functional real-world applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a href="#projects" className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-500/20 text-center transition-all transform hover:-translate-y-0.5">
              Explore Projects
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl text-sm text-center flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 group">
              <FiFileText size={16} className="text-slate-400 group-hover:text-slate-600" />
              <span>View Resume</span>
              <FiExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#contact" className="w-full sm:w-auto px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium rounded-xl text-sm text-center transition-all transform hover:-translate-y-0.5">
              Say Hello!
            </a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL DISPLAY */}
        <div ref={containerRef} className="lg:col-span-5 w-full flex justify-center items-center relative min-h-[560px]">
          <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-purple-400/10 blur-3xl pointer-events-none z-0" />

          {/* Web backdrop connected to the layout */}
          <SpiderWeb containerRef={containerRef} iconRefs={iconRefs} />

          {/* Floating Skill Badges */}
          <div className="absolute inset-0 pointer-events-none z-30">
            
            {/* PYTHON */}
            <motion.div
              ref={setIconRef('python')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute top-[18%] -left-[4%] bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center justify-center pointer-events-auto"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.918 0C5.642 0 6.012 2.723 6.012 2.723L6.02 5.541H12.06V6.393H3.593C3.593 6.393 0 6.78 0 12.399C0 18.016 3.149 18.232 3.149 18.232H5.034V15.589C5.034 15.589 4.908 12.43 8.012 12.43H14.156C14.156 12.43 17.227 12.463 17.227 9.444V3.687C17.227 3.687 17.653 0 11.918 0ZM9.213 1.766A.835.835 0 1 1 9.213 3.436A.835.835 0 0 1 9.213 1.766Z" fill="#3776AB"/>
                <path d="M12.082 24C18.358 24 17.988 21.277 17.988 21.277L17.98 18.459H11.94V17.607H20.407C20.407 17.607 24 17.22 24 11.601C24 5.984 20.851 5.768 20.851 5.768H18.966V8.411C18.966 8.411 19.092 11.57 15.988 11.57H9.844C9.844 11.57 6.773 11.537 6.773 14.556V20.313C6.347 24 12.082 24ZM14.787 22.234A.835.835 0 1 1 14.787 20.564A.835.835 0 0 1 14.787 22.234Z" fill="#FFD43B"/>
              </svg>
            </motion.div>

            {/* PYTORCH */}
            <motion.div
              ref={setIconRef('pytorch')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute top-[12%] right-[4%] bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center justify-center pointer-events-auto"
            >
              <SiPytorch size={24} color="#EE4C2C" />
            </motion.div>

            {/* GENUINE REACT ATOM LOGO */}
            <motion.div
              ref={setIconRef('opencv')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute top-[48%] -right-[8%] bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center justify-center pointer-events-auto"
            >
              <svg width="24" height="24" viewBox="-11.5 -10.23 23 20.46" xmlns="http://www.w3.org/2000/svg">
                <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
                <g stroke="#61DAFB" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2"/>
                  <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                  <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                </g>
              </svg>
            </motion.div>

            {/* POSTGRESQL */}
            <motion.div
              ref={setIconRef('postgresql')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute bottom-[20%] -left-[6%] bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center justify-center pointer-events-auto"
            >
              <SiPostgresql size={24} color="#336791" />
            </motion.div>

            {/* GIT */}
            <motion.div
              ref={setIconRef('git')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute bottom-[14%] right-[10%] bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center justify-center pointer-events-auto"
            >
              <SiGit size={24} color="#F05032" />
            </motion.div>
          </div>

          {/* Crawling Spider System */}
          <CrawlingSpider containerRef={containerRef} iconRefs={iconRefs} />

          {/* FIXED: Replaced fixed w-[440px] with responsive scaling variables to prevent layout track leakage */}
          <div className="w-full max-w-[440px] h-[460px] sm:h-[520px] rounded-3xl bg-transparent border border-dashed border-slate-200/40 pointer-events-none select-none z-10" />
        </div>
      </div>

      {/* Footer Indicator Arrow */}
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