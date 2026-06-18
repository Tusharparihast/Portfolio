import { useState } from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Offset standardizer calculation logic block
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  };

  // Dynamic cross-route click handling intercept pipeline
  const handleNavigationClick = (e, path) => {
    setIsOpen(false); // Cleanly drop mobile open state flags

    // Check if user is currently inside a deep-dive details subpage path stream
    if (location.pathname !== '/') {
      e.preventDefault(); // Stop standard routing
      
      const targetHash = path.split('#')[1]; // Strip identifier name (e.g., 'about')
      
      // Force pipeline back to core page first
      navigate('/');

      // Wait briefly for DOM elements to safely render and mount onto layout canvas
      setTimeout(() => {
        const targetElement = document.getElementById(targetHash);
        if (targetElement) {
          const yCoordinate = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const yOffset = -80;
          window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
        }
      }, 150); // Small, unnoticeable timeout window that ensures mount success
    }
  };

  const navLinks = [
    { title: 'About', path: '/#about' },
    { title: 'My Journey', path: '/#journey' },
    { title: 'Projects', path: '/#projects' },
    { title: 'Insights', path: '/#blog' },
    { title: 'Contact', path: '/#contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/40 px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between shadow-sm">
        {/* Core Root Logo Link */}
        <Link 
          smooth 
          to="/#top" 
          onClick={(e) => handleNavigationClick(e, '/#top')}
          className="text-slate-900 font-mono font-bold tracking-tighter text-lg hover:text-blue-600 transition-colors"
        >
          [TP]
        </Link>

        {/* Desktop Interface Navigation Matrix */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              smooth
              to={link.path}
              scroll={scrollWithOffset}
              onClick={(e) => handleNavigationClick(e, link.path)}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 font-mono tracking-wide transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[65px] bg-white z-40 flex flex-col p-6 gap-6 md:hidden border-t border-slate-100 shadow-xl h-fit"
          >
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                smooth
                to={link.path}
                scroll={scrollWithOffset}
                onClick={(e) => handleNavigationClick(e, link.path)}
                className="text-lg font-semibold text-slate-800 hover:text-blue-600 font-mono border-b border-slate-50 pb-3"
              >
                {link.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}