import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import blogArticles from '../data/blogsData.json';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the matching article
  const article = blogArticles.find((b) => b.id === id);

  // Guard Clause 1: If article id doesn't match anything in JSON
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Insight Record Not Found</h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">Return to Core Hub</Link>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 py-24 px-6 md:px-12 lg:px-24 relative z-10 cursor-pointer"
      onClick={() => navigate('/')} 
    >
      <div 
        className="max-w-3xl mx-auto bg-white border border-slate-200/60 p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/40 cursor-default"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-blue-600 transition-colors mb-8 uppercase"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>

        {/* Header Metadata Block */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {article.title || "Untitled Article"}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <FiCalendar /> {article.date || "Recent"}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock /> {article.readTime || "Read"}
            </span>
          </div>
        </div>

        {/* Guard Clause 2: Check if content field exists before running .split() */}
        <article className="text-slate-700 text-base md:text-lg leading-relaxed font-normal space-y-6">
          {article.content ? (
            article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p className="text-slate-400 italic">No content specifications logged in this pipeline node yet.</p>
          )}
        </article>

      </div>
    </div>
  );
}