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
      <Hero /><About /><TimelineAndCards /><Projects /><BlogMarquee />
    </div>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { hash, pathname } = useLocation();

  // Keep track of the previous pathname to detect deep-page back actions
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');

      // Detect if we came from a completely different deep-dive route (/blog/:id or /projects/:id)
      const isComingBackFromDetails = prevPath !== '/' && pathname === '/';

      // Check if a global click flag was set by a navbar action
      const isNavbarClick = sessionStorage.getItem('nav_click') === 'true';

      const checkAndScroll = () => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          // SNAP INSTANTLY if backing out from details pages, otherwise smooth scroll on explicit nav clicks
          behavior: (isComingBackFromDetails && !isNavbarClick) ? 'instant' : 'smooth'
        });

        // Clear the session flag after execution completes
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
      // Direct homepage loads or route cleanups reset instantly to the top coordinate
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Always update tracking position for the next transition frame evaluation
    setPrevPath(pathname);
  }, [hash, pathname]); 

  return (
    <>
      <ScrollToTop /> 
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
        {/* Pass an action handler to your Navbar to flag an explicit menu click event */}
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