import { useState, useEffect } from 'react';
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

  // Keep track of the previous pathname to detect deep-page back actions
  const [prevPath, setPrevPath] = useState(pathname);

  // INTERCEPTOR 1: Detect hard reloads and instantly wipe out any deep hash paths
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    const isReload = window.performance
      ?.getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload');

    if (isReload && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // INTERCEPTOR 2: Main framework viewport handling pipeline
  useEffect(() => {
    if (loading) return;

    // Save a persistence layout checkpoint whenever the user is viewing the archive timeline
    if (pathname === '/archive-timeline') {
      sessionStorage.setItem('return_to_id', 'gallery');
    }

    // Read target element from router state, session checkpoint, or fallback string hash
    const storedTargetId = sessionStorage.getItem('return_to_id');
    const targetId = state?.scrollToId || storedTargetId || (hash ? hash.replace('#', '') : null);

    if (targetId) {
      const checkAndScroll = () => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        
        // Force instant snap on back-tracking items to prevent visual layout shifts
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant' 
        });

        // Clear state metadata safely so native route pushes run correctly later
        if (state?.scrollToId) {
          window.history.replaceState(null, '');
        }
        sessionStorage.removeItem('return_to_id'); // Clear the browser back checkpoint
        sessionStorage.removeItem('nav_click');
        return true;
      };

      if (!checkAndScroll()) {
        const checkInterval = setInterval(() => {
          if (checkAndScroll()) clearInterval(checkInterval);
        }, 10); // Sped up frequency to capture DOM rendering frames faster
        return () => clearInterval(checkInterval);
      }
    } else {
      // Natural fallback coordinates - ONLY trigger top alignment if there isn't a state destination
      if (pathname === '/' && !state?.scrollToId) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }

    setPrevPath(pathname);
  }, [hash, pathname, loading, state]);

  // Block the global ScrollToTop component from running if we have an active link state or browser back checkpoint targeting the gallery
  const shouldBlockScrollToTop = state?.scrollToId || sessionStorage.getItem('return_to_id');

  return (
    <>
      {!shouldBlockScrollToTop && <ScrollToTop />} 
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar onLinkClick={() => sessionStorage.setItem('nav_click', 'true')} />
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