import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Loader, Shield, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

export default function AdminLogin() {
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/admin" />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await signIn(email, password)
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" />
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05), transparent)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px', position: 'relative', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 48, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 48, marginBottom: 16 }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 8 }}>
              <Shield size={14} style={{ color: '#7C3AED' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Portal</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginTop: 12 }}>Sign In</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 6 }}>Access the VSpark 2025 admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><Mail size={12} style={{ display: 'inline', marginRight: 6 }} />Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@comsats.edu.pk" required />
            </div>
            <div className="form-group">
              <label><Lock size={12} style={{ display: 'inline', marginRight: 6 }} />Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <><Loader size={16} style={{ animation: 'rotate 0.8s linear infinite' }} /> Signing In...</>
                : <><Zap size={16} /> Sign In to Dashboard</>}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg3)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--primary)' }}>Setup Note:</strong> Create an admin user in your Supabase project under Authentication → Users, then use those credentials to login here.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>← Back to main website</a>
        </div>
      </div>
    </div>
  )
}
