import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, Loader } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } else {
      navigate('/')
    }
  }

  return (
    <div>
      <div className="grid-bg" />
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72 }}>
        <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 48, position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent)', pointerEvents: 'none' }} />
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 48, marginBottom: 20 }} />
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
                Participant <span className="gradient-text">Login</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Use the credentials sent to your email after registration approval
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Mail size={12} style={{ display: 'inline', marginRight: 6 }} />Email Address</label>
                <input type="email" value={form.email} onChange={handle('email')} placeholder="student@comsats.edu.pk" required />
              </div>
              <div className="form-group">
                <label><Lock size={12} style={{ display: 'inline', marginRight: 6 }} />Password</label>
                <input type="password" value={form.password} onChange={handle('password')} placeholder="Enter your password" required />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 20 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '1rem', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? <><Loader size={16} style={{ animation: 'rotate 0.8s linear infinite' }} /> Logging in...</> : <><Zap size={16} /> Login</>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Want to register?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                → Request Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
