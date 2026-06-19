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

function MainDashboard() {
  return (
    <div id="top">
      <Hero />
      <About />
      <TimelineAndCards />
      <Projects />
      <BlogMarquee />
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { hash, pathname } = useLocation();

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
      // Strips '/#journey' back down to a clean visual '/' path line item without re-triggering React renders
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // INTERCEPTOR 2: Main framework viewport handling pipeline
  useEffect(() => {
    // Hold off scroll loops if the welcome animation vector is actively occupying display real estate
    if (loading) return;

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const isComingBackFromDetails = prevPath !== '/' && pathname === '/';
      const isNavbarClick = sessionStorage.getItem('nav_click') === 'true';

      const checkAndScroll = () => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: (isComingBackFromDetails && !isNavbarClick) ? 'instant' : 'smooth'
        });

        sessionStorage.removeItem('nav_click');
        return true;
      };

      if (!checkAndScroll()) {
        const checkInterval = setInterval(() => {
          if (checkAndScroll()) clearInterval(checkInterval);
        }, 30);
        return () => clearInterval(checkInterval);
      }
    } else {
      // Natural fallback coordinates to guarantee Hero view initialization
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    setPrevPath(pathname);
  }, [hash, pathname, loading]);

  return (
    <>
      <ScrollToTop /> 
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar onLinkClick={() => sessionStorage.setItem('nav_click', 'true')} />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
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