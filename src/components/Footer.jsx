import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Instagram, Globe, Zap } from 'lucide-react'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '80px 0 40px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 60 }}>
          {/* Brand */}
          <div>
            <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 44, marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 20 }}>
              COMSATS University Islamabad, Vehari Campus — Department of Computer Science's flagship technical innovation competition.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: <Instagram size={18} />, label: 'Instagram' },
                { icon: <Globe size={18} />, label: 'Web' },
              ].map(s => (
                <a key={s.label} href="#" style={{
                  width: 40, height: 40, border: '1px solid var(--border)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Quick Links</h3>
            {[
              { to: '/competitions', label: 'Competitions' },
              { to: '/events', label: 'Upcoming Events' },
              { to: '/register', label: 'Register' },
              { to: '/highlights', label: 'Highlights' },
              { to: '/blogs', label: 'Blog' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'block', color: 'var(--text-muted)', textDecoration: 'none',
                marginBottom: 10, fontSize: '0.9rem', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                → {link.label}
              </Link>
            ))}
          </div>

          {/* Competitions */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Competitions</h3>
            {['Speed Programming', 'Web Development', 'E-Gaming (FIFA/Tekken)', 'UI/UX Design', 'Prompt Engineering', 'Quiz Competition', 'Poster Designing'].map(c => (
              <p key={c} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>• {c}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <MapPin size={16} />, text: 'COMSATS University, Vehari Campus, Vehari, Punjab, Pakistan' },
                { icon: <Mail size={16} />, text: 'cs.vehari@comsats.edu.pk' },
                { icon: <Globe size={16} />, text: 'www.comsats.edu.pk' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, color: 'var(--text-muted)', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © 2025 VSpark — COMSATS University Islamabad, Vehari Campus. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Zap size={14} style={{ color: 'var(--primary)' }} />
            Department of Computer Science
          </div>
        </div>
      </div>
    </footer>
  )
}
