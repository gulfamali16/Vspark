import { Link } from 'react-router-dom'
import { Zap, Mail, Instagram, ExternalLink, MapPin, Calendar } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '60px 0 30px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-gold), var(--accent-cyan), transparent)',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
          marginBottom: 50,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42,
                background: 'linear-gradient(135deg, #00d4ff, #0044aa)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Zap size={20} color="#000" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', letterSpacing: 3, color: 'var(--accent-cyan)' }}>VSPARK</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: 2 }}>2025</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              National-level coding competition & tech innovation showcase at COMSATS University Islamabad, Vehari Campus.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Instagram size={20} />
              </a>
              <a href="mailto:vspark@comsats.edu.pk" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Mail size={20} />
              </a>
              <a href="https://comsats.edu.pk" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: 3, color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase', fontSize: '0.95rem' }}>Quick Links</h4>
            {['/', '/competitions', '/events', '/department', '/highlights', '/blogs', '/register'].map((path, i) => {
              const labels = ['Home', 'Competitions', 'Events', 'Department', 'Highlights', 'Blogs', 'Register']
              return (
                <Link key={path} to={path} style={{
                  display: 'block', color: 'var(--text-muted)', textDecoration: 'none',
                  fontSize: '0.9rem', marginBottom: 8, letterSpacing: 1,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  → {labels[i]}
                </Link>
              )
            })}
          </div>

          {/* Event Info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: 3, color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase', fontSize: '0.95rem' }}>Event Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Calendar size={16} color="var(--accent-cyan)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Event Date</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>December 10, 2025</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--accent-gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Venue</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>COMSATS University Islamabad<br />Vehari Campus</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Mail size={16} color="var(--accent-green)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Contact</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>vspark@comsats.edu.pk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: 3, color: 'var(--text-primary)', marginBottom: 16, textTransform: 'uppercase', fontSize: '0.95rem' }}>Organized By</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d"
                  alt="COMSATS Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>COMSATS University Islamabad<br />Vehari Campus</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5"
                  alt="VSpark Logo" style={{ width: 80, height: 40, objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap', gap: 12,
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © 2025 VSpark — COMSATS Vehari CS Department. All rights reserved.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Built with <span style={{ color: 'var(--accent-cyan)' }}>React</span> + <span style={{ color: 'var(--accent-gold)' }}>Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
