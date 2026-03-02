import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(5,8,16,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,212,255,0.15)' : 'none',
      transition: 'all 0.3s',
      padding: '0 2rem',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: '#fff',
            fontFamily: 'Bebas Neue, cursive', letterSpacing: 1
          }}>VS</div>
          <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.6rem', letterSpacing: 3, color: '#e8eaf6' }}>
            V<span style={{ color: '#00d4ff' }}>SPARK</span>
            <span style={{ fontSize: '0.9rem', color: '#ff6b00', marginLeft: 6 }}>2025</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '8px 16px',
              textDecoration: 'none',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: 1,
              color: location.pathname === l.to ? '#00d4ff' : '#8892b0',
              borderBottom: location.pathname === l.to ? '2px solid #00d4ff' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if(location.pathname !== l.to) e.target.style.color='#e8eaf6'; }}
            onMouseLeave={e => { if(location.pathname !== l.to) e.target.style.color='#8892b0'; }}>
              {l.label}
            </Link>
          ))}
          <Link to="/register" className="btn-neon" style={{ marginLeft: 8, textDecoration: 'none', fontSize: '0.9rem', padding: '8px 20px' }}>
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', display: 'none' }} className="mobile-toggle">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(5,8,16,0.98)', borderTop: '1px solid rgba(0,212,255,0.15)',
          padding: '1rem 2rem 2rem',
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 0',
              textDecoration: 'none', color: location.pathname === l.to ? '#00d4ff' : '#8892b0',
              fontWeight: 600, fontSize: '1.1rem', borderBottom: '1px solid rgba(0,212,255,0.08)'
            }}>{l.label}</Link>
          ))}
          <Link to="/register" onClick={() => setOpen(false)} className="btn-neon" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none' }}>Register Now</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
