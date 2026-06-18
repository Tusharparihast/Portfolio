import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import projects from '../data/projectData.json';
import { FiGithub, FiArrowRight, FiX } from 'react-icons/fi';

export default function Projects() {
  const navigate = useNavigate(); 
  const [selectedId, setSelectedId] = useState(null);
  const activeProject = projects.find(p => p.id === selectedId);

  return (
    <section id="projects" className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-16 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Selected Research & Architectures
        </h2>
        <p className="text-slate-600 max-w-xl">
          A showcase of computer vision systems and analytical frameworks optimized for production execution.
        </p>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layoutId={`card-container-${project.id}`}
            onClick={() => setSelectedId(project.id)}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-md cursor-pointer flex flex-col justify-between group h-72 relative overflow-hidden"
            whileHover={{ 
              y: -8, 
              rotateX: 2, 
              rotateY: -2,
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-2.5 py-1 bg-blue-50 rounded-full">
                  {project.domain}
                </span>
                <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  {project.metrics}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                {project.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-3">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors pt-4">
              Explore Overview <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* EXPANDED MORPHED MODAL */}
      <AnimatePresence>
        {selectedId && activeProject && (
          <>
            {/* Backdrop Area Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />

            {/* Centering Wrapper Container - Catching the outer click here */}
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 cursor-pointer"
              onClick={() => setSelectedId(null)} // Clicking anything inside this outer zone triggers close
            >
              <motion.div
                layoutId={`card-container-${selectedId}`}
                onClick={(e) => e.stopPropagation()} // Stop click bubbling so clicking inside the card content works fine
                className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between overflow-y-auto max-h-[90vh] cursor-default"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-3 py-1 bg-blue-50 rounded-full">
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
                    <span className="text-sm font-bold text-emerald-600">{activeProject.metrics}</span>
                  </div>

                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Summary</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                    {activeProject.longDescription || activeProject.shortDescription}
                  </p>

                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Pipeline Stack</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {activeProject.tech.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200/40">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Navigation Router Triggers */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiGithub size={18} /> Source Code
                  </a>
                  <button
                    onClick={() => {
                      setSelectedId(null); 
                      navigate(`/projects/${activeProject.id}`); 
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-colors ml-auto"
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