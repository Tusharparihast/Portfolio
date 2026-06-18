import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaKaggle } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* FLOATING GLASS CALL TO ACTION CARD */}
        <motion.div 
          className="w-full max-w-4xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-12 text-center mb-16 shadow-xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4">
            Let's build something intelligent together.
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base mb-8 leading-relaxed">
            Whether you want to discuss computer vision pipelines, machine learning architectures, or dynamic web development, my inbox is open.
          </p>
          <a 
            href="mailto:tusharparihast@gmail.com" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            <FiMail size={18} /> Send an Email
          </a>
        </motion.div>

        {/* BOTTOM BRANDING & NAVIGATION LINKS */}
        <div className="w-full border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
          
          {/* Copyright text */}
          <div className="text-xs font-mono tracking-wider text-slate-500 order-2 sm:order-1">
            © {new Date().getFullYear()} // TUSHAR PARIHAST. ALL RIGHTS RESERVED.
          </div>

          {/* Core footprint networking hubs */}
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <a href="https://www.instagram.com/tus_rparihast/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="Instagram">
              <FiInstagram />
            </a>
            <a href="https://www.facebook.com/tushar.parihast.7" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="Facebook">
              <FiFacebook />
            </a>
            <a href="https://github.com/Tusharparihast" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="GitHub">
              <FiGithub />
            </a>
            <a href="https://www.linkedin.com/in/tushar-parihast-422107267/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="LinkedIn">
              <FiLinkedin />
            </a>
            
            
            {/* Scroll back up anchor controller */}
            <button 
              onClick={scrollToTop}
              className="p-2 ml-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700/50"
              aria-label="Scroll to top"
            >
              <FiArrowUp size={16} />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}