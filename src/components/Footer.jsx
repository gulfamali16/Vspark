/**
 * Footer.jsx — Premium light-theme footer
 * Clean white footer with structured grid, social links, bottom bar
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Globe, Instagram, Facebook, Zap, ArrowUpRight } from 'lucide-react'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

const QUICK_LINKS = [
  { to: '/competitions', label: 'Competitions' },
  { to: '/events',       label: 'Upcoming Events' },
  { to: '/register',     label: 'Register Free' },
  { to: '/highlights',   label: 'Highlights' },
  { to: '/blogs',        label: 'Blog & News' },
]

const COMPETITIONS_LIST = [
  'Speed Programming', 'Web Development', 'E-Gaming (FIFA/Tekken)',
  'UI/UX Design', 'Prompt Engineering', 'Quiz Competition', 'Poster Designing',
]

const CONTACT_ITEMS = [
  { Icon: MapPin, text: 'CUI Vehari, Adda Pir Murad, Vehari, Punjab, Pakistan' },
  { Icon: Mail,   text: 'hodcs@cuivehari.edu.pk' },
  { Icon: Globe,  text: 'ww2.comsats.edu.pk/cs_vhr' },
]

export default function Footer() {
  const linkStyle = {
    display:        'block',
    color:          '#6B7280',
    textDecoration: 'none',
    fontSize:       '14px',
    marginBottom:   '10px',
    transition:     'color 0.18s',
    fontWeight:     450,
  }

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '72px 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>

          {/* Brand */}
          <div>
            <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 40, marginBottom: 16, objectFit: 'contain' }} />
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.75, marginBottom: 20 }}>
              COMSATS University Islamabad, Vehari Campus — CS Department's premier national-level innovation competition.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { Icon: Facebook, href: 'https://web.facebook.com/people/Department-of-Computer-Science-CUI-Vehari/61582504795576/' },
                { Icon: Instagram, href: 'https://www.instagram.com/comsats_vehari_official/' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i} href={href} target="_blank" rel="noreferrer"
                  style={{ width: 36, height: 36, border: '1.5px solid #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', textDecoration: 'none', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151', marginBottom: 20 }}>Quick Links</h4>
            {QUICK_LINKS.map(l => (
              <Link key={l.to} to={l.to} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = '#4F46E5' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6B7280' }}
              >
                → {l.label}
              </Link>
            ))}
          </div>

          {/* Competitions */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151', marginBottom: 20 }}>Competitions</h4>
            {COMPETITIONS_LIST.map(c => (
              <p key={c} style={{ color: '#6B7280', fontSize: '14px', marginBottom: 8 }}>· {c}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151', marginBottom: 20 }}>Contact</h4>
            {CONTACT_ITEMS.map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <Icon size={15} style={{ color: '#4F46E5', marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #E5E7EB', padding: '24px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
            © 2025 VSpark — COMSATS University Islamabad, Vehari Campus. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} style={{ color: '#4F46E5' }} />
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Department of Computer Science</span>
            <Link to="/admin/login" style={{ color: '#D1D5DB', fontSize: '12px', textDecoration: 'none', marginLeft: 12 }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
