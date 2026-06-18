import { FiBookOpen, FiAward, FiUsers, FiActivity } from 'react-icons/fi';

export default function TimelineAndCards() {
  const educationAndRoles = [
    {
      title: "Undergraduate AI Student & Researcher",
      organization: "Kathmandu University",
      duration: "2023 - Present",
      description: "Focusing on advanced mathematics, vector calculus, and machine vision. Actively researching applied AI solutions, including structural detection and deep learning pipelines.",
      icon: <FiBookOpen className="text-blue-600" size={20} />
    },
    {
      title: "Core Member / Organizer",
      organization: "KU Artificial Intelligence Club (KUAIC)",
      duration: "2025 - 2026",
      description: "Led project calls, managed registrations, and coordinated demonstration stalls for the annual AI Conclave, bringing together tech enthusiasts and national AI projects.",
      icon: <FiUsers className="text-blue-600" size={20} />
    }
  ];

  const achievements = [
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
        
        {/* LEFT COLUMN: ACADEMICS & TIMELINE (Takes 5 cols on large screens) */}
        <div className="lg:col-span-5">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-2">
            <FiActivity className="text-blue-600" /> Education & Roles
          </h3>
          
          <div className="relative border-l-2 border-slate-100 pl-6 space-y-10">
            {educationAndRoles.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Bullet Anchor */}
                <span className="absolute -left-[35px] top-1 bg-blue-50 border-2 border-blue-600 p-1.5 rounded-full z-10">
                  {item.icon}
                </span>
                
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

        {/* RIGHT COLUMN: HACKATHONS & ACHIEVEMENTS (Takes 7 cols on large screens) */}
        <div className="lg:col-span-7">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-2">
            <FiAward className="text-blue-600" /> Achievements & Impact
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