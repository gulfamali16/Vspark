import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, Trophy, Code, Gamepad2, Palette,
  Zap, Brain, Star, ArrowRight, Users, Calendar,
  Award, Linkedin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBg from '../components/ParticlesBg';

const stats = [
  { icon: Users,    value: '500+', label: 'Participants' },
  { icon: Trophy,   value: '20+',  label: 'Awards' },
  { icon: Calendar, value: '1',    label: 'Epic Day' },
  { icon: Award,    value: '7+',   label: 'Competitions' },
];

const compList = [
  { icon: Code,     title: 'Speed Programming', fee: 300,  color: '#00d4ff' },
  { icon: Gamepad2, title: 'E-Gaming',           fee: 200,  color: '#7c3aed' },
  { icon: Code,     title: 'Web Development',    fee: 350,  color: '#ff6b00' },
  { icon: Palette,  title: 'UI/UX Design',       fee: 250,  color: '#ffd700' },
  { icon: Brain,    title: 'Prompt Engineering', fee: 200,  color: '#00ff88', isNew: true },
  { icon: Star,     title: 'CS Quiz',            fee: 150,  color: '#ff3d77' },
  { icon: Palette,  title: 'Poster Design',      fee: 200,  color: '#00d4ff' },
];

// ── Team data ─────────────────────────────────────────────
const team = {
  lead: {
    name: 'Muhammad Abdullah',
    role: 'Team Lead',
    image: '/images/abdullah-sir.png',
    linkedin: 'https://www.linkedin.com/in/abdullahwale/',
    color: '#ffd700',
  },
  developers: [
    {
      name: 'Gulfam Ali',
      role: 'Developer',
      image: '/images/gulfam-ali.png',
      linkedin: 'https://www.linkedin.com/in/gulfam-a1i/',
      color: '#00d4ff',
    },
    {
      name: 'Ali Hassan',
      role: 'Developer',
      image: '/images/ali-hassan.png',
      linkedin: 'https://www.linkedin.com/in/ali-hassan-45b9b53b0/',
      color: '#7c3aed',
    },
  ],
};

// ── Team Member Card ──────────────────────────────────────
function TeamCard({ member, isLead = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: isLead ? '2.5rem 2rem' : '2rem 1.5rem',
        background: hovered
          ? `linear-gradient(135deg, rgba(${member.color === '#ffd700' ? '255,215,0' : member.color === '#00d4ff' ? '0,212,255' : '124,58,237'},0.08) 0%, rgba(5,8,16,0.9) 100%)`
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? member.color + '50' : 'rgba(0,212,255,0.12)'}`,
        borderTop: `3px solid ${member.color}`,
        transition: 'all 0.35s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 60px ${member.color}18` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${member.color}15 0%, transparent 70%)`,
        transition: 'opacity 0.3s',
        opacity: hovered ? 1 : 0,
      }} />

      {/* Lead badge */}
      {isLead && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '2px 10px',
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid rgba(255,215,0,0.35)',
          color: '#ffd700',
          fontSize: '0.6rem', fontFamily: 'JetBrains Mono', letterSpacing: 2,
        }}>TEAM LEAD</div>
      )}

      {/* Profile image */}
      <div style={{
        width: isLead ? 110 : 88,
        height: isLead ? 110 : 88,
        borderRadius: '50%',
        border: `3px solid ${member.color}60`,
        boxShadow: hovered ? `0 0 24px ${member.color}40` : 'none',
        overflow: 'hidden',
        marginBottom: '1.25rem',
        transition: 'all 0.3s',
        background: 'rgba(255,255,255,0.04)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <img
          src={member.image}
          alt={member.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentElement.style.display = 'flex';
            e.target.parentElement.style.alignItems = 'center';
            e.target.parentElement.style.justifyContent = 'center';
            e.target.parentElement.innerHTML = `<span style="font-family:Bebas Neue,cursive;font-size:2rem;color:${member.color}">${member.name.charAt(0)}</span>`;
          }}
        />
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: 'Bebas Neue,cursive',
        fontSize: isLead ? '1.35rem' : '1.15rem',
        letterSpacing: 2, color: '#e8eaf6',
        marginBottom: 4, textAlign: 'center',
        position: 'relative', zIndex: 1,
      }}>{member.name}</h3>

      {/* Role */}
      <p style={{
        color: member.color, fontSize: '0.75rem',
        fontFamily: 'JetBrains Mono', letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: '1.25rem',
        position: 'relative', zIndex: 1,
      }}>{member.role}</p>

      {/* LinkedIn button */}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 18px',
          background: hovered ? `${member.color}18` : 'transparent',
          border: `1px solid ${member.color}45`,
          color: member.color,
          textDecoration: 'none',
          fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 700,
          letterSpacing: 1, transition: 'all 0.2s',
          position: 'relative', zIndex: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${member.color}30`; }}
        onMouseLeave={e => { e.currentTarget.style.background = hovered ? `${member.color}18` : 'transparent'; }}
      >
        <Linkedin size={13} /> LinkedIn
      </a>
    </div>
  );
}

