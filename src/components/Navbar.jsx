import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const COMSATS_LOGO = 'https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d'
const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/competitions', label: 'Competitions' },
    { to: '/events', label: 'Events' },
    { to: '/highlights', label: 'Highlights' },
    { to: '/blogs', label: 'Blog' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: scrolled ? 'rgba(5, 10, 20, 0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 38, objectFit: 'contain', filter: 'brightness(1.1)' }} />
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, '@media (max-width: 768px)': { display: 'none' } }} className="nav-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 16px',
                textDecoration: 'none',
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                borderRadius: 8,
                background: location.pathname === link.to ? 'rgba(0,212,255,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
            <Zap size={15} />
            Register Now
          </Link>
          <img src={COMSATS_LOGO} alt="COMSATS" style={{ height: 36, objectFit: 'contain' }} />
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none' }}
            className="menu-btn"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
        }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                textDecoration: 'none',
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
