import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Gamepad2, Globe, Brain, Layers, Award, Users, Calendar, Trophy, ChevronDown, Zap, Star, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CS_LOGO = 'https://github.com/user-attachments/assets/374e5219-aa2e-4024-ba7c-0930e4932a54'
const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'
const COMSATS_LOGO = 'https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d'

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + increment, target)
          setCount(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, duration / steps)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const competitions = [
  { icon: <Code2 size={28} />, title: 'Speed Programming', desc: 'Race against time to solve algorithmic challenges. Test your coding skills under pressure.', color: '#00D4FF', category: 'coding' },
  { icon: <Gamepad2 size={28} />, title: 'E-Gaming', desc: 'Compete in FIFA and Tekken tournaments. Prove your reflexes and game strategy.', color: '#FF6B35', category: 'gaming' },
  { icon: <Globe size={28} />, title: 'Web Development', desc: 'Build stunning, functional websites. Showcase your frontend and backend expertise.', color: '#7C3AED', category: 'dev' },
  { icon: <Layers size={28} />, title: 'UI/UX Design', desc: 'Design intuitive user experiences. Create interfaces that delight and engage users.', color: '#EC4899', category: 'design' },
  { icon: <Brain size={28} />, title: 'Prompt Engineering', desc: 'New for 2025! Master the art of communicating with AI. Craft prompts that deliver.', color: '#10B981', category: 'ai', isNew: true },
  { icon: <Award size={28} />, title: 'Quiz Competition', desc: 'Test your CS and tech knowledge. Challenge peers in comprehensive tech trivia.', color: '#F59E0B', category: 'quiz' },
]

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="grid-bg" />
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }}>
        {/* Radial glow follow cursor */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          pointerEvents: 'none',
          transition: 'left 0.3s ease, top 0.3s ease',
        }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.1)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '15%', right: '7%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.15)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '3%', width: 150, height: 150, borderRadius: '50%', border: '1px solid rgba(255,107,53,0.1)', animation: 'float 7s ease-in-out infinite' }} />

        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.02) 50%, transparent 100%)', pointerEvents: 'none' }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 40 }}>
          {/* Announcement badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 100, padding: '8px 20px', marginBottom: 40, animation: 'fadeInUp 0.6s ease' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D4FF', animation: 'pulse-glow 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              December 10, 2025 • Vehari Campus
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-2px',
            marginBottom: 8,
            animation: 'fadeInUp 0.6s 0.1s ease both',
          }}>
            <span style={{ display: 'block', color: 'var(--text)' }}>V</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 50%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'flicker 8s infinite',
            }}>SPARK</span>
          </h1>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32,
            animation: 'fadeInUp 0.6s 0.2s ease both',
          }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, var(--primary))' }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.75rem, 2vw, 1rem)',
              letterSpacing: '6px',
              color: 'var(--text-muted)',
              fontWeight: 400,
              textTransform: 'uppercase',
            }}>2025</span>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, var(--primary), transparent)' }} />
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            maxWidth: 640,
            margin: '0 auto 48px',
            lineHeight: 1.7,
            animation: 'fadeInUp 0.6s 0.3s ease both',
          }}>
            The National-Level Technical Innovation Competition at COMSATS University Islamabad, Vehari Campus. Code. Create. Compete.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', animation: 'fadeInUp 0.6s 0.4s ease both' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>
              <Zap size={18} />
              Register Now
            </Link>
            <Link to="/competitions" className="btn-outline" style={{ fontSize: '1rem', padding: '16px 40px' }}>
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 48, marginTop: 80,
            animation: 'fadeInUp 0.6s 0.5s ease both',
          }}>
            {[
              { value: 7, suffix: '+', label: 'Competition Categories' },
              { value: 500, suffix: '+', label: 'Expected Participants' },
              { value: 1, suffix: 'st', label: 'Position in E-Gaming' },
              { value: 100, suffix: '%', label: 'Free to Participate' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--primary)' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#about" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-heading)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Scroll Down
          <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="section" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="badge" style={{ marginBottom: 24 }}>About VSpark</div>
              <h2 className="section-title">
                Where Innovation <span className="gradient-text">Meets Competition</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                VSpark 2025 is the premier annual technical competition hosted by the Department of Computer Science at COMSATS University Islamabad, Vehari Campus. Designed for students in CS, SE, IT, and AI programs across Pakistan.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                From cutting-edge coding challenges to creative design battles — VSpark is where future tech leaders prove their mettle. Top performers unlock exclusive internship opportunities with industry partners.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {['National Level', 'Industry Partners', 'Internship Opportunities', 'Cash Prizes'].map(tag => (
                  <span key={tag} style={{
                    padding: '6px 14px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: 100, fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontWeight: 600,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 24,
                padding: 40,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1), transparent)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 32 }}>
                  <img src={CS_LOGO} alt="CS Dept" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 12, background: 'white', padding: 6 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>Department of CS</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>COMSATS Vehari Campus</div>
                  </div>
                </div>
                {[
                  { icon: <Calendar size={18} />, label: 'Event Date', value: 'December 10, 2025' },
                  { icon: <Trophy size={18} />, label: 'Competition Type', value: 'National Level' },
                  { icon: <Users size={18} />, label: 'Open For', value: 'CS, SE, IT, AI Students' },
                  { icon: <Star size={18} />, label: 'Special Feature', value: 'Internship Program 2025' },
                  { icon: <TrendingUp size={18} />, label: 'Achievement', value: '1st in E-Gaming (Byte & Battle)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{item.label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: 2 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITIONS PREVIEW */}
      <section className="section" style={{ background: 'var(--bg2)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 24 }}>Competitions</div>
            <h2 className="section-title">
              6 Categories. <span className="gradient-text">Infinite Possibilities.</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Choose your battlefield. Each competition is designed to challenge, inspire, and reward exceptional talent.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
            {competitions.map((comp, i) => (
              <div key={i} className="card" style={{ padding: 32, cursor: 'pointer', animationDelay: `${i * 0.1}s`, position: 'relative', overflow: 'hidden' }}>
                {comp.isNew && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '1px' }}>
                    NEW 2025
                  </div>
                )}
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${comp.color}15`, border: `1px solid ${comp.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: comp.color, marginBottom: 20 }}>
                  {comp.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{comp.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{comp.desc}</p>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: comp.color, fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                  Learn more <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/competitions" className="btn-outline">
              View All Competitions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERNSHIP SPOTLIGHT */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container">
          <div style={{
            background: 'var(--surface)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 24,
            padding: 'clamp(32px, 5vw, 64px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 48,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent)', pointerEvents: 'none' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '4px', color: '#7C3AED', marginBottom: 16, textTransform: 'uppercase', fontWeight: 700 }}>
                ✦ Exclusive Feature 2025
              </div>
              <h2 className="section-title">
                Internship <span className="gradient-text">Opportunities</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                VSpark 2025 features a unique integrated internship program exclusively for COMSATS students. Top performers across competitions unlock real career opportunities with industry partners.
              </p>
              <Link to="/register" className="btn-primary">
                <Zap size={16} />
                Compete & Unlock Career
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '🏆', title: 'Win Competitions', desc: 'Top performers in each category' },
                { icon: '🤝', title: 'Industry Connect', desc: 'Meet tech industry partners' },
                { icon: '💼', title: 'Real Internships', desc: 'Unlock actual career positions' },
                { icon: '🚀', title: 'Career Launch', desc: 'Fast-track your professional path' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.05), transparent)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '4px', color: 'var(--accent)', marginBottom: 24, textTransform: 'uppercase', fontWeight: 700 }}>
            Limited Seats Available
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
            Ready to <span className="gradient-text">Spark</span> Your Future?
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 40px', fontSize: '1.1rem' }}>
            Join hundreds of students competing for glory, prizes, and career opportunities at VSpark 2025.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 44px' }}>
              Register for Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/events" className="btn-outline" style={{ fontSize: '1rem', padding: '16px 44px' }}>
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
