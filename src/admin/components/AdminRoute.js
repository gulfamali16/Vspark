import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// ============================================================
// YOUR MAIN ADMIN EMAIL — change this to your real email
const ADMIN_EMAILS = [
  'gulfam@gmail.com',
];
// ============================================================

export default function AdminRoute({ children, requiredPermission }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) { setStatus('denied'); return; }

      const email = session.user.email;

      // ── 1. Main admin — full access ──────────────────────────
      if (ADMIN_EMAILS.includes(email)) {
        sessionStorage.setItem('vspark_role', 'admin');
        sessionStorage.setItem('vspark_name', 'Admin');
        sessionStorage.setItem('vspark_perms', JSON.stringify(['all']));
        setStatus('allowed');
        return;
      }

      // ── 2. Assistant account ─────────────────────────────────
      const { data: assistant } = await supabase
        .from('admin_assistants')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (assistant) {
        const perms = assistant.permissions || [];
        sessionStorage.setItem('vspark_role', 'assistant');
        sessionStorage.setItem('vspark_name', assistant.name);
        sessionStorage.setItem('vspark_perms', JSON.stringify(perms));

        // If a specific permission is required for this page, check it
        if (requiredPermission && !perms.includes(requiredPermission) && !perms.includes('all')) {
          setStatus('no_permission');
          return;
        }

        setStatus('allowed');
        return;
      }

      // ── 3. Student (approved registration) ──────────────────
      // Students must use /login — never /admin/login
      const { data: studentReg } = await supabase
        .from('registration_requests')
        .select('id')
        .eq('email', email)
        .eq('status', 'approved')
        .maybeSingle();

      if (studentReg) {
        setStatus('student');
        return;
      }

      // ── 4. Unknown — deny ────────────────────────────────────
      sessionStorage.removeItem('vspark_role');
      setStatus('denied');
    };

    check();
  }, [requiredPermission]);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'student') return <Navigate to="/card" replace />;
  if (status === 'denied')  return <Navigate to="/admin/login" replace />;
  if (status === 'no_permission') return <NoPermission />;

  return children;
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(0,212,255,0.1)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>Verifying access...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function NoPermission() {
  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🚫</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', letterSpacing: 3, color: '#ff3d77', marginBottom: '1rem' }}>No Permission</h2>
        <p style={{ color: '#8892b0', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
          You don't have access to this section.<br />Contact the main admin to request access.
        </p>
        <a href="/admin" style={{ display: 'inline-block', padding: '11px 30px', border: '2px solid #00d4ff', color: '#00d4ff', fontFamily: 'Bebas Neue', letterSpacing: 2, textDecoration: 'none', fontSize: '1rem' }}>
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}