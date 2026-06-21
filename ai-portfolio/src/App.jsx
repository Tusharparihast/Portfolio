import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import BlogMarquee from './components/BlogMarquee';
import Footer from './components/Footer';
import ProjectDetails from './components/ProjectDetails';
import BlogDetails from './components/BlogDetails'; 
import ScrollToTop from './components/ScrollToTop';
import WelcomeScreen from './components/WelcomeScreen'; 
import TimelineAndCards from './components/TimeLineAndCards';
import AutoRibbonCarousel from './components/AutoRibbonCarousel';
import ArchiveTimeline from './components/ArchiveTimeline';
import Skills from './components/Skills';

function MainDashboard() {
  return (
    <div id="top">
      <Hero />
      <About />
      <Skills />
      <TimelineAndCards />
      <Projects />
      <BlogMarquee />
      <AutoRibbonCarousel />
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { hash, pathname, state } = useLocation();

  // A persistent lock flag to let subsequent effects know a reload happened
  const isReloadSessionRef = useRef(false);

  // BLOCK 1: WELCOME SCREEN LOCK
  // Locks background viewport physics while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, [loading]);

  // BLOCK 2: STRICT REFRESH CONTROLLER 
  // Runs immediately once on mount. Clears memory and forces top placement on hard reloads.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    const isReload = window.performance
      ?.getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload');

    if (isReload) {
      isReloadSessionRef.current = true; // Mark session as a reload cycle
      sessionStorage.removeItem('return_to_id');
      
      if (window.location.pathname !== '/') {
        window.location.replace('/'); 
        return;
      }
      
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // BLOCK 3: BROWSER BACK BUTTON TIMELINE TRACKER
  // Sets the back checkpoint ONLY when naturally browsing on the sub-timeline view
  useEffect(() => {
    const isReload = window.performance?.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isReload && isReloadSessionRef.current) return;

    if (pathname === '/archive-timeline') {
      sessionStorage.setItem('return_to_id', 'gallery');
    }
  }, [pathname]);

  // BLOCK 4: ROUTE STATE & LINKS CONTROLLER
  // Manages interactive scroll targets (Navbar items, Custom links, and Back targets)
  useEffect(() => {
    if (loading) return;

    // If this session initialization was a reload, lock this logic container 
    // out to ensure the page remains strictly locked at coordinates (0, 0)
    const isReload = window.performance?.getEntriesByType('navigation')[0]?.type === 'reload';
    if (isReload && isReloadSessionRef.current) {
      if (pathname === '/') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      // Release reload session switch so subsequent custom link/navbar clicks work normally
      isReloadSessionRef.current = false; 
      return;
    }

    const storedTargetId = sessionStorage.getItem('return_to_id');
    const targetId = state?.scrollToId || storedTargetId || (hash ? hash.replace('#', '') : null);

    if (targetId) {
      const checkAndScroll = () => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant' 
        });

        if (state?.scrollToId) {
          window.history.replaceState(null, '');
        }
        sessionStorage.removeItem('return_to_id'); 
        return true;
      };

      if (!checkAndScroll()) {
        const checkInterval = setInterval(() => {
          if (checkAndScroll()) clearInterval(checkInterval);
        }, 10); 
        return () => clearInterval(checkInterval);
      }
    } else {
      if (pathname === '/' && !state?.scrollToId) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, [hash, pathname, loading, state]);

  const shouldBlockScrollToTop = state?.scrollToId || sessionStorage.getItem('return_to_id');

  return (
    <>
      {!shouldBlockScrollToTop && <ScrollToTop />} 
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/archive-timeline" element={<ArchiveTimeline />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}