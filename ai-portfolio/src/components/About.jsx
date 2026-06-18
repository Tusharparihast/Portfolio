import { useState, useEffect } from "react";

export default function About() {
  // 1. Setup the words you want to rotate through
  const words = ["AI Undergraduate", "Learner", "Developer"];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. Typewriter animation loop logic
  useEffect(() => {
    const fullText = words[currentWordIdx];
    const typeSpeed = isDeleting ? 40 : 80; // Speed flags for typing/deleting
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Add a letter from left to right
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        
        // Once full word is typed, pause briefly before deleting
        if (displayedText === fullText) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        // Remove a letter from right to left
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        
        // Once completely cleared, move to the next title string
        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIdx]);

  return (
    <section 
      id="about" 
      className="relative min-h-screen py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center justify-center"
    >
      
      {/* PROFILE ANCHOR SECTION */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 mb-16">
        
        {/* Profile Image Wrapper */}
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-slate-200 border-4 border-white shadow-xl overflow-hidden relative flex-shrink-0">
          <img 
            src="/profile.png" 
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name Heading Block - Force-Centered on all screen sizes */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            Tushar Parihast
          </h2>
          
          {/* Animated Sub-heading stream (Forced to center on all viewports) */}
          <div className="text-slate-500 font-medium tracking-wide min-h-[1.5em] flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {displayedText}
            </span>
            {/* Blinking cursor mimic effect */}
            <span className="animate-pulse ml-0.5 font-normal text-blue-600">|</span>
          </div>
        </div>

      </div>

      {/* EDITORIAL ABOUT ME SECTION WITH SKILL HOVER TOOLTIPS */}
      <div className="w-full max-w-3xl mt-6">
        <p className="text-xl md:text-2xl text-slate-700 font-normal leading-relaxed text-center lg:text-left">
          I am an AI practitioner passionate about machine vision and spatial intelligence frameworks. 
          Currently diving deep into architectural modeling, specializing in building production pipelines inside native 
          <span className="relative inline-block mx-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold border border-blue-100 cursor-help group transition-all">
            Ubuntu
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none font-normal normal-case leading-normal z-50">
              Primary development environment configuration for highly optimized computing and GPU interfacing.
            </span>
          </span> 
          ecosystems. Using tools like 
          <span className="relative inline-block mx-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-semibold border border-indigo-100 cursor-help group transition-all">
            Python
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none font-normal normal-case leading-normal z-50">
              Core language framework utilized to write models, statistical evaluation modules, and custom endpoints.
            </span>
          </span> 
          and 
          <span className="relative inline-block mx-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold border border-emerald-100 cursor-help group transition-all">
            OpenCV
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none font-normal normal-case leading-normal z-50">
              Leveraged extensively to perform anatomical tracking transformations, contour isolating parsing, and frame extractions.
            </span>
          </span>, I design systems that translate raw pixels into deployable quantitative analytics.
        </p>
      </div>

    </section>
  );
}