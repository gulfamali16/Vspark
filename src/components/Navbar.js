import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/events', label: 'Events' },
  { to: '/highlights', label: 'Highlights' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/department', label: 'CS Dept' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || open ? 'glass shadow-sm py-1' : 'bg-transparent py-2'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <img src="/images/vspark.png" alt="VSpark" className="h-14 md:h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {links.map((l) => {
              const isActive = loc.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-[15px] font-sora transition-colors ${isActive
                      ? 'text-primary-600 font-bold'
                      : (loc.pathname === '/' && !scrolled && !open)
                        ? 'text-white hover:text-primary-300'
                        : 'text-gray-600 font-semibold hover:text-primary-500'
                    }`}
                >
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-primary-500 rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              to="/login"
              className={`font-sora font-bold text-sm transition-colors ${(loc.pathname === '/' && !scrolled && !open) ? 'text-white hover:text-primary-300' : 'text-gray-700 hover:text-primary-600'
                }`}
            >
              Log in
            </Link>
            <Link to="/register" className="btn-primary py-2.5 px-6 font-sora font-bold text-sm flex items-center gap-2 group">
              Register Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-primary-600 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Navigation"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl lg:hidden pt-28 px-6 pb-6 overflow-y-auto flex flex-col"
          >
            <div className="flex-1 flex flex-col gap-4">
              {links.map((l, i) => {
                const isActive = loc.pathname === l.to;
                return (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={l.to}
                      className={`block text-2xl font-sora font-bold transition-colors ${isActive ? 'text-primary-600' : 'text-gray-800'
                        }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-8"
            >
              <Link to="/login" className="btn-outline w-full justify-center font-sora font-bold py-4 text-base">
                Log In
              </Link>
              <Link to="/register" className="btn-primary w-full justify-center font-sora font-bold py-4 text-base">
                Register Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}