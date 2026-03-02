import React, { useState } from 'react';
import { Code, Gamepad2, Globe, Palette, HelpCircle, Brain, Image, Clock, Users, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const competitions = [
  {
    icon: Code, title: 'Speed Programming', color: '#00d4ff', category: 'Technical',
    description: 'On-the-spot algorithmic coding challenges. You have limited time to solve complex problems. Showcase your problem-solving speed and accuracy.',
    rules: ['Solo or teams of 2', 'IDEs are allowed', 'No internet access', '3 problems in 2 hours', 'Judged by correctness & speed'],
    prizes: ['1st: PKR 10,000', '2nd: PKR 6,000', '3rd: PKR 3,000'],
  },
  {
    icon: Gamepad2, title: 'E-Gaming: FIFA & Tekken', color: '#7c3aed', category: 'Gaming',
    description: 'Battle it out in FIFA and Tekken tournaments. CUI Vehari secured 1st position in regional E-Gaming — defend the crown!',
    rules: ['Single elimination bracket', 'Console settings: default', 'FIFA: 6-minute halves', 'Tekken: Best of 3 rounds', 'No custom controllers'],
    prizes: ['1st: PKR 8,000', '2nd: PKR 5,000', '3rd: PKR 2,500'],
  },
  {
    icon: Globe, title: 'Web Development', color: '#ff6b00', category: 'Technical',
    description: 'Design and build a fully functional website on a given theme. Judge-reviewed for aesthetics, functionality, and code quality.',
    rules: ['Teams of up to 3', '4-hour time limit', 'HTML/CSS/JS only', 'No backend frameworks', 'Hosted locally'],
    prizes: ['1st: PKR 12,000', '2nd: PKR 7,000', '3rd: PKR 4,000'],
  },
  {
    icon: Palette, title: 'UI/UX Design', color: '#ffd700', category: 'Creative',
    description: 'Design user-centered interfaces using Figma or Adobe XD. Emphasis on usability, aesthetics, and innovation.',
    rules: ['Solo competition', 'Figma or Adobe XD only', '3-hour design sprint', 'Present to judges', 'Theme revealed on day'],
    prizes: ['1st: PKR 9,000', '2nd: PKR 5,500', '3rd: PKR 3,000'],
  },
  {
    icon: Brain, title: 'Prompt Engineering', color: '#00ff88', category: 'AI (NEW)',
    description: 'New for 2025! Master the art of crafting perfect AI prompts. Tasks include creative generation, problem solving, and AI analysis.',
    rules: ['Solo or pair', 'ChatGPT/Claude provided', '5 challenge rounds', 'Scored on output quality', 'No pre-made prompts'],
    prizes: ['1st: PKR 8,000', '2nd: PKR 5,000', '3rd: PKR 2,500'],
    isNew: true,
  },
  {
    icon: HelpCircle, title: 'CS Quiz', color: '#ff3d77', category: 'Knowledge',
    description: 'Fast-paced quiz covering data structures, algorithms, networks, databases, and general CS knowledge. Battle of the minds!',
    rules: ['Teams of 2', 'MCQ + Rapid fire rounds', 'Buzzer system', '45-minute session', 'No mobiles allowed'],
    prizes: ['1st: PKR 6,000', '2nd: PKR 4,000', '3rd: PKR 2,000'],
  },
  {
    icon: Image, title: 'Poster Designing', color: '#00d4ff', category: 'Creative',
    description: 'Create visually compelling posters on a given CS theme. Judges evaluate creativity, message clarity, and design quality.',
    rules: ['Solo', 'Any design tool', '3-hour limit', 'A3 size output', 'Theme provided on day'],
    prizes: ['1st: PKR 5,000', '2nd: PKR 3,000', '3rd: PKR 1,500'],
  },
];

export default function Competitions() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      
      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.08) 0%, transparent 60%)' }}>
        <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>All Events</span>
        <h1 className="section-title" style={{ display: 'block', marginBottom: '1rem' }}>Competitions</h1>
        <p style={{ color: '#8892b0', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
          Seven categories. One day. Infinite possibilities. Find your battleground and compete for glory, prizes, and internship opportunities.
        </p>
        <Link to="/register" className="btn-neon" style={{ textDecoration: 'none' }}>Register Now</Link>
      </section>

      {/* Competition Cards */}
      <section style={{ padding: '2rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px,1fr))', gap: '2rem' }}>
            {competitions.map((comp, i) => {
              const Icon = comp.icon;
              const isOpen = selected === i;
              return (
                <div key={i} className="glass" style={{
                  padding: '2rem', borderRadius: 2,
                  borderColor: isOpen ? comp.color : 'rgba(0,212,255,0.15)',
                  boxShadow: isOpen ? `0 0 40px ${comp.color}25` : 'none',
                  transition: 'all 0.3s', cursor: 'pointer',
                }} onClick={() => setSelected(isOpen ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, border: `1px solid ${comp.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={22} style={{ color: comp.color }} />
                      </div>
                      <div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: comp.color, letterSpacing: 2 }}>{comp.category}</span>
                        <h3 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6', lineHeight: 1 }}>{comp.title}</h3>
                      </div>
                    </div>
                    {comp.isNew && <span style={{ padding: '3px 10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontSize: '0.7rem', fontFamily: 'JetBrains Mono', border: '1px solid rgba(0,255,136,0.3)' }}>NEW</span>}
                  </div>
                  
                  <p style={{ color: '#8892b0', lineHeight: 1.7, marginBottom: isOpen ? '1.5rem' : 0, fontSize: '0.95rem' }}>{comp.description}</p>
                  
                  {isOpen && (
                    <div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: comp.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={14} /> Rules
                        </h4>
                        {comp.rules.map((r, ri) => <p key={ri} style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: 4 }}>• {r}</p>)}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#ffd700', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Trophy size={14} /> Prizes
                        </h4>
                        {comp.prizes.map((p, pi) => <p key={pi} style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: 4, opacity: pi === 0 ? 1 : pi === 1 ? 0.8 : 0.6 }}>🏆 {p}</p>)}
                      </div>
                      <Link to="/register" className="btn-neon" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1.5rem', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>
                        Register for this
                      </Link>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '1rem', color: comp.color, fontSize: '0.8rem', fontFamily: 'JetBrains Mono' }}>
                    {isOpen ? '↑ Click to collapse' : '↓ Click to expand details'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
