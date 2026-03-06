import { Link } from 'react-router-dom'
import { Code, Gamepad2, Globe, Brain, Trophy, Star, CheckCircle, Clock, Users, Zap } from 'lucide-react'

const competitions = [
  {
    icon: Code,
    title: 'Speed Programming',
    subtitle: 'On-the-Spot Coding',
    color: 'var(--accent-cyan)',
    category: 'CS & SE',
    duration: '2 Hours',
    teamSize: 'Individual / 2',
    description: 'Solve algorithmic challenges under time pressure. Test your problem-solving skills with real competitive programming problems spanning data structures, algorithms, and mathematical reasoning.',
    rules: [
      'Problems will be given at event time — no advance notice',
      'Allowed languages: C++, Java, Python',
      'Solutions evaluated on correctness and execution time',
      'Top 3 winners will be declared based on problems solved and time',
      'No internet access allowed during the competition',
      'IDE of your choice will be provided on the system',
    ],
    prizes: ['1st: PKR 5000 + Certificate + Internship Opportunity', '2nd: PKR 3000 + Certificate', '3rd: PKR 1500 + Certificate'],
  },
  {
    icon: Gamepad2,
    title: 'E-Gaming',
    subtitle: 'FIFA & Tekken Tournament',
    color: 'var(--accent-gold)',
    category: 'All Students',
    duration: 'Full Day',
    teamSize: '1v1 / 2v2',
    description: 'Compete in thrilling FIFA and Tekken tournaments. Show off your gaming skills in knockout rounds leading to grand finals. Note: COMSATS Vehari secured 1st position in E-Gaming at Byte and Battle recently!',
    rules: [
      'Separate brackets for FIFA and Tekken',
      'FIFA: Latest available version, 10-minute halves',
      'Tekken: Best of 3 rounds, standard competitive settings',
      'Knockout format leading to Grand Final',
      'Organizer decision is final for any disputes',
      'Players must report 10 min before their scheduled match',
    ],
    prizes: ['1st: PKR 4000 + Champion Trophy + Certificate', '2nd: PKR 2500 + Certificate', '3rd: PKR 1000 + Certificate'],
  },
  {
    icon: Globe,
    title: 'Web Dev & UI/UX',
    subtitle: 'Design & Development',
    color: 'var(--accent-green)',
    category: 'IT & CS',
    duration: '3 Hours',
    teamSize: 'Team of 2-3',
    description: 'Design and build a fully functional website or UI prototype from a given brief. Judged on creativity, responsiveness, code quality, and user experience. Tools like Figma, HTML/CSS/JS, or React are all welcome.',
    rules: [
      'Topic/brief provided at the start of the event',
      'Allowed tools: Figma, Adobe XD, HTML/CSS/JS, React, Vue',
      'Submission must be a live/hosted website or interactive prototype',
      'Judging criteria: Design (30%), Functionality (30%), UX (20%), Innovation (20%)',
      'Plagiarism or pre-built templates will lead to disqualification',
      'Must present your work in a 3-minute pitch at the end',
    ],
    prizes: ['1st: PKR 5000 + Certificate + Internship Opportunity', '2nd: PKR 3000 + Certificate', '3rd: PKR 1500 + Certificate'],
  },
  {
    icon: Brain,
    title: 'Prompt Engineering',
    subtitle: 'NEW FOR 2025 · AI Mastery',
    color: 'var(--accent-orange)',
    category: 'AI & CS',
    duration: '1.5 Hours',
    teamSize: 'Individual',
    description: '🆕 Brand new for VSpark 2025! Master the art of crafting effective AI prompts. Participants will be given tasks to complete using AI tools — judged on output quality, creativity, and prompt efficiency.',
    rules: [
      'Tasks will be revealed at competition time',
      'Allowed AI tools: ChatGPT, Claude, Gemini (specified per round)',
      'Judged on: Quality of output, creativity, and prompt craftsmanship',
      'No copy-pasting from internet sources for prompts',
      'Must submit both your prompt and the AI output',
      '3 rounds progressively increasing in complexity',
    ],
    prizes: ['1st: PKR 4000 + Certificate + Internship Consideration', '2nd: PKR 2500 + Certificate', '3rd: PKR 1000 + Certificate'],
  },
  {
    icon: Trophy,
    title: 'Quiz Competition',
    subtitle: 'Technical Knowledge Showdown',
    color: '#aa88ff',
    category: 'All Streams',
    duration: '1 Hour',
    teamSize: 'Team of 2',
    description: 'Battle it out in a fast-paced quiz covering Computer Science fundamentals, Software Engineering, Networking, AI/ML concepts, and general tech trivia. Multiple rounds with eliminations.',
    rules: [
      'MCQs, True/False, and rapid-fire rounds',
      'Topics: CS fundamentals, algorithms, networking, OS, AI basics',
      'Teams of 2; each member must answer individually in some rounds',
      'Buzzers used for rapid-fire — fastest correct answer wins',
      'Negative marking: -0.5 for wrong answers in written rounds',
      'Organizer decision is final',
    ],
    prizes: ['1st: PKR 3000 + Trophy + Certificate', '2nd: PKR 2000 + Certificate', '3rd: PKR 1000 + Certificate'],
  },
  {
    icon: Star,
    title: 'Poster Designing',
    subtitle: 'Creative Visual Communication',
    color: '#ff88aa',
    category: 'Creative',
    duration: '2 Hours',
    teamSize: 'Individual / 2',
    description: 'Design an impactful tech-themed poster using digital design tools. Express innovation, awareness, or a technical concept through compelling visual design. Judged by professional designers and faculty.',
    rules: [
      'Theme will be announced on the day of the event',
      'Allowed software: Adobe Illustrator, Photoshop, Canva, Figma',
      'Final output: A3 size digital poster (minimum 300 DPI)',
      'Judging: Concept (30%), Design (40%), Relevance (30%)',
      'AI-generated images are not allowed',
      'Must be original work — no copyrighted elements',
    ],
    prizes: ['1st: PKR 3000 + Certificate', '2nd: PKR 2000 + Certificate', '3rd: PKR 1000 + Certificate'],
  },
]

