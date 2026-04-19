/**
 * Home.jsx — Premium light-theme landing page
 * Design: Editorial layout, strong hero, warm off-white bg, indigo+orange palette
 */
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Gamepad2, Globe, Brain, Layers, Award, Users, Calendar, Trophy, ChevronDown, Zap, Star, TrendingUp, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CS_LOGO      = 'https://github.com/user-attachments/assets/374e5219-aa2e-4024-ba7c-0930e4932a54'
const VSPARK_LOGO  = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

const COMPETITIONS = [
  { icon: <Code2   size={24} />, title: 'Speed Programming',  desc: 'Race against the clock solving algorithmic challenges under pressure.',      color: '#4F46E5', bg: '#EEF2FF', category: 'Programming' },
  { icon: <Gamepad2 size={24}/>, title: 'E-Gaming',           desc: 'FIFA & Tekken bracket-style tournaments. Prove your reflexes.',              color: '#F97316', bg: '#FFF7ED', category: 'Gaming' },
  { icon: <Globe   size={24} />, title: 'Web Development',    desc: 'Build a complete web app from scratch in 4 hours. Theme revealed on day.',   color: '#7C3AED', bg: '#F5F3FF', category: 'Dev' },
  { icon: <Layers  size={24} />, title: 'UI/UX Design',       desc: 'Design stunning interfaces in Figma. Judged on creativity + usability.',     color: '#EC4899', bg: '#FDF2F8', category: 'Design' },
  { icon: <Brain   size={24} />, title: 'Prompt Engineering', desc: 'New for 2025. Master AI communication. Craft prompts that deliver results.', color: '#059669', bg: '#ECFDF5', category: 'AI', isNew: true },
  { icon: <Award   size={24} />, title: 'Quiz Competition',   desc: 'Test CS knowledge in multi-round buzzer and MCQ challenges.',                color: '#D97706', bg: '#FFFBEB', category: 'Quiz' },
]

const HERO_STATS = [
  { value: 7,   suffix: '+', label: 'Competitions',        color: '#4F46E5' },
  { value: 500, suffix: '+', label: 'Expected Students',   color: '#F97316' },
  { value: 1,   suffix: 'st', label: 'E-Gaming Ranking',   color: '#059669' },
  { value: 100, suffix: '%', label: 'Free to Enter',       color: '#7C3AED' },
]

