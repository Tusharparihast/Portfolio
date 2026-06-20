import { useEffect } from 'react'; // 👈 Added useEffect
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TIMELINE_DATA = [
  {
    date: 'June 18, 2026',
    title: 'Model Structural Checkpoints',
    desc: 'Automated extraction logs running bone vector matrices across high-resolution sample environments. Validated coordinate maps against manual anchor keys.',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    date: 'June 04, 2026',
    title: 'Isolation Forest Threshold Adjustment',
    desc: 'Refactoring telemetry parsing on massive transaction streams. Visualized distance distributions and set rigorous standard deviation offsets to drop false flags.',
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1543286386-7a39e65fecb5?auto=format&fit=crop&w=500&q=80'
    ]
  },
  {
    date: 'May 24, 2026',
    title: 'Pipeline Multi-Node Deployment',
    desc: 'Integrated system configuration adjustments. Successfully routed background streams into clustered containers, lowering cross-node payload delays.',
    images: [
      'https://images.unsplash.com/photo-1570126038118-2e322d5612f0?auto=format&fit=crop&w=500&q=80'
    ]
  }
];

export default function ArchiveTimeline() {
  // CRITICAL FIX: Forces page container to reset immediately to absolute top on layout mount phase
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50/50 text-slate-800 py-24 px-6 md:px-12 lg:px-24 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-20">
          <Link 
            to="/" 
            state={{ scrollToId: 'gallery' }} // 👈 Fixed: Communicates target explicitly via history state payload
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-900 mb-6 group transition-colors focus:outline-none"
          >
            <FiArrowLeft className="transform group-hover:-translate-x-1 transition-transform" /> 
            BACK TO PORTFOLIO
          </Link>
          <span className="block font-mono text-xs tracking-widest text-blue-600 uppercase">[ Chrono Log ]</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">Historical Dev Stream</h1>
        </div>

        {/* Center Vertical Rule Axis */}
        <div className="relative border-l border-slate-200 ml-4 md:ml-0 md:left-1/2 md:border-r md:border-l-0 w-0 h-full" />

        <div className="space-y-24 relative">
          {TIMELINE_DATA.map((entry, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={entry.date} 
                className={`flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 items-center relative ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node Intersect Dot */}
                <div className="absolute left-[-21px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                </div>

                {/* Left/Right Text Descriptor Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col pl-8 md:pl-0 ${isEven ? 'md:text-right md:items-end' : 'md:text-left md:items-start'}`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-blue-600 bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-full mb-3">
                    <FiCalendar size={12} />
                    <span>{entry.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{entry.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-md">{entry.desc}</p>
                </motion.div>

                {/* Structural Image Sub-Grids */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`w-full grid gap-3 ${
                    entry.images.length === 1 ? 'grid-cols-1' : entry.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  } ${isEven ? 'md:order-last' : 'md:order-first'}`}
                >
                  {entry.images.map((imgUrl, imgIdx) => (
                    <div 
                      key={imgIdx} 
                      className={`rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-sm hover:scale-[1.02] transition-transform duration-300 ${
                        entry.images.length === 3 && imgIdx === 0 ? 'col-span-3 aspect-[21/9]' : 'aspect-square'
                      }`}
                    >
                      <img src={imgUrl} alt="Log capture snapshot" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}