import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SLIDES = [
  { id: 1, title: 'Model Structural Checkpoints', img: '/images/TimeLine/june/Group.jpeg' },
  { id: 2, title: 'Keypoint Detection Array', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Network Topology Map', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Gradient Descent Logs', img: 'https://images.unsplash.com/photo-1543286386-7a39e65fecb5?auto=format&fit=crop&w=600&q=80' },
];

export default function AutoRibbonCarousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const CARD_WIDTH = 344; // 320px width + 24px gap

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    /* 🛠️ Fortified parent section constraints */
    <section id="gallery" className="w-full max-w-full py-24 bg-white border-t border-slate-100 overflow-hidden scroll-mt-12 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-10 flex justify-between items-end">
        <div>
          <span className="font-mono text-xs tracking-widest text-blue-600 uppercase">[ Live Stream ]</span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">Snapshots</h2>
        </div>
        
        <Link 
          to="/archive-timeline" 
          state={{ scrollToId: 'gallery' }}
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <span>VIEW FULL TIMELINE</span>
          <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <Link 
        to="/archive-timeline" 
        state={{ scrollToId: 'gallery' }}
        /* 🛠️ FIXED: Added w-full, max-w-full, and overflow-hidden to clip the block layer layout chain */
        className="block w-full max-w-full overflow-hidden px-6 md:px-12 lg:px-24 focus:outline-none"
      >
        <div ref={containerRef} className="w-full max-w-full overflow-hidden py-4 relative">
          <motion.div
            animate={{ x: -index * CARD_WIDTH }}
            transition={{ type: 'spring', stiffness: 45, damping: 15 }}
            className="flex gap-6 w-max"
          >
            {SLIDES.map((slide) => (
              <div 
                key={slide.id} 
                className="w-[320px] aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 flex-shrink-0 relative group shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img src={slide.img} alt={slide.title} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h4 className="text-white font-mono text-xs uppercase tracking-wide">{slide.title}</h4>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Link>
    </section>
  );
}