import { GraduationCap, Award, Users, BookOpen, Code, Cpu, Globe, Brain, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const programs = [
  { icon: Code, name: 'BS Computer Science', code: 'BSCS', desc: '4-year program covering algorithms, software engineering, databases, and systems programming.' },
  { icon: Globe, name: 'BS Software Engineering', code: 'BSSE', desc: 'Industry-focused curriculum with emphasis on software development, project management, and agile practices.' },
  { icon: Cpu, name: 'BS Information Technology', code: 'BSIT', desc: 'Comprehensive IT training covering networking, database administration, and enterprise systems.' },
  { icon: Brain, name: 'BS Artificial Intelligence', code: 'BSAI', desc: 'Cutting-edge program covering machine learning, deep learning, computer vision, and NLP.' },
]

const achievements = [
  '1st Position in E-Gaming at Byte and Battle Competition',
  'National-level participation in ICPC programming contests',
  'Multiple FYP projects selected for national competitions',
  'Industry partnerships with leading tech companies',
  'Research publications in international journals',
  'Active coding community with weekly hackathons',
]

const faculty = [
  { name: 'Department Chairperson', role: 'CS Department Head', img: '👨‍🏫' },
  { name: 'Dr. Senior Faculty', role: 'Algorithms & Data Structures', img: '👩‍🏫' },
  { name: 'Prof. CS Expert', role: 'Software Engineering', img: '👨‍💻' },
  { name: 'Dr. AI Specialist', role: 'Artificial Intelligence & ML', img: '👩‍💻' },
]

export default function Department() {
  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{
        padding: '80px 0 60px',
        background: 'linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <img src="https://github.com/user-attachments/assets/374e5219-aa2e-4024-ba7c-0930e4932a54"
              alt="CS Department" style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.4))' }} />
          </div>
          <div className="section-subtitle" style={{ color: 'var(--accent-green)' }}>COMSATS University Islamabad, Vehari Campus</div>
          <h1 className="section-title">Department of <span style={{ color: 'var(--accent-green)' }}>Computer Science</span></h1>
          <div className="section-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-green), transparent)', marginBottom: 24 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            A hub of innovation, research, and excellence — shaping the technology leaders of tomorrow through rigorous education, hands-on training, and industry engagement.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20, color: 'var(--text-primary)' }}>
                About <span style={{ color: 'var(--accent-green)' }}>Our Department</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16 }}>
                The Department of Computer Science at COMSATS University Islamabad Vehari Campus is committed to providing world-class education in computing and information technology. We offer BS programs in CS, SE, IT, and AI with a curriculum designed to meet global industry standards.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 24 }}>
                Our department fosters a culture of innovation through events like VSpark, research projects, and industry partnerships that give students real-world exposure before graduation.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { val: '500+', label: 'Active Students', color: 'var(--accent-cyan)' },
                  { val: '20+', label: 'Faculty Members', color: 'var(--accent-green)' },
                  { val: '4', label: 'BS Programs', color: 'var(--accent-gold)' },
                  { val: '2025', label: 'Est. Campus', color: 'var(--accent-orange)' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: s.color }}>{s.val}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <img src="https://github.com/user-attachments/assets/d1febaf8-0b6c-4ea7-a007-236b160e902d"
                alt="COMSATS" style={{ width: '100%', maxWidth: 360, margin: '0 auto', display: 'block', filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.3))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-subtitle" style={{ color: 'var(--accent-green)' }}>Academic Excellence</div>
          <h2 className="section-title">Our <span style={{ color: 'var(--accent-green)' }}>Programs</span></h2>
          <div className="section-divider" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-green), transparent)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {programs.map((prog, i) => (
              <div key={i} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-green)' }} />
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <prog.icon size={26} color="var(--accent-green)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-green)', letterSpacing: 3, marginBottom: 8 }}>{prog.code}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 12 }}>
                  {prog.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.7 }}>{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section">
        <div className="container">
          <div className="section-subtitle">Track Record</div>
          <h2 className="section-title">Department <span style={{ color: 'var(--accent-gold)' }}>Achievements</span></h2>
          <div className="section-divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {achievements.map((ach, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Award size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.6 }}>{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
            Be Part of <span style={{ color: 'var(--accent-cyan)' }}>VSpark 2025</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Organized by the CS Department, VSpark is your chance to shine on a national stage.
          </p>
          <Link to="/register" className="btn-primary" style={{ marginRight: 12 }}>Register Now</Link>
          <Link to="/competitions" className="btn-outline">View Competitions</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
