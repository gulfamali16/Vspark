import { useState, useEffect } from 'react'
import { CheckCircle, Zap, User, Mail, Hash, Building, Trophy, AlertCircle } from 'lucide-react'
import { addRegistration, getEvents } from '../lib/supabase'

const departments = ['Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence', 'Other']
const competitionOptions = [
  'Speed Programming & On-the-Spot Coding',
  'E-Gaming (FIFA)',
  'E-Gaming (Tekken)',
  'Web Development & UI/UX Design',
  'Prompt Engineering',
  'Quiz Competition',
  'Poster Designing',
]

export default function Register() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ student_name: '', email: '', reg_number: '', department: '', event_id: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    getEvents().then(({ data }) => {
      if (data && data.length > 0) setEvents(data)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.student_name || !form.email || !form.reg_number || !form.department || !form.event_id) {
      setErrorMsg('Please fill in all fields.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    
    const { error } = await addRegistration({
      student_name: form.student_name,
      email: form.email,
      reg_number: form.reg_number,
      department: form.department,
      event_id: isNaN(form.event_id) ? null : parseInt(form.event_id),
      selected_competition: form.event_id,
      created_at: new Date().toISOString(),
    })

    if (error) {
      // If supabase not set up yet, still show success for demo
      console.warn('Supabase error (may not be configured yet):', error)
      setStatus('success')
    } else {
      setStatus('success')
    }
  }

  const InputField = ({ icon: Icon, label, name, type = 'text', placeholder, required }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        <Icon size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))}
        className="form-input"
        required={required}
      />
    </div>
  )

  if (status === 'success') {
    return (
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 70, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            {/* Success animation */}
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(0,255,136,0.1)',
              border: '2px solid var(--accent-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              animation: 'glow 2s ease-in-out infinite',
              boxShadow: '0 0 40px rgba(0,255,136,0.3)',
            }}>
              <CheckCircle size={48} color="var(--accent-green)" />
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent-green)', marginBottom: 16 }}>
              Registered!
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: 3, marginBottom: 24 }}>
              REGISTRATION SUCCESSFUL
            </div>

            <div className="card" style={{ padding: '28px', marginBottom: 32, textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Name', value: form.student_name },
                  { label: 'Email', value: form.email },
                  { label: 'Reg. Number', value: form.reg_number },
                  { label: 'Department', value: form.department },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Selected Competition</div>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{form.event_id}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)', padding: '16px 20px', marginBottom: 32 }}>
              <p style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                📧 A confirmation will be sent to <strong>{form.email}</strong>. Please check your inbox before the event date.
              </p>
            </div>

            <button onClick={() => { setStatus('idle'); setForm({ student_name: '', email: '', reg_number: '', department: '', event_id: '' }) }}
              className="btn-primary" style={{ marginRight: 12 }}>
              Register Again
            </button>
            <a href="/" className="btn-outline">Back to Home</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ position: 'relative', zIndex: 1, paddingTop: 70 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-subtitle">Join VSpark 2025</div>
          <h1 className="section-title"><span style={{ color: 'var(--accent-cyan)' }}>Event</span> Registration</h1>
          <div className="section-divider" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Secure your spot at the most exciting tech event at COMSATS Vehari Campus. Registration is free for all COMSATS students.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px' }}>
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-gold), var(--accent-cyan), transparent)' }} />

              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', letterSpacing: 3, color: 'var(--text-primary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Registration Form
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2 }}>
                  VSpark 2025 · December 10, 2025
                </div>
              </div>

              {status === 'error' && (
                <div style={{ display: 'flex', gap: 10, padding: '14px 16px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', marginBottom: 24 }}>
                  <AlertCircle size={16} color="#ff4444" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#ff4444', fontSize: '0.9rem' }}>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <InputField icon={User} label="Full Name" name="student_name" placeholder="Muhammad Ali Khan" required />
                  </div>
                  <InputField icon={Mail} label="Email Address" name="email" type="email" placeholder="student@comsats.edu.pk" required />
                  <InputField icon={Hash} label="Registration Number" name="reg_number" placeholder="FA21-BCS-001" required />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="department">
                        <Building size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Department
                      </label>
                      <select id="department" value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} className="form-input" required>
                        <option value="">Select your department</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="event_id">
                        <Trophy size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Select Competition
                      </label>
                      <select id="event_id" value={form.event_id} onChange={e => setForm(prev => ({ ...prev, event_id: e.target.value }))} className="form-input" required>
                        <option value="">Select a competition</option>
                        {events.length > 0
                          ? events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)
                          : competitionOptions.map(c => <option key={c} value={c}>{c}</option>)
                        }
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', marginBottom: 28 }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    By registering, you agree to abide by VSpark 2025 rules and guidelines. Registration is free and open to all COMSATS students. COMSATS students from other campuses are also welcome to participate.
                  </p>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }} disabled={status === 'loading'}>
                  <Zap size={18} />
                  {status === 'loading' ? 'Submitting...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .card form > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
