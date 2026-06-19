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
  const { hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');

      const checkAndSnap = () => {
        const element = document.getElementById(targetId);
        if (!element) return false;
        
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant'
        });
        return true;
      };

      // Poll every 30ms only if immediate execution fails, clearing itself when done
      if (!checkAndSnap()) {
        const checkInterval = setInterval(() => {
          if (checkAndSnap()) clearInterval(checkInterval);
        }, 30);
        return () => clearInterval(checkInterval);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [hash]); 

  return (
    <>
      <ScrollToTop /> 
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar />
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