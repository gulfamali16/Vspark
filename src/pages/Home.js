import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Trophy, Code, Gamepad2, Palette, Zap, Brain, Star, ArrowRight, Users, Calendar, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticlesBg from '../components/ParticlesBg';

const competitions = [
  { icon: Code, title: 'Speed Programming', desc: 'Race against time solving algorithmic challenges', color: '#00d4ff' },
  { icon: Gamepad2, title: 'E-Gaming', desc: 'FIFA & Tekken tournaments — claim your throne', color: '#7c3aed' },
  { icon: Code, title: 'Web Development', desc: 'Build stunning web experiences under pressure', color: '#ff6b00' },
  { icon: Palette, title: 'UI/UX Design', desc: 'Design interfaces that speak to the soul', color: '#ffd700' },
  { icon: Brain, title: 'Prompt Engineering', desc: 'Master the art of AI communication (NEW 2025)', color: '#00ff88' },
  { icon: Star, title: 'Quiz Competition', desc: 'Test your CS knowledge against the best', color: '#ff3d77' },
  { icon: Palette, title: 'Poster Designing', desc: 'Create visually compelling poster art', color: '#00d4ff' },
];

const stats = [
  { icon: Users, value: '500+', label: 'Participants' },
  { icon: Trophy, value: '20+', label: 'Awards' },
  { icon: Calendar, value: '1', label: 'Epic Day' },
  { icon: Award, value: '7+', label: 'Competitions' },
];

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const num = parseInt(target);
        let c = 0;
        const step = num / 60;
        const timer = setInterval(() => {
          c = Math.min(c + step, num);
          setCount(Math.floor(c));
          if (c >= num) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <ParticlesBg />
      <Navbar />

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '8rem 2rem 4rem', textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)',
      }}>
        {/* Animated rings */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0, pointerEvents: 'none' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: i * 300, height: i * 300,
              border: `1px solid rgba(0,212,255,${0.08 - i * 0.02})`,
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
              animation: `rotate ${15 + i*5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          {/* Pre-title */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem',
            opacity: heroVisible ? 1 : 0, transition: 'opacity 0.8s',
          }}>
            <span className="tag">COMSATS University Islamabad • Vehari Campus</span>
          </div>

          {/* Main title */}
          <h1 style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            marginBottom: '0.5rem',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.2s',
          }}>
            <span style={{ 
              display: 'block',
              background: 'linear-gradient(135deg, #fff 30%, #00d4ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>V</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}>SPARK</span>
          </h1>
          
          <div style={{
            fontFamily: 'Bebas Neue, cursive', fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: 8, color: '#ff6b00',
            opacity: heroVisible ? 1 : 0, transition: 'all 0.8s ease 0.5s',
            marginBottom: '2rem',
            textShadow: '0 0 40px rgba(255,107,0,0.5)',
          }}>2025</div>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#8892b0', maxWidth: 600, margin: '0 auto 2.5rem',
            lineHeight: 1.8, fontWeight: 500,
            opacity: heroVisible ? 1 : 0, transition: 'all 0.8s ease 0.7s',
          }}>
            National-level coding competition & innovation showcase. 
            Speed programming, e-gaming, web dev, AI prompting and more — 
            <span style={{ color: '#00d4ff' }}> December 10, 2025</span>
          </p>

          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            opacity: heroVisible ? 1 : 0, transition: 'all 0.8s ease 0.9s',
          }}>
            <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '14px 36px' }}>
              Register Now
            </Link>
            <Link to="/competitions" className="btn-neon btn-orange" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '14px 36px' }}>
              Explore Events
            </Link>
          </div>

          <div style={{ marginTop: '4rem', animation: 'float 3s ease-in-out infinite' }}>
            <ChevronDown size={32} style={{ color: 'rgba(0,212,255,0.4)' }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '4rem 2rem', background: 'rgba(0,212,255,0.02)', borderTop: '1px solid rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '2rem' }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <Icon size={28} style={{ color: '#00d4ff', marginBottom: 8 }} />
              <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '3rem', color: '#fff', lineHeight: 1, letterSpacing: 2 }}>
                <CountUp target={parseInt(value)} suffix={value.replace(/\d/g,'')} />
              </div>
              <div style={{ color: '#8892b0', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITIONS PREVIEW */}
      <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>What to Expect</span>
            <h2 className="section-title" style={{ display: 'block' }}>Competitions</h2>
            <p style={{ color: '#8892b0', maxWidth: 500, margin: '1rem auto 0', lineHeight: 1.7 }}>Seven high-stakes categories — each designed to test different dimensions of your technical prowess</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {competitions.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="glass" style={{
                padding: '2rem', borderRadius: 2, cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 20px 60px ${color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 100, height: 100, borderRadius: '50%',
                  background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                }} />
                <div style={{ width: 48, height: 48, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.4rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#8892b0', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                {i === 4 && <span style={{ display: 'inline-block', marginTop: 12, padding: '2px 8px', background: `${color}20`, color, fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, border: `1px solid ${color}40` }}>NEW</span>}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/competitions" className="btn-neon" style={{ textDecoration: 'none' }}>
              View All Details <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERNSHIP HIGHLIGHT */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(124,58,237,0.05) 100%)', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Zap size={48} style={{ color: '#ffd700', marginBottom: '1.5rem', animation: 'pulse-glow 2s infinite' }} />
          <h2 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Internship Program</h2>
          <p style={{ color: '#8892b0', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            A unique feature of VSpark 2025 — top performers unlock <span style={{ color: '#ffd700', fontWeight: 700 }}>exclusive internship opportunities</span> with industry partners. 
            Your performance on the day determines your career tomorrow.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {['Top Performers', 'Industry Partners', 'Career Launch', 'COMSATS Students'].map((item, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: '#ffd700' }}>
                ✦ {item}
              </div>
            ))}
          </div>
          <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', borderColor: '#ffd700', color: '#ffd700' }}>
            Register & Compete
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: 4, color: '#e8eaf6', marginBottom: '1rem' }}>
            Ready to <span style={{ color: '#00d4ff' }}>Ignite</span> Your Potential?
          </h2>
          <p style={{ color: '#8892b0', marginBottom: '2.5rem', fontSize: '1.05rem' }}>Join hundreds of students on December 10, 2025</p>
          <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '1.2rem', padding: '16px 48px' }}>
            Register Now — It's Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
