import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      sessionStorage.setItem('vspark_admin', 'true');
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error('Invalid credentials');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px 14px 44px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.2)',
    color: '#e8eaf6', fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 500,
    outline: 'none', borderRadius: 0,
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, #050810 60%)',
    }}>
      <div style={{ maxWidth: 440, width: '100%', padding: '2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '3rem', letterSpacing: 4, marginBottom: 8 }}>
            V<span style={{ color: '#00d4ff' }}>SPARK</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#8892b0', letterSpacing: 3 }}>ADMIN ACCESS</div>
        </div>

        <div className="glass" style={{ padding: '2.5rem', borderColor: 'rgba(0,212,255,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56, height: 56, border: '1px solid rgba(0,212,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
              background: 'rgba(0,212,255,0.05)',
            }}>
              <Lock size={24} style={{ color: '#00d4ff' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: 3, color: '#e8eaf6' }}>Admin Login</h2>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 8, fontSize: '0.85rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="admin@vspark.edu.pk" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#00d4ff'}
                  onBlur={e => e.target.style.borderColor='rgba(0,212,255,0.2)'} />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 8, fontSize: '0.85rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
                <input name="password" type={showPass?'text':'password'} value={form.password} onChange={handle} placeholder="••••••••" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#00d4ff'}
                  onBlur={e => e.target.style.borderColor='rgba(0,212,255,0.2)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-neon" disabled={loading}
              style={{ width: '100%', fontSize: '1rem', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Authenticating...' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
