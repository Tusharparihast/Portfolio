import { useState } from 'react';
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
import WelcomeScreen from './components/WelcomeScreen'; // Your CatSplash component

function MainDashboard() {
  return (
    <div id="top">
      <Hero />
      <About />
      <Projects />
      <BlogMarquee />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <ScrollToTop /> 

      {/* FIX 1: Changed prop from onComplete to onDone to match your component internal hook */}
      {loading && <WelcomeScreen onDone={() => setLoading(false)} />}

      <main className="relative min-h-screen w-full selection:bg-blue-500 selection:text-white bg-white">
        
        {/* FIX 2: Removed !loading so the Navbar renders beautifully underneath the overlay immediately */}
        <Navbar />

        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
          </Routes>
        </div>

        {/* FIX 3: Removed !loading so the Footer renders beautifully in your static DOM tree layout */}
        <Footer />
      </main>
    </Router>
  );
}