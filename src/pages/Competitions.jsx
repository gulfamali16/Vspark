import React, { useState } from 'react'
import { Code2, Gamepad2, Globe, Brain, Layers, Award, FileImage, CheckCircle, Clock, Users, Trophy, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const competitions = [
  {
    id: 1,
    icon: <Code2 size={32} />,
    title: 'Speed Programming',
    subtitle: 'On-the-Spot Coding',
    color: '#00D4FF',
    category: 'Programming',
    description: 'Test your algorithmic thinking and coding speed. Solve complex problems under time pressure using any programming language of your choice. Problems range from basic logic to advanced data structures.',
    rules: [
      'Individual participation only',
      'Any programming language allowed',
      'Internet access NOT permitted',
      'Problems of varying difficulty',
      'Score based on correctness + speed',
      'Top 3 winners receive prizes',
    ],
    prizes: ['1st: PKR 5,000 + Certificate', '2nd: PKR 3,000 + Certificate', '3rd: PKR 1,500 + Certificate'],
    duration: '2 hours',
    teamSize: 'Individual',
  },
  {
    id: 2,
    icon: <Gamepad2 size={32} />,
    title: 'E-Gaming',
    subtitle: 'FIFA & Tekken Tournaments',
    color: '#FF6B35',
    category: 'Gaming',
    description: 'Show your gaming skills in FIFA and Tekken tournaments. Compete in bracket-style elimination rounds. COMSATS Vehari recently won 1st place in E-Gaming at Byte & Battle competition!',
    rules: [
      'Both FIFA and Tekken available',
      '1v1 bracket elimination format',
      'Best of 3 matches per round',
      'Finals: Best of 5',
      'Bring your own controller (optional)',
      'Fair play policy enforced',
    ],
    prizes: ['1st: PKR 4,000 + Trophy', '2nd: PKR 2,500 + Certificate', '3rd: PKR 1,000 + Certificate'],
    duration: '4 hours (full day)',
    teamSize: 'Individual',
  },
  {
    id: 3,
    icon: <Globe size={32} />,
    title: 'Web Development',
    subtitle: 'Build. Deploy. Impress.',
    color: '#7C3AED',
    category: 'Development',
    description: 'Build a fully functional website from scratch in limited time. Judges evaluate design, functionality, code quality, and user experience. Theme revealed on event day.',
    rules: [
      'Teams of 2-3 members',
      'Theme announced on the day',
      'Any framework/library allowed',
      '4-hour development window',
      'Submission via GitHub link',
      'Live demo to judges required',
    ],
    prizes: ['1st: PKR 6,000 + Certificates', '2nd: PKR 4,000 + Certificates', '3rd: PKR 2,000 + Certificates'],
    duration: '4 hours',
    teamSize: '2-3 members',
  },
  {
    id: 4,
    icon: <Layers size={32} />,
    title: 'UI/UX Design',
    subtitle: 'Design That Speaks',
    color: '#EC4899',
    category: 'Design',
    description: 'Create stunning user interface designs using Figma or Adobe XD. Design a complete app or website UI based on the given brief. Focus on aesthetics, usability, and user journey.',
    rules: [
      'Individual or pairs (max 2)',
      'Figma or Adobe XD only',
      'Brief provided at start',
      '3-hour design window',
      'Prototype + presentation required',
      'Judged on creativity + usability',
    ],
    prizes: ['1st: PKR 4,500 + Certificate', '2nd: PKR 3,000 + Certificate', '3rd: PKR 1,500 + Certificate'],
    duration: '3 hours',
    teamSize: 'Individual or Pairs',
  },
  {
    id: 5,
    icon: <Brain size={32} />,
    title: 'Prompt Engineering',
    subtitle: 'NEW ✦',
    color: '#10B981',
    category: 'AI',
    isNew: true,
    description: 'The newest competition category! Master the art of crafting AI prompts. Participants will compete in designing optimal prompts for given tasks, evaluating AI outputs, and demonstrating understanding of large language models.',
    rules: [
      'Individual participation',
      'Tasks involve GPT/Claude prompting',
      'Multiple rounds of challenges',
      'Score based on output quality',
      'Creativity and precision judged',
      'No prior AI knowledge assumed',
    ],
    prizes: ['1st: PKR 5,000 + Certificate', '2nd: PKR 3,000 + Certificate', '3rd: PKR 1,500 + Certificate'],
    duration: '2.5 hours',
    teamSize: 'Individual',
  },
  {
    id: 6,
    icon: <Award size={32} />,
    title: 'Quiz Competition',
    subtitle: 'Test Your CS Knowledge',
    color: '#F59E0B',
    category: 'Quiz',
    description: 'A comprehensive quiz testing knowledge in Computer Science fundamentals, current tech trends, programming concepts, and general knowledge. Multiple rounds with increasing difficulty.',
    rules: [
      'Teams of 2 members',
      'Multiple choice + buzzer rounds',
      'Topics: CS, Programming, Tech',
      'No device usage permitted',
      'Tie-breaker rounds available',
      'Academic year students only',
    ],
    prizes: ['1st: PKR 3,500 + Certificates', '2nd: PKR 2,000 + Certificates', '3rd: PKR 1,000 + Certificates'],
    duration: '1.5 hours',
    teamSize: '2 members',
  },
  {
    id: 7,
    icon: <FileImage size={32} />,
    title: 'Poster Designing',
    subtitle: 'Visual Storytelling',
    color: '#F97316',
    category: 'Design',
    description: 'Design an impactful poster on a given technology or social theme. Express ideas through compelling visual design using any graphic design tool. Printed and digital submissions both accepted.',
    rules: [
      'Individual participation',
      'Any design software allowed',
      'A3 size, 300 DPI minimum',
      'Both print and digital versions',
      'Originality is key',
      'Plagiarism = disqualification',
    ],
    prizes: ['1st: PKR 3,000 + Certificate', '2nd: PKR 2,000 + Certificate', '3rd: PKR 1,000 + Certificate'],
    duration: '3 hours',
    teamSize: 'Individual',
  },
]

const categories = ['All', 'Programming', 'Gaming', 'Development', 'Design', 'AI', 'Quiz']

export default function Competitions() {
  const [active, setActive] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = competitions.filter(c => active === 'All' || c.category === active)

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        {/* Header */}
        <section style={{ padding: '60px 0 40px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08), transparent 60%)', pointerEvents: 'none' }} />
          <div className="container">
            <div className="badge" style={{ marginBottom: 24 }}>Competitions</div>
            <h1 className="section-title" style={{ marginBottom: 16 }}>
              Choose Your <span className="gradient-text">Battle</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              Seven competition categories. Infinite opportunities to prove yourself.
            </p>

            {/* Filter tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActive(cat)} style={{
                  padding: '8px 20px',
                  background: active === cat ? 'linear-gradient(135deg, var(--primary), var(--accent2))' : 'var(--surface)',
                  border: '1px solid',
                  borderColor: active === cat ? 'transparent' : 'var(--border)',
                  borderRadius: 100,
                  color: active === cat ? 'white' : 'var(--text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Competition cards */}
        <section style={{ padding: '20px 0 100px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {filtered.map((comp) => (
                <div key={comp.id} style={{
                  background: 'var(--surface)',
                  border: `1px solid ${expanded === comp.id ? comp.color + '60' : 'var(--border)'}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  boxShadow: expanded === comp.id ? `0 0 40px ${comp.color}20` : 'none',
                }}>
                  {/* Card top */}
                  <div
                    style={{ padding: 28, cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === comp.id ? null : comp.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{ width: 60, height: 60, borderRadius: 14, background: `${comp.color}15`, border: `1px solid ${comp.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: comp.color }}>
                        {comp.icon}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        {comp.isNew && (
                          <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '1px' }}>
                            NEW
                          </span>
                        )}
                        <span style={{ background: `${comp.color}10`, color: comp.color, padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                          {comp.category}
                        </span>
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: 4 }}>{comp.title}</h3>
                    <div style={{ color: comp.color, fontSize: '0.8rem', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 12 }}>{comp.subtitle}</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{comp.description}</p>

                    <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                      {[{ icon: <Clock size={14} />, val: comp.duration }, { icon: <Users size={14} />, val: comp.teamSize }].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          <span style={{ color: comp.color }}>{item.icon}</span>
                          {item.val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expanded === comp.id && (
                    <div style={{ padding: '0 28px 28px', borderTop: `1px solid ${comp.color}20`, paddingTop: 24, animation: 'fadeInUp 0.3s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', color: comp.color, marginBottom: 12 }}>Rules</h4>
                          {comp.rules.map((rule, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              <CheckCircle size={14} style={{ color: comp.color, flexShrink: 0, marginTop: 2 }} />
                              {rule}
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', color: comp.color, marginBottom: 12 }}>Prizes</h4>
                          {comp.prizes.map((prize, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: '0.85rem' }}>
                              <Trophy size={14} style={{ color: ['#FFD700', '#C0C0C0', '#CD7F32'][i], flexShrink: 0, marginTop: 2 }} />
                              <span style={{ color: i === 0 ? 'var(--text)' : 'var(--text-muted)' }}>{prize}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 20 }}>
                        <Link to={`/register?event=${encodeURIComponent(comp.title)}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                          <Zap size={16} />
                          Register for {comp.title}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
