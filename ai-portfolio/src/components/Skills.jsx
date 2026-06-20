import { motion } from 'framer-motion';
import { 
  FiTerminal, 
  FiCpu, 
  FiPieChart, 
  FiLayout, 
  FiDatabase, 
  FiSliders 
} from 'react-icons/fi';

export default function Skills() {
  const techStack = [
    {
      title: "Languages",
      icon: <FiTerminal className="text-slate-800" size={20} />,
      skills: ["Python", "C", "C++", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"]
    },
    {
      title: "AI / ML",
      icon: <FiCpu className="text-blue-600" size={20} />,
      skills: ["PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV", "YOLO"]
    },
    {
      title: "Data Intelligence",
      icon: <FiPieChart className="text-purple-600" size={20} />,
      skills: ["Pandas", "NumPy", "Matplotlib", "Data Visualization", "Exploratory Data Analysis"]
    },
    {
      title: "Frontend Engineering",
      icon: <FiLayout className="text-cyan-600" size={20} />,
      skills: ["React", "React Native", "Vite", "Tailwind CSS"]
    },
    {
      title: "Databases & Storage",
      icon: <FiDatabase className="text-indigo-600" size={20} />,
      skills: ["PostgreSQL", "MySQL", "Supabase"]
    },
    {
      title: "Tools & Ecosystem",
      icon: <FiSliders className="text-orange-600" size={20} />,
      skills: ["Git", "GitHub", "Linux", "Docker", "VS Code", "Jupyter", "Colab"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 }
    }
  };

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-slate-100">
      {/* Section Header */}
      <div className="mb-16 text-center lg:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 block mb-2">
          Ecosystem
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Technical Stack
        </h2>
      </div>

      {/* Grid Layout Matrix */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {techStack.map((category, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/40 flex flex-col gap-4"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200/50 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                {category.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight font-mono">
                {category.title}
              </h3>
            </div>

            {/* Tech Pills */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {category.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-2.5 py-1 bg-white border border-slate-200/40 text-slate-600 text-[11px] font-medium font-mono rounded-md transition-all duration-200 hover:border-blue-400 hover:text-blue-600 select-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}