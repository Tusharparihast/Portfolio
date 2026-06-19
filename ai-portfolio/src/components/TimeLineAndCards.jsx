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
      type: "Hackathons & Innovation",
      title: "National Hackathons & Datathons",
      // Highlighted the explicit text inline via standard JSX markup
      desc: (
        <>
          Built AI-driven solutions including First Runner-Up at Aaviskar 2025 (Dementia Robot) and selected Top 20 at <span className="font-extrabold text-slate-900">eSewa Hackathon - 2026</span>.
        </>
      ),
      tag: "AI • Problem Solving • Rapid Prototyping"
    },
    {
      type: "Building Nepal's AI Community",
      title: "Core Contributor, KUAIC",
      desc: (
        <>
          Contributed to organizing technical events, workshops, and the <span className="font-extrabold text-slate-900">country's first student-led AI Hackathon</span> to grow the tech ecosystem.
        </>
      ),
      tag: "Community Building • Teamwork"
    },
    {
      type: "Research & Dataset Development",
      title: "Field Research & Data Collection",
      desc: "Experienced in real-world dataset creation, including farm visits, manual collection, data annotation, and preprocessing pipelines.",
      tag: "Research • Dataset Curation • Data Analytics"
    },
    {
      type: "Student Leadership",
      title: "Class Representative (2022 – Present)",
      desc: "Serving as the core student-to-faculty liaison for 3+ years managing communications, concerns, and orientation events.",
      tag: "Leadership • Communication • Coordination"
    },
    {
      type: "Best Volunteer & Operations Lead",
      title: "AI Crusade 2023 & Operations",
      desc: "Recognized as Best Volunteer. Served twice as Stall Lead managing sponsor logistics, volunteer deployments, and event execution.",
      tag: "Leadership • Operations • Event Management"
    },
    {
      type: "Knowledge Sharing & Peer Support",
      title: "Guiding Future AI Learners",
      desc: "Supporting classmates and juniors with curated machine learning learning resources, project guidance, and tech roadmaps.",
      tag: "Mentorship • Continuous Learning"
    }
  ];

  return (
    <section id="journey" className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto bg-white space-y-24">
      
      {/* 1. TOP TRACK: ACADEMICS & TIMELINE */}
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-12 flex items-center gap-2">
          <FiBookOpen className="text-blue-600" /> Education
        </h3>
        
        <div className="relative border-l-2 border-slate-100 pl-6 space-y-10">
          {education.map((item, idx) => (
            <div key={idx} className="relative group">
              
              {/* BOOK-OPENING SCROLL ANIMATION ANCHOR */}
              <motion.span 
                className="absolute -left-[38px] top-1 bg-white border-2 border-blue-600 p-1.5 rounded-full z-10 flex items-center justify-center shadow-sm text-blue-600"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 140, 
                  damping: 15, 
                  delay: idx * 0.15 
                }}
              >
                <FiBookOpen size={14} className="transform group-hover:scale-110 transition-transform duration-200" />
              </motion.span>
              
              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {item.duration}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors duration-200">
                {item.title}
              </h4>
              <p className="text-sm font-medium text-slate-500 mb-2">{item.organization}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BOTTOM TRACK: MINIMAL ACHIEVEMENTS & EXPERIENCES */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-10 flex items-center gap-2">
          <FiAward className="text-blue-600" /> Achievements & Experiences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-slate-50/60 rounded-xl border border-slate-100 shadow-2xs hover:shadow-sm hover:border-slate-200/80 hover:bg-white transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {item.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h4>
                <div className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">
                  {item.desc}
                </div>
              </div>
              
              <div className="w-fit max-w-full">
                <span className="block text-[11px] font-semibold font-mono text-slate-700 bg-white border border-slate-200/80 px-2.5 py-1 rounded-md shadow-3xs truncate">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}