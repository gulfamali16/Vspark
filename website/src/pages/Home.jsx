import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Trophy, Code, Gamepad2, Globe, Brain, ChevronDown, Users, Award, Calendar, Star } from 'lucide-react'

// Counter animation hook
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

const competitions = [
  { icon: Code, title: 'Speed Programming', desc: 'On-the-spot coding challenges testing algorithmic thinking under pressure', color: 'var(--accent-cyan)', tag: 'CS & SE' },
  { icon: Gamepad2, title: 'E-Gaming', desc: 'FIFA & Tekken tournaments — prove your gaming supremacy', color: 'var(--accent-gold)', tag: 'All Students' },
  { icon: Globe, title: 'Web Dev & UI/UX', desc: 'Build stunning interfaces and demonstrate your design prowess', color: 'var(--accent-green)', tag: 'IT & CS' },
  { icon: Brain, title: 'Prompt Engineering', desc: 'NEW FOR 2025 — Master the art of AI prompting and generation', color: 'var(--accent-orange)', tag: 'AI & CS' },
  { icon: Trophy, title: 'Quiz Competition', desc: 'Technical knowledge showdown across CS, SE, IT & AI domains', color: '#aa88ff', tag: 'All Streams' },
  { icon: Star, title: 'Poster Designing', desc: 'Creative visual storytelling meets technical communication', color: '#ff88aa', tag: 'Creative' },
]

