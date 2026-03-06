import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Competitions', path: '/competitions' },
  { label: 'Events', path: '/events' },
  { label: 'Department', path: '/department' },
  { label: 'Highlights', path: '/highlights' },
  { label: 'Blogs', path: '/blogs' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 38, height: 38, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #00d4ff, #0044aa)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'glow 2s ease-in-out infinite'
          }} />
          <Zap size={18} color="#000" style={{ position: 'relative', zIndex: 1 }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem',
            letterSpacing: 3, color: 'var(--accent-cyan)', lineHeight: 1
          }}>VSPARK</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: 'var(--text-secondary)', letterSpacing: 2, textTransform: 'uppercase'
          }}>COMSATS Vehari 2025</div>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '6px 14px',
              color: location.pathname === link.path ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderBottom: location.pathname === link.path ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { if (location.pathname !== link.path) e.target.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { if (location.pathname !== link.path) e.target.style.color = 'var(--text-secondary)' }}
          >
            {link.label}
          </Link>
        ))}
        <Link to="/register" className="btn-primary" style={{ marginLeft: 12, padding: '10px 20px', fontSize: '0.85rem' }}>
          Register Now
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 4 }}
        className="mobile-toggle"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0,
          background: 'rgba(2, 4, 8, 0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeInDown 0.3s ease'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem',
                letterSpacing: 2, textTransform: 'uppercase',
                padding: '12px 0',
                color: location.pathname === link.path ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/register" className="btn-primary" style={{ marginTop: 12, justifyContent: 'center' }}>
            Register Now
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) { .mobile-toggle { display: none !important; } }
        @media (max-width: 899px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  )
}
