import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#02040c', borderTop: '1px solid rgba(0,212,255,0.1)', padding: '4rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* ── Logos column ── */}
          <div>
            {/* Two logos side by side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {/* CS Department logo */}
              <img
                src="/images/csdep.png"
                alt="CS Department"
                style={{ height: 52, width: 'auto', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Divider line */}
              <div style={{ width: 1, height: 44, background: 'rgba(0,212,255,0.2)' }} />
              {/* VSpark footer logo */}
              <img
                src="/images/vspark-footer.png"
                alt="VSpark"
                style={{ height: 52, width: 'auto', objectFit: 'contain' }}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Text fallback for vspark footer logo */}
              <span style={{ display: 'none', fontFamily: 'Bebas Neue,cursive', fontSize: '1.6rem', letterSpacing: 3, color: '#e8eaf6' }}>
                V<span style={{ color: '#00d4ff' }}>SPARK</span>
              </span>
            </div>

            <p style={{ color: '#8892b0', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              COMSATS University Islamabad, Vehari Campus — CS Department's premier national-level innovation event.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 34, height: 34,
                  border: '1px solid rgba(0,212,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00d4ff', textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '1rem', letterSpacing: 2, color: '#00d4ff', marginBottom: '1rem' }}>Quick Links</h4>
            {[
              ['/', 'Home'],
              ['/competitions', 'Competitions'],
              ['/events', 'Events'],
              ['/highlights', 'Highlights'],
              ['/blogs', 'Blogs'],
              ['/department', 'CS Department'],
            ].map(([path, label]) => (
              <Link key={path} to={path} style={{
                display: 'block', color: '#8892b0', textDecoration: 'none',
                marginBottom: 7, fontSize: '0.88rem', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#00d4ff'}
                onMouseLeave={e => e.target.style.color = '#8892b0'}
              >→ {label}</Link>
            ))}
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '1rem', letterSpacing: 2, color: '#00d4ff', marginBottom: '1rem' }}>Contact</h4>
            {[
              [MapPin, 'COMSATS University Islamabad, Vehari Campus'],
              [Mail,   'vspark@cuivehari.edu.pk'],
              [Phone,  '+92-67-XXXXXXX'],
            ].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <Icon size={14} style={{ color: '#00d4ff', marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: '#8892b0', fontSize: '0.84rem', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="neon-divider" style={{ marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: '#8892b0', fontSize: '0.78rem' }}>
            © VSpark — COMSATS University Islamabad, Vehari Campus. All rights reserved.
          </p>
          <Link to="/admin/login" style={{ color: 'rgba(0,212,255,0.3)', fontSize: '0.72rem', textDecoration: 'none', fontFamily: 'JetBrains Mono' }}>
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}