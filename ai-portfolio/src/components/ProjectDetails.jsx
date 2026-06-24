import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link'; 
import { motion, AnimatePresence } from 'framer-motion'; // 👈 Added framer-motion imports
import { FiArrowLeft, FiGithub, FiLock, FiX } from 'react-icons/fi';
import projects from '../data/projectData.json';

export default function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
        <h2 className="text-xl font-bold text-slate-800">Pipeline Registry Not Found</h2>
        <Link to="/#projects" className="mt-4 text-blue-600 hover:underline font-mono text-sm uppercase">
          Return to Projects Hub
        </Link>
      </div>
    );
  }

  const handleGithubClick = (e) => {
    if (!project.github || project.github.includes('private') || project.github === '#') {
      e.preventDefault();
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-12 lg:px-24 relative z-10 select-none">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-blue-600 transition-colors mb-8 uppercase">
          <FiArrowLeft /> Back to Dashboard
        </Link>

        <div className="border-b border-slate-200 pb-8 mb-8">
          <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {project.domain}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-2">
            {project.title}
          </h1>
          <p className="text-slate-500 font-medium font-mono text-sm">BENCHMARK: {project.metrics}</p>
        </div>

        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md mb-8 bg-slate-200">
          <img src={project.image || "/images/Projects/BCS.jpeg"} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Overview</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {project.longDescription || project.shortDescription}
              </p>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Key Features</h2>
                <ul className="space-y-4 list-disc pl-5 text-slate-600 text-base leading-relaxed">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="marker:text-slate-300">
                      <span className="font-bold text-slate-800">{feature.split(':')[0]}:</span>
                      {feature.split(':').slice(1).join(':')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-6 shadow-sm">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack Deployed</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => (
                  <span key={i} className="text-xs bg-slate-100 border border-slate-200/60 px-2 py-1 rounded font-medium text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <a href={project.github} onClick={handleGithubClick} target="_blank" rel="noreferrer" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono tracking-wider font-bold flex items-center justify-center gap-2 transition-colors">
              <FiGithub size={14} /> EXTRACT SOURCE CODE
            </a>
          </div>
        </div>

      </div>

      {/* SMOOTH ANIMATED TOAST NOTIFICATION */}
      {createPortal(
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: 40  }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                <FiLock size={16} />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-0.5">Private Repository</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Repository is private. Please contact for source access.
                </p>
              </div>

              <button 
                onClick={() => setShowToast(false)} 
                className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
              >
                <FiX size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}