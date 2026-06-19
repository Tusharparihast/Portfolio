import { motion } from 'framer-motion';
import { FiBookOpen, FiAward } from 'react-icons/fi';

export default function TimelineAndCards() {
  const education = [
    {
      title: "B.Tech in Artificial Intelligence",
      organization: "Kathmandu University",
      duration: "2022 - Present",
      description: "Exploring the intersection of Computer Vision, Machine Learning, and Intelligent Automation through research-driven projects and collaborative leadership."
    },
    {
      title: "Higher Secondary Education (+2 Science)",
      organization: "United Academy",
      duration: "2020 - 2022",
      description: "Advanced coursework in physics, mathematics, and computer science fundamentals."
    },
    {
      title: "Secondary Education Examination (SEE)",
      organization: "Suryodaya Secondary School",
      duration: "2021",
      description: "Completed secondary education foundations with an emphasis on science and mathematical disciplines."
    }
  ];

  const achievements = [
    {
      type: "Leadership",
      title: "Core Member / Organizer @ KUAIC",
      desc: "Led project calls, managed registrations, and coordinated demonstration stalls for the annual AI Conclave, bringing together tech enthusiasts and national AI projects.",
      tag: "2025 - 2026"
    },
    {
      type: "Hackathon",
      title: "National Level AI Hackathon",
      desc: "Developed a computer vision pipeline within a 48-hour sprint. Implemented real-time image processing models to analyze frame extractions and isolate spatial coordinates.",
      tag: "Python & OpenCV"
    },
    {
      type: "Contribution",
      title: "University Magazine Article Author",
      desc: "Authored a formal, statistics-driven piece on the perspective and future deployment of Artificial Intelligence within Nepalese school ecosystems.",
      tag: "Editorial"
    },
    {
      type: "Volunteering",
      title: "Tech Conclave Organizing Team",
      desc: "Volunteered across multi-day events to streamline project demonstrations, manage technical infrastructure, and coordinate guest tracks.",
      tag: "Leadership"
    }
  ];

  return (
    <section id="journey" className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto bg-white">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: ACADEMICS & TIMELINE */}
        <div className="lg:col-span-5">
          {/* UPDATED HEADER ICON: Swapped FiActivity for FiBookOpen */}
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-2">
            <FiBookOpen className="text-blue-600" /> Education
          </h3>
          
          <div className="relative border-l-2 border-slate-100 pl-6 space-y-10">
            {education.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Bullet Anchor */}
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-50 z-10" />
                
                <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {item.duration}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2">{item.title}</h4>
                <p className="text-sm font-medium text-slate-500 mb-2">{item.organization}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: HACKATHONS, ROLES & ACHIEVEMENTS */}
        <div className="lg:col-span-7">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-2">
            <FiAward className="text-blue-600" /> Achievements & Experiences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    {item.type}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                
                <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 w-fit px-2.5 py-1 rounded-md shadow-2xs">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}