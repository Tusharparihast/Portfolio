import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing transitions
import blogs from '../data/blogsData.json'; // Matches your actual json file name exactly
import { FiArrowUpRight } from 'react-icons/fi';

export default function BlogMarquee() {
  const navigate = useNavigate(); // Initialize navigation loop

  return (
    <section id="blog" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-slate-200/60">
      
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Latest Insights & Notebooks
        </h2>
      </div>

      {/* THREE-COLUMN ADAPTIVE BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, idx) => (
          <motion.article
            key={blog.id}
            className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ 
              y: -6,
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)"
            }}
            
            // Cache historical entry hash anchor right before path swap transitions
            onClick={() => {
              window.history.replaceState(null, '', '/#blog');
              navigate(`/blog/${blog.id}`);
            }}
          >
            <div>
              {/* Card Header Image Asset with Ambient Light Tint */}
              <div className="h-48 w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                <img 
                  src={blog.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
              </div>

              {/* Text Meta Content Area */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-mono font-medium text-slate-400 mb-3">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span className="text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded">
                    {blog.readTime}
                  </span>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-3">
                  {blog.title}
                </h3>
                
                {/* FIXED: Changed blog.summary to blog.subtitle to load distinct content descriptions.
                  The fallback string will only log if a specific node is missing its subtitle entry.
                */}
                <p className="text-slate-500 text-xs md:text-sm line-clamp-3 leading-relaxed">
                  {blog.subtitle || "Exploring technical orchestration pipelines, engineering logs, and empirical performance metrics across applied research nodes."}
                </p>
              </div>
            </div>

            {/* Premium Interactive Action Bar Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
              <span>Read Notebook</span>
              <FiArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>

          </motion.article>
        ))}
      </div>

    </section>
  );
}