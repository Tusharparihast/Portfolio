import { useState, useEffect } from "react";

export default function About() {
  // 1. Setup the words you want to rotate through
  const words = ["AI Undergraduate", "Learner", "Developer", "Problem Solver"];
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
          Hi! I am a final-year AI undergraduate at Kathmandu University specializing in computer vision, automation, and real-world problem-solving. Active hackathon competitor and multi-year student leader, I combine software engineering and machine learning to build intelligent systems with practical impact.
        </p>
      </div>

    </section>
  );
}