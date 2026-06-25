import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import projects from '../data/projectData.json';
import { FiArrowRight, FiX, FiLayers } from 'react-icons/fi'; // 👈 Removed unused FiGithub icon

export default function Projects() {
  const navigate = useNavigate(); 
  const [selectedId, setSelectedId] = useState(null);
  const activeProject = projects.find(p => p.id === selectedId);

  // SCROLL LOCK EFFECT
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  // Framer Motion variant orchestrations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="projects" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-slate-100">
      
      {/* Section Header */}
      <div className="mb-16 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Featured Works
        </h2>
      </div>

      {/* PROJECTS GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            layoutId={window.innerWidth >= 768 ? `card-container-${project.id}` : undefined}
            onClick={() => {
              // On mobile, bypass the morphing layout sequence entirely and open the route directly
              if (window.innerWidth < 768) {
                navigate(`/projects/${project.id}`);
              } else {
                setSelectedId(project.id);
                window.history.replaceState(null, '', '/#projects');
              }
            }}
            className="bg-gray-100 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-500/50 cursor-pointer flex flex-col justify-between group min-h-[20rem] relative transition-colors duration-300"
            whileHover={{ 
              y: -4,
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div>
              <div className="flex items-start gap-5 mb-5">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center p-1.5 relative">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="max-w-full max-h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-300"
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

                <div className="space-y-1.5 min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono font-semibold">
                    <span className="text-slate-500 uppercase tracking-wider">{project.domain}</span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-emerald-600 font-medium">{project.metrics}</span>
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
      </motion.div>

      {/* EXPANDED MORPHED MODAL */}
      <AnimatePresence>
        {selectedId && activeProject && (
          <>
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
                className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between overflow-hidden max-h-[85vh] cursor-default"
              >
                <div>
                  {/* Top Bar Navigation Actions */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {activeProject.domain}
                    </span>
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Title Block */}
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    {activeProject.title}
                  </h3>

                  {/* High-Fidelity Stats Bar */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Core Benchmark</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">{activeProject.metrics}</span>
                  </div>

                  {/* TECHNICAL SUMMARY */}
                  <div className="relative mb-8">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3">
                      {activeProject.longDescription || activeProject.shortDescription}
                    </p>
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  </div>

                  {/* Pipeline Stack */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/60 font-mono shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-5 border-t border-slate-100 mt-4">
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