export default function Home() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      <ParticlesBg />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        padding: '8rem 1.5rem 4rem',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0, pointerEvents: 'none' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: i * 260, height: i * 260,
              border: `1px solid rgba(0,212,255,${0.07 - i * 0.02})`,
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
              animation: `rotate ${15 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
          <h1 style={{
            fontFamily: 'Bebas Neue,cursive',
            fontSize: 'clamp(5rem,20vw,12rem)',
            lineHeight: 0.88, letterSpacing: '0.02em', marginBottom: '0.5rem',
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.2s',
          }}>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#fff 30%,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>V</span>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SPARK</span>
          </h1>

          <div style={{ opacity: vis ? 1 : 0, transition: 'opacity 0.8s', marginBottom: '1.25rem' }}>
            <span className="tag">COMSATS University Islamabad • Vehari Campus</span>
          </div>

          <p style={{
            color: '#8892b0', maxWidth: 560, margin: '1.25rem auto 2.5rem',
            lineHeight: 1.8, fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', fontWeight: 500,
            opacity: vis ? 1 : 0, transition: 'all 0.8s ease 0.6s', padding: '0 0.5rem',
          }}>
            National-level coding competition and innovation showcase —{' '}
            <span style={{ color: '#00d4ff' }}>COMSATS Vehari Campus</span>.
            Speed programming, e-gaming, web dev, AI prompting and more.
          </p>

          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            opacity: vis ? 1 : 0, transition: 'all 0.8s ease 0.8s', padding: '0 1rem',
          }}>
            <Link to="/register"     className="btn-neon"            style={{ textDecoration: 'none', fontSize: '1rem', padding: '13px 32px' }}>Register Now</Link>
            <Link to="/competitions" className="btn-neon btn-orange" style={{ textDecoration: 'none', fontSize: '1rem', padding: '13px 32px' }}>Explore Events</Link>
          </div>

          <div style={{ marginTop: '3.5rem', animation: 'float 3s ease-in-out infinite' }}>
            <ChevronDown size={26} style={{ color: 'rgba(0,212,255,0.4)' }} />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem', background: 'rgba(0,212,255,0.02)', borderTop: '1px solid rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem 1rem' }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <Icon size={24} style={{ color: '#00d4ff', marginBottom: 8 }} />
              <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(2rem,8vw,3rem)', color: '#fff', lineHeight: 1, letterSpacing: 2 }}>{value}</div>
              <div style={{ color: '#8892b0', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.75rem', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPETITIONS PREVIEW ─────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>What to Expect</span>
            <h2 className="section-title" style={{ display: 'block' }}>Competitions</h2>
            <p style={{ color: '#8892b0', maxWidth: 480, margin: '0.75rem auto 0', lineHeight: 1.7, fontSize: '0.95rem', padding: '0 1rem' }}>
              Seven high-stakes categories — each with prizes and internship opportunities
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
            {compList.map(({ icon: Icon, title, fee, color, isNew }, i) => (
              <div key={i} className="glass" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,${color}20 0%,transparent 70%)` }} />
                <div style={{ width: 40, height: 40, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '1.2rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 4 }}>{title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#ffd700', letterSpacing: 1 }}>PKR {fee}</span>
                  {isNew && <span style={{ padding: '1px 7px', background: `${color}20`, color, fontSize: '0.62rem', fontFamily: 'JetBrains Mono', border: `1px solid ${color}40` }}>NEW</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/competitions" className="btn-neon" style={{ textDecoration: 'none', fontSize: '0.95rem' }}>
              View All Details <ArrowRight size={13} style={{ display: 'inline', marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP ───────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg,rgba(0,212,255,0.04) 0%,rgba(124,58,237,0.04) 100%)', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Zap size={40} style={{ color: '#ffd700', marginBottom: '1.25rem' }} />
          <h2 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Internship Program</h2>
          <p style={{ color: '#8892b0', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem', padding: '0 0.5rem' }}>
            Top performers unlock <span style={{ color: '#ffd700', fontWeight: 700 }}>exclusive internship opportunities</span>{' '}
            with industry partners. Your performance determines your career tomorrow.
          </p>
          <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', borderColor: '#ffd700', color: '#ffd700' }}>Register & Compete</Link>
        </div>
      </section>

      {/* ── DEVELOPMENT TEAM ─────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>Built With ❤️</span>
            <h2 className="section-title" style={{ display: 'block' }}>Development Team</h2>
            <p style={{ color: '#8892b0', maxWidth: 440, margin: '0.75rem auto 0', lineHeight: 1.7, fontSize: '0.92rem' }}>
              The minds behind VSpark — building the platform that powers the competition
            </p>
          </div>

          {/* Desktop layout: Dev | Lead | Dev */}
          <div style={{ display: 'none' }} className="team-desktop">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <TeamCard member={team.developers[0]} />
              <TeamCard member={team.lead} isLead />
              <TeamCard member={team.developers[1]} />
            </div>
          </div>

          {/* Mobile layout: Lead on top, devs below */}
          <div className="team-mobile">
            <div style={{ maxWidth: 320, margin: '0 auto 1.5rem' }}>
              <TeamCard member={team.lead} isLead />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', maxWidth: 680, margin: '0 auto' }}>
              {team.developers.map((dev, i) => (
                <TeamCard key={i} member={dev} />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .team-desktop { display: block !important; }
            .team-mobile  { display: none   !important; }
          }
          @media (max-width: 767px) {
            .team-desktop { display: none   !important; }
            .team-mobile  { display: block  !important; }
          }
        `}</style>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(124,58,237,0.1) 0%,transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(1.8rem,6vw,3.5rem)', letterSpacing: 3, color: '#e8eaf6', marginBottom: '0.75rem', padding: '0 1rem' }}>
            Ready to <span style={{ color: '#00d4ff' }}>Ignite</span> Your Potential?
          </h2>
          <p style={{ color: '#8892b0', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Register now and secure your spot at VSpark</p>
          <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 40px' }}>Register Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}