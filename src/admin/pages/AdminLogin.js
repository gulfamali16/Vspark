import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// ============================================================
const ADMIN_EMAILS = [
  'gulfam@gmail.com', // ← your real admin email
];
// ============================================================

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in as admin/assistant, go to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const email = session.user.email;

      // Check if admin
      if (ADMIN_EMAILS.includes(email)) { navigate('/admin'); return; }

      // Check if assistant
      const { data: assistant } = await supabase
        .from('admin_assistants').select('id').eq('email', email).eq('is_active', true).maybeSingle();
      if (assistant) { navigate('/admin'); return; }

      // Otherwise sign out (student accidentally here)
      await supabase.auth.signOut();
    });
  }, [navigate]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      const email = data.user.email;

      // ── Check if this is a student account ──────────────────
      const { data: studentReg } = await supabase
        .from('registration_requests')
        .select('id')
        .eq('email', email)
        .eq('status', 'approved')
        .maybeSingle();

      if (studentReg) {
        // Sign them out from here and tell them where to go
        await supabase.auth.signOut();
        toast.error('This is the admin panel. Please use the participant login.');
        setTimeout(() => navigate('/login'), 1500);
        setLoading(false);
        return;
      }

      // ── Check if admin ───────────────────────────────────────
      if (ADMIN_EMAILS.includes(email)) {
        sessionStorage.setItem('vspark_role', 'admin');
        sessionStorage.setItem('vspark_name', 'Admin');
        sessionStorage.setItem('vspark_perms', JSON.stringify(['all']));
        toast.success('Welcome back, Admin!');
        navigate('/admin');
        setLoading(false);
        return;
      }

      // ── Check if assistant ───────────────────────────────────
      const { data: assistant } = await supabase
        .from('admin_assistants')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (assistant) {
        sessionStorage.setItem('vspark_role', 'assistant');
        sessionStorage.setItem('vspark_name', assistant.name);
        sessionStorage.setItem('vspark_perms', JSON.stringify(assistant.permissions || []));
        toast.success(`Welcome, ${assistant.name}!`);
        navigate('/admin');
        setLoading(false);
        return;
      }

      // ── Not authorized ───────────────────────────────────────
      await supabase.auth.signOut();
      toast.error('You are not authorized to access the admin panel.');

    } catch (err) {
      toast.error('Invalid email or password.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#050810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)',
      backgroundSize: '50px 50px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '2rem', letterSpacing: 4, marginBottom: 4 }}>
            V<span style={{ color: '#00d4ff' }}>SPARK</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Shield size={12} style={{ color: '#00d4ff' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#00d4ff', letterSpacing: 3 }}>ADMIN ACCESS ONLY</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,212,255,0.15)', padding: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '1.8rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: '0.25rem', textAlign: 'center' }}>
            Admin Login
          </h1>
          <p style={{ color: '#8892b0', fontSize: '0.82rem', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Rajdhani' }}>
            For admin and assistant accounts only
          </p>

          <form onSubmit={submit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 6, fontSize: '0.82rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="admin@email.com"
                  style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', fontFamily: 'Rajdhani', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#00d4ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.2)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontFamily: 'Bebas Neue', letterSpacing: 2, color: '#8892b0', marginBottom: 6, fontSize: '0.82rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#00d4ff' }} />
                <input
                  name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 42px 12px 38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.2)', color: '#e8eaf6', fontFamily: 'Rajdhani', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#00d4ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.2)'}
                />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(0,212,255,0.08)' : 'transparent',
              border: '2px solid #00d4ff', color: '#00d4ff',
              fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: 3,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#00d4ff'; e.currentTarget.style.color = '#050810'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00d4ff'; }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Link to public login for students */}
        <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.25rem', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', textAlign: 'center' }}>
          <p style={{ color: '#8892b0', fontSize: '0.82rem', marginBottom: 6 }}>Are you a registered participant?</p>
          <Link to="/login" style={{ color: '#ffd700', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600, fontFamily: 'Rajdhani' }}>
            Go to Participant Login →
          </Link>
        </div>
      </div>
    </div>
  );
}