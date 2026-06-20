import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import projects from '../data/projectData.json';
import { FiGithub, FiArrowRight, FiX, FiLayers } from 'react-icons/fi';

export default function Projects() {
  const navigate = useNavigate(); 
  const [selectedId, setSelectedId] = useState(null);
  const activeProject = projects.find(p => p.id === selectedId);

  // SCROLL LOCK EFFECT: Freezes page scroll when an interactive card modal expands
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Clean up lifecycle styling allocations to guarantee reset layout frames
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  return (
    <section id="projects" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-slate-100">
      
      {/* Section Header */}
      <div className="mb-16 text-center lg:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 block mb-2">
          Selected Works
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Research & Engineering Projects
        </h2>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layoutId={`card-container-${project.id}`}
            onClick={() => {
              setSelectedId(project.id);
              window.history.replaceState(null, '', '/#projects');
            }}
            className="bg-slate-50/50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200/80 cursor-pointer flex flex-col justify-between group min-h-[20rem] relative transition-colors duration-300"
            whileHover={{ 
              y: -4,
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div>
              {/* AUTOMATICALLY ALIGNED HEADER WITH HIGH-FIDELITY ASPECT FIX */}
              <div className="flex items-start gap-5 mb-5">
                
                {/* Clean, scalable framing container with custom letterbox fallback parameters */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center p-1.5 relative">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      /* object-contain scaling mechanism keeps landscape layout fully visible without edge crop distortions */
                      className="max-w-full max-h-full object-contain object-center group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="hidden w-full h-full items-center justify-center bg-slate-100 text-slate-400 absolute inset-0">
                    <FiLayers size={24} />
                  </div>
                </div>

                {/* Right text layout structure */}
                <div className="space-y-1.5 min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono font-semibold">
                    <span className="text-slate-500 uppercase tracking-wider">
                      {project.domain}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-emerald-600 font-medium">
                      {project.metrics}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors duration-200">
                    {project.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors pt-4 border-t border-slate-100/80 mt-4">
              Explore Overview <FiArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* EXPANDED MORPHED MODAL */}
      <AnimatePresence>
        {selectedId && activeProject && (
          <>
            {/* Elevated explicit stacking layer (z-[60]) ensures complete masking isolation above CTA portions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedId(null)}
            />

            <div 
              className="fixed inset-0 flex items-center justify-center z-[61] p-4 md:p-6 cursor-pointer"
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                layoutId={`card-container-${selectedId}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between overflow-y-auto max-h-[90vh] cursor-default"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      {activeProject.domain}
                    </span>
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
                    {activeProject.title}
                  </h3>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-6 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">Core Benchmark</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{activeProject.metrics}</span>
                  </div>

                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Summary</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                    {activeProject.longDescription || activeProject.shortDescription}
                  </p>

                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Pipeline Stack</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {activeProject.tech.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200/40 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-colors font-mono font-bold"
                  >
                    <FiGithub size={18} /> Source Code
                  </a>
                  <button
                    onClick={() => {
                      setSelectedId(null); 
                      navigate(`/projects/${activeProject.id}`); 
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-colors sm:ml-auto font-mono font-bold"
                  >
                    View Deep Dive <FiArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}