import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader, User, Mail, Hash, Building, Zap, Trophy } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const competitions = [
  'Speed Programming',
  'E-Gaming (FIFA)',
  'E-Gaming (Tekken)',
  'Web Development',
  'UI/UX Design',
  'Prompt Engineering',
  'Quiz Competition',
  'Poster Designing',
]

const departments = [
  'Computer Science (CS)',
  'Software Engineering (SE)',
  'Information Technology (IT)',
  'Artificial Intelligence (AI)',
  'Electrical Engineering (EE)',
  'Business Administration (BBA)',
  'Other',
]

export default function Register() {
  const [searchParams] = useSearchParams()
  const preSelected = searchParams.get('event')

  const [form, setForm] = useState({
    student_name: '',
    email: '',
    reg_number: '',
    department: '',
    event_name: preSelected || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get event_id if exists
      const { data: events } = await supabase.from('events').select('id').eq('title', form.event_name).limit(1)
      const event_id = events?.[0]?.id || null

      const { error: err } = await supabase.from('registrations').insert([{
        student_name: form.student_name,
        email: form.email,
        reg_number: form.reg_number,
        department: form.department,
        event_name: form.event_name,
        event_id,
      }])

      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <div className="grid-bg" />
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72 }}>
          <div style={{ textAlign: 'center', maxWidth: 520, padding: 40, animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', animation: 'pulse-glow 2s infinite' }}>
              <CheckCircle size={48} style={{ color: '#22c55e' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
              Registration <span className="gradient-text">Successful!</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
              Thank you, <strong style={{ color: 'var(--text)' }}>{form.student_name}</strong>! You've successfully registered for <strong style={{ color: 'var(--primary)' }}>{form.event_name}</strong> at VSpark 2025.
            </p>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 32, textAlign: 'left' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Registration Details</h3>
              {[
                { label: 'Name', val: form.student_name },
                { label: 'Email', val: form.email },
                { label: 'Reg. No.', val: form.reg_number },
                { label: 'Department', val: form.department },
                { label: 'Event', val: form.event_name },
                { label: 'Date', val: 'December 10, 2025' },
                { label: 'Venue', val: 'COMSATS University, Vehari Campus' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => { setSuccess(false); setForm({ student_name: '', email: '', reg_number: '', department: '', event_name: '' }) }} className="btn-primary">
                Register for Another Event
              </button>
              <a href="/" className="btn-outline">Back to Home</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <section style={{ padding: '60px 0 100px' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>
              {/* Info panel */}
              <div>
                <div className="badge" style={{ marginBottom: 24 }}>Join VSpark 2025</div>
                <h1 className="section-title" style={{ marginBottom: 20 }}>
                  Register <span className="gradient-text">Now</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                  Fill in your details to secure your spot at VSpark 2025. Registration is completely free for all eligible students.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                  {[
                    { icon: <Trophy size={18} />, text: '7 Competition Categories' },
                    { icon: <CheckCircle size={18} />, text: 'Free Registration' },
                    { icon: <Zap size={18} />, text: 'Internship Opportunities' },
                    { icon: <Building size={18} />, text: 'Open to All CS/SE/IT/AI Students' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12, color: 'var(--primary)' }}>
                    📅 Event Details
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--text)' }}>Date:</strong> December 10, 2025<br />
                    <strong style={{ color: 'var(--text)' }}>Venue:</strong> COMSATS University Islamabad, Vehari Campus<br />
                    <strong style={{ color: 'var(--text)' }}>Time:</strong> 9:00 AM onwards<br />
                    <strong style={{ color: 'var(--text)' }}>Organized by:</strong> Department of Computer Science
                  </div>
                </div>
              </div>

              {/* Form */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent)', pointerEvents: 'none' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 28 }}>Registration Form</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label><User size={12} style={{ display: 'inline', marginRight: 6 }} />Full Name *</label>
                    <input value={form.student_name} onChange={handle('student_name')} placeholder="Muhammad Ahmad" required />
                  </div>
                  <div className="form-group">
                    <label><Hash size={12} style={{ display: 'inline', marginRight: 6 }} />Registration Number *</label>
                    <input value={form.reg_number} onChange={handle('reg_number')} placeholder="FA21-BCS-001" required />
                  </div>
                  <div className="form-group">
                    <label><Mail size={12} style={{ display: 'inline', marginRight: 6 }} />Email Address *</label>
                    <input type="email" value={form.email} onChange={handle('email')} placeholder="student@comsats.edu.pk" required />
                  </div>
                  <div className="form-group">
                    <label><Building size={12} style={{ display: 'inline', marginRight: 6 }} />Department *</label>
                    <select value={form.department} onChange={handle('department')} required>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><Trophy size={12} style={{ display: 'inline', marginRight: 6 }} />Competition / Event *</label>
                    <select value={form.event_name} onChange={handle('event_name')} required>
                      <option value="">Select Competition</option>
                      {competitions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 20 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? <><Loader size={16} style={{ animation: 'rotate 0.8s linear infinite' }} /> Registering...</> : <><Zap size={16} /> Complete Registration</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
