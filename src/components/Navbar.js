import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/',             label: 'Home' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/events',       label: 'Events' },
  { to: '/highlights',   label: 'Highlights' },
  { to: '/blogs',        label: 'Blogs' },
  { to: '/department',   label: 'CS Dept' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || open ? 'rgba(5,8,16,0.98)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
        borderBottom: scrolled || open ? '1px solid rgba(0,212,255,0.12)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64, padding: '0 1.25rem',
        }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/images/vspark.png"
              alt="VSpark"
              style={{ height: 38, width: 'auto', objectFit: 'contain' }}
              onError={e => {
                // Fallback to text if image not found
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Text fallback */}
            <span style={{ display: 'none', fontFamily: 'Bebas Neue,cursive', fontSize: '1.4rem', letterSpacing: 3, color: '#e8eaf6' }}>
              V<span style={{ color: '#00d4ff' }}>SPARK</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 12px', textDecoration: 'none',
                fontFamily: 'Rajdhani,sans-serif', fontWeight: 600,
                fontSize: '0.88rem', letterSpacing: 1,
                color: loc.pathname === l.to ? '#00d4ff' : '#8892b0',
                borderBottom: loc.pathname === l.to ? '2px solid #00d4ff' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (loc.pathname !== l.to) e.target.style.color = '#e8eaf6'; }}
                onMouseLeave={e => { if (loc.pathname !== l.to) e.target.style.color = '#8892b0'; }}
              >{l.label}</Link>
            ))}
            <Link to="/login"    className="btn-neon"            style={{ marginLeft: 8, fontSize: '0.82rem', padding: '7px 16px', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="btn-neon btn-orange" style={{ marginLeft: 4, fontSize: '0.82rem', padding: '7px 16px', textDecoration: 'none' }}>Register</Link>
          </div>

          {/* ── Hamburger ── */}
          <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} style={{
            display: 'none', background: 'none', border: 'none',
            color: '#00d4ff', cursor: 'pointer', padding: 8,
            alignItems: 'center', justifyContent: 'center',
          }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(5,8,16,0.98)',
          display: 'flex', flexDirection: 'column',
          paddingTop: 64, overflowY: 'auto',
        }}>
          <div style={{ padding: '1.5rem 1.5rem 2rem', flex: 1 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', textDecoration: 'none',
                color: loc.pathname === l.to ? '#00d4ff' : '#e8eaf6',
                fontFamily: 'Bebas Neue,cursive', fontSize: '1.4rem', letterSpacing: 3,
                borderBottom: '1px solid rgba(0,212,255,0.07)',
              }}>
                {l.label}
                {loc.pathname === l.to && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />}
              </Link>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '2rem' }}>
              <Link to="/login"    className="btn-neon"            style={{ textDecoration: 'none', textAlign: 'center', fontSize: '1rem', padding: '14px' }}>Login</Link>
              <Link to="/register" className="btn-neon btn-orange" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '1rem', padding: '14px' }}>Register Now</Link>
            </div>
          </div>
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,212,255,0.08)', textAlign: 'center' }}>
            <p style={{ color: '#8892b0', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>
              VSpark — COMSATS University Islamabad, Vehari Campus
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nav-mobile-toggle { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
      `}</style>
    </>
  );
}