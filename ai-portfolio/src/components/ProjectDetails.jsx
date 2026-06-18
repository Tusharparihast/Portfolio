import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiCpu } from 'react-icons/fi';
import projects from '../data/projectData.json';

export default function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Pipeline Registry Not Found</h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">Return to Core Hub</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-12 lg:px-24 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-blue-600 transition-colors mb-8 uppercase">
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
          <img src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <FiCpu className="text-blue-600" /> Architectural Specifications
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              {project.longDescription || project.shortDescription}
            </p>
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
            
            <a href={project.github} target="_blank" rel="noreferrer" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono tracking-wider font-bold flex items-center justify-center gap-2 transition-colors">
              <FiGithub size={14} /> EXTRACT SOURCE CODE
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}