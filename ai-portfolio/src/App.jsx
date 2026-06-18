import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [loading, setLoading] = useState(true);

  // CRITICAL FIX: Kill the browser's scroll memory before components mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force a structural fallback jump to the absolute top coordinates
    window.scrollTo(0, 0);
  }, []);

  // SECONDARY FIX: Force scroll alignment the exact instant the welcome loader finishes
  const handleWelcomeComplete = () => {
    setLoading(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  };

  return (
    <Router>
      <ScrollToTop /> 

      {loading && <WelcomeScreen onDone={handleWelcomeComplete} />}

      <main className="relative min-h-screen w-full selection:bg-blue-500 selection:text-white bg-white">
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
    </Router>
  );
}