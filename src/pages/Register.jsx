import React, { useState, useEffect } from 'react'
import { CheckCircle, Loader, User, Mail, Hash, Building, Zap, Phone, CreditCard, Link2, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const institutionTypes = ['University', 'School', 'College', 'Other']

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
  const [events, setEvents] = useState([])
  const [siteSettings, setSiteSettings] = useState({})
  const [form, setForm] = useState({
    student_name: '',
    email: '',
    phone: '',
    institution_type: '',
    institution_name: '',
    department: '',
    reg_number: '',
    competition_id: '',
    transaction_id: '',
    screenshot_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    supabase.from('events').select('id, title, registration_fee').order('title').then(({ data }) => {
      setEvents(data || [])
    })
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) {
        const s = {}
        data.forEach(r => { s[r.key] = r.value })
        setSiteSettings(s)
      }
    })
  }, [])

  const handle = (k) => (e) => {
    const val = e.target.value
    setForm(f => ({ ...f, [k]: val }))
    if (k === 'competition_id') {
      const ev = events.find(ev => String(ev.id) === String(val))
      setSelectedEvent(ev || null)
    }
  }

  const requiresPayment = selectedEvent && selectedEvent.registration_fee > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        student_name: form.student_name,
        email: form.email,
        phone: form.phone,
        institution_type: form.institution_type,
        institution_name: form.institution_name,
        department: form.department,
        reg_number: form.reg_number,
        competition_id: form.competition_id || null,
        event_name: selectedEvent?.title || '',
        event_id: form.competition_id || null,
        transaction_id: form.transaction_id || null,
        screenshot_url: form.screenshot_url || null,
        status: 'pending',
      }

      const { error: err } = await supabase.from('registrations').insert([payload])
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
          <div style={{ textAlign: 'center', maxWidth: 540, padding: 40, animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', animation: 'pulse-glow 2s infinite' }}>
              <CheckCircle size={48} style={{ color: '#22c55e' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
              Request <span className="gradient-text">Submitted!</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
              Your registration request has been submitted! The admin will review your payment and send login credentials to <strong style={{ color: 'var(--primary)' }}>{form.email}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => { setSuccess(false); setForm({ student_name: '', email: '', phone: '', institution_type: '', institution_name: '', department: '', reg_number: '', competition_id: '', transaction_id: '', screenshot_url: '' }); setSelectedEvent(null) }} className="btn-primary">
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
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>
              {/* Info panel */}
              <div>
                <div className="badge" style={{ marginBottom: 24 }}>Join VSpark</div>
                <h1 className="section-title" style={{ marginBottom: 20 }}>
                  Register <span className="gradient-text">Now</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                  Fill in your details to secure your spot at VSpark. Submit your registration request and the admin will review and send you login credentials by email.
                </p>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12, color: 'var(--primary)' }}>
                    📅 Event Details
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--text)' }}>Date:</strong> {siteSettings.event_date || 'Date Not Announced'}<br />
                    <strong style={{ color: 'var(--text)' }}>Venue:</strong> {siteSettings.event_venue || 'COMSATS University Islamabad, Vehari Campus'}<br />
                    <strong style={{ color: 'var(--text)' }}>Time:</strong> {siteSettings.event_time || 'TBA'}<br />
                    <strong style={{ color: 'var(--text)' }}>Organized by:</strong> Department of Computer Science
                  </div>
                </div>
              </div>

              {/* Form */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent)', pointerEvents: 'none' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 28 }}>Registration Request Form</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label><User size={12} style={{ display: 'inline', marginRight: 6 }} />Full Name *</label>
                    <input value={form.student_name} onChange={handle('student_name')} placeholder="Muhammad Ahmad" required />
                  </div>
                  <div className="form-group">
                    <label><Mail size={12} style={{ display: 'inline', marginRight: 6 }} />Email Address *</label>
                    <input type="email" value={form.email} onChange={handle('email')} placeholder="student@comsats.edu.pk" required />
                  </div>
                  <div className="form-group">
                    <label><Phone size={12} style={{ display: 'inline', marginRight: 6 }} />Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={handle('phone')} placeholder="+92 300 0000000" required />
                  </div>
                  <div className="form-group">
                    <label><Building size={12} style={{ display: 'inline', marginRight: 6 }} />Institution Type *</label>
                    <select value={form.institution_type} onChange={handle('institution_type')} required>
                      <option value="">Select Type</option>
                      {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><Building size={12} style={{ display: 'inline', marginRight: 6 }} />Institution Name *</label>
                    <input value={form.institution_name} onChange={handle('institution_name')} placeholder="COMSATS University Islamabad, Vehari Campus" required />
                  </div>
                  <div className="form-group">
                    <label><FileText size={12} style={{ display: 'inline', marginRight: 6 }} />Department / Program *</label>
                    <select value={form.department} onChange={handle('department')} required>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><Hash size={12} style={{ display: 'inline', marginRight: 6 }} />Registration / Roll Number *</label>
                    <input value={form.reg_number} onChange={handle('reg_number')} placeholder="FA21-BCS-001" required />
                  </div>
                  <div className="form-group">
                    <label><Zap size={12} style={{ display: 'inline', marginRight: 6 }} />Competition to Register For *</label>
                    <select value={form.competition_id} onChange={handle('competition_id')} required>
                      <option value="">Select Competition</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}{ev.registration_fee > 0 ? ` — PKR ${ev.registration_fee}` : ' — Free'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedEvent && (
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 12, color: 'var(--primary)' }}>
                        💳 Registration Fee
                      </div>
                      {requiresPayment ? (
                        <>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>
                            Transfer <strong style={{ color: 'var(--text)' }}>PKR {selectedEvent.registration_fee}</strong> to:{' '}
                            <strong style={{ color: 'var(--primary)' }}>{siteSettings.payment_account || 'Payment details not configured'}</strong>
                          </p>
                          <div className="form-group" style={{ marginBottom: 12 }}>
                            <label><CreditCard size={12} style={{ display: 'inline', marginRight: 6 }} />Transaction ID *</label>
                            <input value={form.transaction_id} onChange={handle('transaction_id')} placeholder="Enter your transaction ID" required={requiresPayment} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label><Link2 size={12} style={{ display: 'inline', marginRight: 6 }} />Payment Screenshot Link *</label>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 8 }}>Upload your payment screenshot to GitHub or any image host and paste the link below.</p>
                            <input type="url" value={form.screenshot_url} onChange={handle('screenshot_url')} placeholder="https://..." required={requiresPayment} />
                          </div>
                        </>
                      ) : (
                        <p style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: 600 }}>✓ This competition is free to enter!</p>
                      )}
                    </div>
                  )}

                  {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 20 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? <><Loader size={16} style={{ animation: 'rotate 0.8s linear infinite' }} /> Submitting...</> : <><Zap size={16} /> Submit Registration Request</>}
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
