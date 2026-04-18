/**
 * AdminLogin.jsx — Premium light-theme admin login
 */
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Loader, Shield, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

export default function AdminLogin() {
  const { user, signIn }      = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  if (user) return <Navigate to="/admin" />

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message)
    } finally { setLoading(false) }
  }

  const inputStyle = { background:'#FAFAFA', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'11px 14px', fontSize:15, color:'#0F172A', outline:'none', width:'100%', fontFamily:'var(--font-body)', transition:'all 0.2s' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg, #F9F7F4, #EEF2FF)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, #CBD5E1 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:0.5, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'-20%', right:'-10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(79,70,229,0.08), transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:420, padding:'0 24px', position:'relative', animation:'fadeInUp 0.4s ease' }}>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:24, padding:48, boxShadow:'0 20px 60px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <img src={VSPARK_LOGO} alt="VSpark" style={{ height:44, marginBottom:16, objectFit:'contain' }} />
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:100, padding:'5px 14px', marginBottom:12 }}>
              <Shield size={13} style={{ color:'#4F46E5' }} />
              <span style={{ fontSize:12, fontWeight:700, color:'#4F46E5', letterSpacing:'0.05em', textTransform:'uppercase' }}>Admin Portal</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, color:'#0F172A', marginTop:8 }}>Sign In</h1>
            <p style={{ color:'#9CA3AF', fontSize:'0.875rem', marginTop:6 }}>Access the VSpark 2025 admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:6, display:'flex', alignItems:'center', gap:5 }}>
                <Mail size={12}/> Email Address
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@comsats.edu.pk" required style={inputStyle}
                onFocus={e=>{e.target.style.borderColor='#4F46E5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)'}}
                onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none'}}
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:6, display:'flex', alignItems:'center', gap:5 }}>
                <Lock size={12}/> Password
              </label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••••" required style={inputStyle}
                onFocus={e=>{e.target.style.borderColor='#4F46E5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)'}}
                onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none'}}
              />
            </div>
            {error && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', color:'#B91C1C', fontSize:'0.875rem', marginBottom:20 }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'14px 0', fontSize:'1rem', opacity:loading?0.7:1, borderRadius:10 }}>
              {loading ? <><Loader size={16} style={{ animation:'rotate 0.8s linear infinite' }}/> Signing In...</> : <><Zap size={16}/> Sign In to Dashboard</>}
            </button>
          </form>

          <div style={{ marginTop:24, padding:16, background:'#F9F7F4', borderRadius:10, fontSize:'0.8rem', color:'#9CA3AF', lineHeight:1.6 }}>
            <strong style={{ color:'#4F46E5' }}>Setup:</strong> Create an admin user in Supabase under Authentication → Users, then use those credentials here.
          </div>
        </div>
        <div style={{ textAlign:'center', marginTop:20 }}>
          <a href="/" style={{ color:'#9CA3AF', textDecoration:'none', fontSize:'0.875rem' }}>← Back to main website</a>
        </div>
      </div>
    </div>
  )
}
