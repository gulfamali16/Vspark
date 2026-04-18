/**
 * Navbar.jsx — Premium light-theme navigation bar
 * Design: Clean white pill navbar with soft shadow, smooth scroll transition
 */
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const VSPARK_LOGO  = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'
const COMSATS_LOGO = 'https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d'

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/competitions', label: 'Competitions' },
  { to: '/events',       label: 'Events' },
  { to: '/highlights',   label: 'Highlights' },
  { to: '/blogs',        label: 'Blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const navStyle = {
    position:     'fixed',
    top:          0, left: 0, right: 0,
    zIndex:       500,
    padding:      scrolled ? '0 24px' : '8px 24px',
    background:   scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid #E5E7EB' : 'none',
    boxShadow:    scrolled ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
    transition:   'all 0.3s ease',
  }

  const linkStyle = (active) => ({
    padding:        '7px 14px',
    textDecoration: 'none',
    fontSize:       '14px',
    fontWeight:     active ? 600 : 500,
    color:          active ? '#4F46E5' : '#6B7280',
    background:     active ? '#EEF2FF' : 'transparent',
    borderRadius:   '8px',
    transition:     'all 0.18s ease',
    fontFamily:     'var(--font-body)',
  })

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 36, objectFit: 'contain' }} />
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={linkStyle(location.pathname === link.to)}
              onMouseEnter={e => { if (location.pathname !== link.to) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151' } }}
              onMouseLeave={e => { if (location.pathname !== link.to) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280' } }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '14px' }}>
            <Zap size={14} /> Register Free
          </Link>
          <img src={COMSATS_LOGO} alt="COMSATS" style={{ height: 32, objectFit: 'contain', opacity: 0.85 }} />
          <button
            onClick={() => setOpen(!open)}
            className="menu-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'none', padding: 4 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 24px 20px', animation: 'slideDown 0.2s ease' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                display:        'block',
                padding:        '12px 4px',
                textDecoration: 'none',
                color:          location.pathname === link.to ? '#4F46E5' : '#374151',
                fontWeight:     location.pathname === link.to ? 600 : 500,
                fontSize:       '15px',
                borderBottom:   '1px solid #F3F4F6',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/register" className="btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            <Zap size={14} /> Register Free
          </Link>
        </div>
      )}
    </nav>
  )
}
