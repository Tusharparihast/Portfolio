import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiInstagram, FiFacebook, FiX, FiCheckCircle } from 'react-icons/fi';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});

  // 🚀 BACKGROUND SCROLL LOCK PIPELINE
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function to prevent locking the body permanently if the component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();

    // 🛠️ Custom inline evaluation layer
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!message) newErrors.message = "Message cannot be empty";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop code stream execution
    }

    setErrors({});
    setIsSending(true);

    try {
      const response = await fetch('https://formspree.io/f/mwvdewab', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSending(false);
        setIsSent(true);
        e.target.reset(); // Clear form fields
        
        // Close modal automatically after 2 seconds
        setTimeout(() => {
          setIsSent(false);
          setIsOpen(false);
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setIsSending(false);
      alert('Oops! There was a problem submitting your form. Please try again.');
    }
  };

  // Helper helper to handle manual error cleanup when user types
  const handleInputChange = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* FLOATING GLASS CALL TO ACTION CARD */}
        <motion.div 
          className="w-full max-w-4xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-12 text-center mb-16 shadow-xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4">
            Let's build something intelligent together.
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base mb-8 leading-relaxed">
            Whether you want to discuss computer vision pipelines, machine learning architectures, or dynamic web development, my inbox is open.
          </p>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-95"
          >
            <FiMail size={18} /> Send an Email
          </button>
        </motion.div>

        {/* BOTTOM BRANDING & NAVIGATION LINKS */}
        <div className="w-full border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
          
          {/* Copyright text */}
          <div className="text-xs font-mono tracking-wider text-slate-500 order-2 sm:order-1">
            © {new Date().getFullYear()} // TUSHAR PARIHAST. ALL RIGHTS RESERVED.
          </div>

          {/* Core footprint networking hubs */}
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <a href="https://www.instagram.com/tus_rparihast/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="Instagram">
              <FiInstagram />
            </a>
            <a href="https://www.facebook.com/tushar.parihast.7" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="Facebook">
              <FiFacebook />
            </a>
            <a href="https://github.com/Tusharparihast" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="GitHub">
              <FiGithub />
            </a>
            <a href="https://www.linkedin.com/in/tushar-parihast-422107267/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 text-lg" title="LinkedIn">
              <FiLinkedin />
            </a>
            
            {/* Scroll back up anchor controller */}
            <button 
              onClick={scrollToTop}
              className="p-2 ml-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-200 border border-slate-700/50"
              aria-label="Scroll to top"
            >
              <FiArrowUp size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* POPUP MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            
            {/* Backdrop Dim Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSending && setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl relative p-6 md:p-8 overflow-hidden text-slate-100 z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                disabled={isSending}
              >
                <FiX size={18} />
              </button>

              {isSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <FiCheckCircle size={44} className="text-emerald-500 mb-4" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Message Dispatched!</h3>
                  <p className="text-xs text-slate-400 mt-1">Thanks for reaching out, I'll check it soon.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">Send a Message</h3>
                  </div>

                  {/* Added noValidate to bypass native browser alert prompts */}
                  <form onSubmit={handleFormSubmit} noValidate className="space-y-4 font-sans text-left">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1.5">Your Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        disabled={isSending}
                        onChange={() => handleInputChange('name')}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors disabled:opacity-50 ${
                          errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                        }`}
                        placeholder="John Doe" 
                      />
                      {errors.name && <p className="text-[11px] text-red-400 font-mono mt-1"> {errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1.5">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        disabled={isSending}
                        onChange={() => handleInputChange('email')}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors disabled:opacity-50 ${
                          errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                        }`}
                        placeholder="john@example.com" 
                      />
                      {errors.email && <p className="text-[11px] text-red-400 font-mono mt-1"> {errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1.5">Message</label>
                      <textarea 
                        name="message" 
                        rows="4" 
                        disabled={isSending}
                        onChange={() => handleInputChange('message')}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-none disabled:opacity-50 ${
                          errors.message ? 'border-red-500/80 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                        }`}
                        placeholder="Let's build something..." 
                      />
                      {errors.message && <p className="text-[11px] text-red-400 font-mono mt-1"> {errors.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm mt-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-mono tracking-wide uppercase"
                    >
                      {isSending ? 'Routing Stream...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}