import { useState, useEffect } from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

// BLOCK 1: DECOUPLED SLIDER COMPONENT
function SmoothIndicator({ isActive, location }) {
  return (
    isActive && (
      <motion.div
        layoutId={location.pathname === '/' ? "activeNavIndicator" : undefined}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 30
        }}
        style={{ pointerEvents: 'none' }}
      />
    )
  );
}

export default function Navbar({ onLinkClick, onSmoothLinkClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { title: 'About', path: '/#about', id: 'about' },
    { title: 'My Journey', path: '/#journey', id: 'journey' },
    { title: 'Projects', path: '/#projects', id: 'projects' },
    { title: 'Insights', path: '/#blog', id: 'blog' },
    { title: 'Gallery', path: '/#gallery', id: 'gallery' },
    { title: 'Contact', path: '/#contact', id: 'contact' },
  ];

  // 1. DYNAMIC INTERSECTION OBSERVER: Tracks viewport coordinates smoothly on root path
  useEffect(() => {
    if (location.pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', 
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window.location.pathname === '/') {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const targets = ['top', 'about', 'journey', 'gallery', 'projects', 'blog', 'contact'];
    targets.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // 2. ROUTE TRACKING PROTECTION: Retains active context during sub-route rendering
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/blog') || path.startsWith('/insights')) {
      setActiveSection('blog');
    } else if (path.startsWith('/projects')) {
      setActiveSection('projects');
    } else if (path.startsWith('/gallery')) {
      setActiveSection('gallery');
    } else if (path === '/') {
      if (location.state?.scrollToId) {
        setActiveSection(location.state.scrollToId);
      }
    }
  }, [location.pathname, location.state]);

  const triggerNavFlag = () => {
    if (onLinkClick) onLinkClick();
  };

  const scrollWithOffset = (el) => {
    if (el.id === 'gallery' && onSmoothLinkClick) {
      onSmoothLinkClick();
    } else {
      triggerNavFlag();
    }

    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  };

  const handleNavigationClick = (e, path, targetId) => {
    setIsOpen(false); 
    setActiveSection(targetId);

    if (location.pathname !== '/') {
      e.preventDefault();
      triggerNavFlag();
      navigate('/', { state: { scrollToId: targetId } });
    } else {
      if (targetId === 'gallery' && onSmoothLinkClick) {
        onSmoothLinkClick();
      } else {
        triggerNavFlag();
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-slate-200/40 px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between shadow-sm">
        <Link 
          smooth 
          to="/#top" 
          onClick={(e) => handleNavigationClick(e, '/#top', 'top')}
          className={`text-slate-900 font-mono font-bold tracking-tighter text-lg transition-colors ${activeSection === 'top' ? 'text-blue-600' : 'hover:text-blue-600'}`}
        >
          [TP]
        </Link>

        {/* BLOCK 2: DESKTOP NAVIGATION MATRIX MAP CONTAINER */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={idx}
                smooth
                to={link.path}
                scroll={scrollWithOffset}
                onClick={(e) => handleNavigationClick(e, link.path, link.id)}
                className={`text-sm font-medium font-mono tracking-wide transition-colors duration-200 relative py-1 ${
                  isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.title}
                <SmoothIndicator isActive={isActive} location={location} />
              </Link>
            );
          })}
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
                onClick={(e) => handleNavigationClick(e, link.path, link.id)}
                className={`text-lg font-semibold font-mono border-b border-slate-50 pb-3 transition-colors ${
                  activeSection === link.id ? 'text-blue-600 pl-2 border-blue-100' : 'text-slate-800'
                }`}
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