export default function Home() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true)
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const c1 = useCounter(500, 2000, statsVisible)
  const c2 = useCounter(6, 1500, statsVisible)
  const c3 = useCounter(50, 1800, statsVisible)
  const c4 = useCounter(10, 1200, statsVisible)

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Hex grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.06) 0%, transparent 40%)',
        }} />

        {/* Scanline effect */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.01) 2px, rgba(0, 212, 255, 0.01) 4px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          {/* Logos row */}
          <div className="animate-fadeIn" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            <img src="https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d"
              alt="COMSATS" style={{ height: 60, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }} />
            <div style={{ width: 1, height: 50, background: 'var(--border)' }} />
            <img src="https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5"
              alt="VSpark" style={{ height: 40, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.4))' }} />
            <div style={{ width: 1, height: 50, background: 'var(--border)' }} />
            <img src="https://github.com/user-attachments/assets/374e5219-aa2e-4024-ba7c-0930e4932a54"
              alt="CS Dept" style={{ height: 55, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.4))' }} />
          </div>

          {/* Badge */}
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', border: '1px solid rgba(0,212,255,0.4)', marginBottom: 24, background: 'rgba(0,212,255,0.08)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: 3, textTransform: 'uppercase' }}>National Level Competition · Dec 10, 2025</span>
          </div>

          {/* Main title */}
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              letterSpacing: 8,
              lineHeight: 0.9,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #fff 0%, var(--accent-cyan) 50%, var(--accent-gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>VS</span>
              <span style={{ color: 'var(--text-primary)', textShadow: '0 0 40px rgba(0,212,255,0.3)' }}>PARK</span>
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300, letterSpacing: 12, color: 'var(--accent-gold)', marginBottom: 12 }}>2025</div>
          </div>

          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto 40px',
              lineHeight: 1.8,
              fontWeight: 300,
            }}>
              Unleash innovation · Forge connections · Ignite your career<br />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>Department of Computer Science — COMSATS Vehari Campus</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.55s', animationFillMode: 'forwards', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              <Zap size={18} />
              Register Now
            </Link>
            <Link to="/competitions" className="btn-outline" style={{ fontSize: '1rem', padding: '15px 35px' }}>
              <Trophy size={18} />
              View Competitions
            </Link>
          </div>

          {/* Internship badge */}
          <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards', marginTop: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 24px',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,107,53,0.1))',
              border: '1px solid rgba(255,215,0,0.3)',
            }}>
              <Award size={16} color="var(--accent-gold)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                Top performers unlock <strong>internship opportunities</strong> at COMSATS
              </span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ marginTop: 60, animation: 'float 2s ease-in-out infinite' }}>
            <ChevronDown size={24} color="var(--text-muted)" style={{ display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {[
              { val: c1, suffix: '+', label: 'Students Expected', color: 'var(--accent-cyan)', icon: Users },
              { val: c2, suffix: '', label: 'Competition Categories', color: 'var(--accent-gold)', icon: Trophy },
              { val: c3, suffix: 'K+', label: 'Prize Pool (PKR)', color: 'var(--accent-green)', icon: Award },
              { val: c4, suffix: '+', label: 'Universities Invited', color: 'var(--accent-orange)', icon: Calendar },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '40px 20px',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ marginBottom: 8 }}>
                  <s.icon size={24} color={s.color} style={{ display: 'block', margin: '0 auto 12px' }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  color: s.color,
                  lineHeight: 1,
                  textShadow: `0 0 30px ${s.color}60`,
                }}>
                  {s.val}{s.suffix}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIONS PREVIEW */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="section-subtitle">What Awaits You</div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>Competition</span> Categories
          </h2>
          <div className="section-divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {competitions.map((comp, i) => (
              <div key={i} className="card" style={{ padding: '32px 28px', animationDelay: `${i * 0.1}s` }}>
                {/* Corner accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${comp.color}`, borderLeft: `2px solid ${comp.color}` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${comp.color}`, borderRight: `2px solid ${comp.color}` }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{
                    width: 52, height: 52,
                    background: `${comp.color}15`,
                    border: `1px solid ${comp.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <comp.icon size={24} color={comp.color} />
                  </div>
                  <span className="tag" style={{ fontSize: '0.65rem', borderColor: `${comp.color}40`, color: comp.color, background: `${comp.color}10` }}>{comp.tag}</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: 2, color: comp.color, marginBottom: 10, textTransform: 'uppercase' }}>
                  {comp.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {comp.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/competitions" className="btn-outline">
              <Trophy size={18} />
              View All Details & Rules
            </Link>
          </div>
        </div>
      </section>

      {/* INTERNSHIP CTA */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(0,212,255,0.06) 100%)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', border: '1px solid rgba(255,215,0,0.4)', marginBottom: 20, background: 'rgba(255,215,0,0.08)' }}>
            <Award size={14} color="var(--accent-gold)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: 3, textTransform: 'uppercase' }}>Exclusive Opportunity</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
            Win More Than <span className="neon-gold" style={{ color: 'var(--accent-gold)' }}>Just Trophies</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.8 }}>
            Top performers in VSpark 2025 unlock exclusive <strong style={{ color: 'var(--accent-gold)' }}>internship opportunities</strong> through COMSATS's integrated career program. Launch your career from day one.
          </p>

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {['Industry Mentorship', 'Paid Internships', 'Career Network', 'Certificate of Excellence'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, background: 'var(--accent-gold)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <span style={{ fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>

          <Link to="/register" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            <Zap size={18} />
            Secure Your Spot Now
          </Link>
        </div>
      </section>

      {/* ABOUT VSPARK */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="animate-slideInLeft">
              <div className="section-subtitle" style={{ textAlign: 'left' }}>About The Event</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 24 }}>
                What is <span style={{ color: 'var(--accent-cyan)' }}>VSpark?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16 }}>
                VSpark is the premier annual tech competition organized by the Department of Computer Science at COMSATS University Islamabad, Vehari Campus. Designed for students in CS, SE, IT, and AI streams, it's a platform where innovation meets opportunity.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 32 }}>
                With a focus on real-world skills — from competitive programming to AI prompt engineering — VSpark prepares the next generation of tech leaders through hands-on challenges, industry exposure, and career networking.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/events" className="btn-primary">View Events</Link>
                <Link to="/department" className="btn-outline">CS Department</Link>
              </div>
            </div>

            <div className="animate-slideInRight" style={{ position: 'relative' }}>
              {/* Visual decorative element */}
              <div style={{ position: 'relative', padding: 30 }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                }} />
                <div style={{ position: 'absolute', top: -1, left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)' }} />

                {/* Feature list */}
                {[
                  { label: 'National Level Participation', color: 'var(--accent-cyan)' },
                  { label: '6 Competition Categories', color: 'var(--accent-gold)' },
                  { label: 'Internship Opportunities', color: 'var(--accent-green)' },
                  { label: 'Industry Expert Judges', color: 'var(--accent-orange)' },
                  { label: 'Networking & Career Fair', color: '#aa88ff' },
                  { label: 'Certification for All Participants', color: '#ff88aa' },
                ].map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 0',
                    borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 30, height: 30, flexShrink: 0,
                      background: `${f.color}15`,
                      border: `1px solid ${f.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: f.color,
                    }}>0{i + 1}</div>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{f.label}</span>
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </main>
  )
}