function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref     = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 50
        const inc    = target / steps
        let cur      = 0
        const timer  = setInterval(() => {
          cur = Math.min(cur + inc, target)
          setCount(Math.floor(cur))
          if (cur >= target) clearInterval(timer)
        }, duration / steps)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Home() {
  const [mainEvent, setMainEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMainEvent = async () => {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('is_main_event', true)
          .maybeSingle()
        if (data) setMainEvent(data)
      } catch (err) {
        console.error('Error fetching main event:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMainEvent()
  }, [])

  const eventDate = mainEvent ? new Date(mainEvent.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) : 'To be announced'

  const aboutRows = [
    { icon: <Calendar size={16} />,   label: 'Event Date',        value: eventDate },
    { icon: <Trophy   size={16} />,   label: 'Competition Type',  value: 'National Level' },
    { icon: <Users    size={16} />,   label: 'Open For',          value: 'CS, SE, IT, AI Students' },
    { icon: <Star     size={16} />,   label: 'Special Feature',   value: 'Internship Program 2025' },
    { icon: <TrendingUp size={16} />, label: 'Achievement',       value: '1st Place — Byte & Battle E-Gaming' },
  ]
  return (
    <div style={{ background: '#F9F7F4', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display:   'flex',
        alignItems: 'center',
        paddingTop: 68,
        background: 'linear-gradient(160deg, #F9F7F4 0%, #EEF2FF 50%, #FFF7ED 100%)',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)', pointerEvents: 'none' }} />

        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5, pointerEvents: 'none' }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          {/* Eyebrow badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 100, padding: '6px 18px', marginBottom: 32, animation: 'fadeInUp 0.5s ease' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse-ring 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#4F46E5', letterSpacing: '0.04em' }}>
              {eventDate} · {mainEvent?.venue || 'COMSATS University Islamabad'}
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(3rem, 8vw, 6rem)',
            fontWeight:    900,
            letterSpacing: '-0.04em',
            lineHeight:    1.05,
            color:         '#0F172A',
            marginBottom:  24,
            animation:     'fadeInUp 0.5s 0.1s ease both',
          }}>
            Pakistan's Premier<br />
            <span style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #F97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              CS Competition
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#64748B', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7, animation: 'fadeInUp 0.5s 0.2s ease both' }}>
            Speed Programming · E-Gaming · Web Dev · UI/UX · Prompt Engineering · Quiz · Poster Design. Free to enter. Cash prizes. Internship opportunities.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80, animation: 'fadeInUp 0.5s 0.3s ease both' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <Zap size={17} /> Register for Free
            </Link>
            <Link to="/competitions" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Explore Events <ArrowRight size={17} />
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0, animation: 'fadeInUp 0.5s 0.4s ease both' }}>
            {HERO_STATS.map((stat, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', padding: '0 40px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: stat.color }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
                {i < HERO_STATS.length - 1 && <div style={{ width: 1, background: '#E5E7EB', margin: '8px 0', alignSelf: 'stretch' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#about" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', color: '#9CA3AF', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          Scroll
          <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
        </a>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────── */}
      <section id="about" className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            <div>
              <span className="section-eyebrow">About VSpark</span>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Where Innovation<br /><span className="gradient-text">Meets Competition</span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 24 }}>
                VSpark 2025 is the premier annual technical competition hosted by the Department of Computer Science at COMSATS University Islamabad, Vehari Campus — designed for CS, SE, IT, and AI students across Pakistan.
              </p>
              <p className="section-subtitle" style={{ marginBottom: 32 }}>
                From coding sprints to creative design battles — VSpark is where future tech leaders make their mark. Top performers unlock exclusive internship opportunities.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['National Level', 'Industry Partners', 'Internship Program', 'Cash Prizes'].map(tag => (
                  <span key={tag} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            </div>

            {/* Info card */}
            <div className="card" style={{ padding: 36, borderRadius: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F3F4F6' }}>
                <img src={CS_LOGO} alt="CS Dept" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12, background: '#F9F7F4', padding: 6, border: '1px solid #E5E7EB' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Department of Computer Science</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>COMSATS University Islamabad, Vehari Campus</div>
                </div>
              </div>
              {aboutRows.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 0', borderBottom: i < 4 ? '1px solid #F9F7F4' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A', marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPETITIONS PREVIEW ───────────────────────────────── */}
      <section className="section" style={{ background: '#F9F7F4' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-eyebrow">Competitions</span>
            <h2 className="section-title" style={{ marginBottom: 16 }}>
              6 Categories. <span className="gradient-text">Your Arena.</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Choose your battlefield. Each competition challenges a different skill set — from algorithmic thinking to creative design.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 44 }}>
            {COMPETITIONS.map((comp, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: '28px', position: 'relative', overflow: 'hidden', borderRadius: 20 }}
              >
                {comp.isNew && (
                  <span className="badge badge-new" style={{ position: 'absolute', top: 20, right: 20 }}>New 2025</span>
                )}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: comp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: comp.color, marginBottom: 18 }}>
                  {comp.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: comp.color, marginBottom: 8, display: 'block' }}>{comp.category}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: 10 }}>{comp.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 18 }}>{comp.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: comp.color, fontSize: '0.85rem', fontWeight: 600 }}>
                  View details <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/competitions" className="btn-outline">
              View All 7 Competitions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP SPOTLIGHT ───────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{
            background:   'linear-gradient(135deg, #EEF2FF 0%, #F9F7F4 50%, #FFF7ED 100%)',
            border:       '1px solid #E5E7EB',
            borderRadius:  28,
            padding:      'clamp(36px, 5vw, 64px)',
            display:      'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap:           48,
            alignItems:   'center',
          }}>
            <div>
              <span className="section-eyebrow">Exclusive Feature 2025</span>
              <h2 className="section-title" style={{ marginBottom: 16 }}>
                Unlock Real<br /><span className="gradient-text">Career Opportunities</span>
              </h2>
              <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: 32, fontSize: '1rem' }}>
                VSpark 2025 features an integrated internship program exclusively for COMSATS students. Top performers across all competitions unlock direct connections with industry partners.
              </p>
              {[
                'Win your competition category',
                'Get introduced to industry partners',
                'Secure a real internship placement',
                'Fast-track your career journey',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <CheckCircle size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#374151' }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 32 }}>
                <Link to="/register" className="btn-primary" style={{ padding: '13px 28px' }}>
                  <Zap size={16} /> Compete & Unlock Career
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { emoji: '🏆', title: 'Win Competitions', desc: 'Top performers in each category' },
                { emoji: '🤝', title: 'Industry Connect', desc: 'Direct meeting with tech partners' },
                { emoji: '💼', title: 'Real Internships', desc: 'Actual career positions unlocked' },
                { emoji: '🚀', title: 'Career Launch', desc: 'Fast-track your professional path' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: 10 }}>{item.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────── */}
      <section style={{ background: '#0F172A', padding: '96px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '5px 16px', marginBottom: 28, fontSize: 12, fontWeight: 600, color: '#FB923C', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Limited Seats Available
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Ready to <span style={{ background: 'linear-gradient(135deg, #818CF8, #FB923C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spark</span> Your Future?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 40px' }}>
            Join hundreds of students competing for prizes and career opportunities at Pakistan's premier CS event.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#4F46E5', color: '#fff', borderRadius: 10, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
              Register for Free <ArrowRight size={17} />
            </Link>
            <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'transparent', color: '#E2E8F0', borderRadius: 10, fontSize: '1rem', fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}>
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