export default function Competitions() {
  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div className="section-subtitle">VSpark 2025</div>
          <h1 className="section-title">
            <span style={{ color: 'var(--accent-cyan)' }}>Competition</span> Categories
          </h1>
          <div className="section-divider" style={{ marginBottom: 24 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            Six categories of competition designed to challenge, inspire, and reward talent across CS, SE, IT, AI, and creative disciplines.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link to="/register" className="btn-primary">
              <Zap size={16} />
              Register for a Competition
            </Link>
          </div>
        </div>
      </section>

      {/* Competitions */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {competitions.map((comp, i) => (
              <div key={i} className="card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                {/* Color accent bar */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: comp.color }} />

                {/* Glow on hover handled by card class */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <div style={{
                        width: 60, height: 60,
                        background: `${comp.color}15`,
                        border: `1px solid ${comp.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <comp.icon size={28} color={comp.color} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: comp.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                          {comp.subtitle}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.7rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                          {comp.title}
                        </h2>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} color={comp.color} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{comp.duration}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} color={comp.color} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{comp.teamSize}</span>
                      </div>
                      <span className="tag" style={{ borderColor: `${comp.color}40`, color: comp.color, background: `${comp.color}10`, fontSize: '0.65rem' }}>{comp.category}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                      {comp.description}
                    </p>

                    {/* Prizes */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: comp.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Prizes</div>
                      {comp.prizes.map((p, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: j === 0 ? 'var(--accent-gold)' : j === 1 ? '#c0c0c0' : '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                            {j + 1}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: comp.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Rules & Guidelines</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {comp.rules.map((rule, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <CheckCircle size={15} color={comp.color} style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rule}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 28 }}>
                      <Link to="/register" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem', background: `linear-gradient(135deg, ${comp.color}, ${comp.color}88)` }}>
                        <Zap size={14} />
                        Register for this Event
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .card > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </main>
  )
}
