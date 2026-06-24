import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SLIDES = [
  { id: 1, title: 'eSewa Hackathon', img: '/images/TimeLine/june/Group.jpeg' },
  { id: 2, title: 'AI Conclave', img: '/images/TimeLine/ai-conclave/IMG_5184.JPG' },
  { id: 3, title: 'AAVISHKAR-25', img: '/images/TimeLine/aaviskar/group.jpeg' },
  { id: 4, title: 'Hack for Nepal - 2025', img: '/images/TimeLine/Hack4Nepal/506295341_752608461038465_9195213934046505558_n.jpg' },
];

// Duplicate the array once to create the endless wraparound illusion track
const INFINITE_SLIDES = [...SLIDES, ...SLIDES];

export default function AutoRibbonCarousel() {
  return (
    <section id="gallery" className="w-full max-w-full py-24 bg-white border-t border-slate-100 overflow-hidden scroll-mt-12 relative">
      
      {/* Section Header Row */}
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

      {/* INFINITE LOOP CONTAINER */}
      <Link 
        to="/archive-timeline" 
        state={{ scrollToId: 'gallery' }}
        className="block w-full max-w-full overflow-hidden focus:outline-none relative group"
      >
        {/* Soft edge masks to blend the cards beautifully into the page background layout */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none" />

        <div className="w-full max-w-full overflow-hidden py-4 flex">
          <motion.div
            /* Animates from start to the exact end of the first array sequence (100% of its native width) */
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              ease: 'linear',
              duration: 25, // Adjust this value to speed up or slow down the ribbon speed
              repeat: Infinity,
            }}
            /* While hovering anywhere over the track container, slow down the animation to allow easy scanning */
            whileHover={{ animationPlayState: 'paused' }}
            className="flex gap-6 pr-6 shrink-0"
          >
            {INFINITE_SLIDES.map((slide, idx) => (
              <div 
                key={`${slide.id}-${idx}`} 
                className="w-[280px] sm:w-[320px] aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 flex-shrink-0 relative group shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img src={slide.img} alt={slide.title} className="w-full h-full object-cover pointer-events-none" />
                
                {/* Text Label Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h4 className="text-white font-mono text-xs uppercase tracking-wide">{slide.title}</h4>
                </div>
              </div>
            ))}
          </motion.div>

          {/* SECOND TRACK INSTANCE: Matches the first exactly to form the seamless loop background anchor */}
          <motion.div
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              ease: 'linear',
              duration: 25,
              repeat: Infinity,
            }}
            whileHover={{ animationPlayState: 'paused' }}
            aria-hidden="true"
            className="flex gap-6 pr-6 shrink-0"
          >
            {INFINITE_SLIDES.map((slide, idx) => (
              <div 
                key={`${slide.id}-duplicate-${idx}`} 
                className="w-[280px] sm:w-[320px] aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 flex-shrink-0 relative group shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img src={slide.img} alt={slide.title} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
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