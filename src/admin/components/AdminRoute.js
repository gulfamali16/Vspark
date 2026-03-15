import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// ============================================================
// PUT YOUR ADMIN EMAIL(S) HERE
const ADMIN_EMAILS = [
  'gulfam@gmail.com',   // ← replace with your real admin email
];
// ============================================================

export default function AdminRoute({ children, requiredPermission }) {
  const [status, setStatus] = useState('loading'); // loading | allowed | denied

  useEffect(() => {
    const check = async () => {
      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setStatus('denied');
        return;
      }

      const email = session.user.email;

      // 1. Is it a hardcoded admin email?
      if (ADMIN_EMAILS.includes(email)) {
        setStatus('allowed');
        return;
      }

      // 2. Is it an assistant account with correct permission?
      const { data: assistant } = await supabase
        .from('admin_assistants')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (assistant) {
        // If no specific permission required, allow any assistant
        if (!requiredPermission) {
          setStatus('allowed');
          return;
        }
        // Check if assistant has the required permission
        const perms = assistant.permissions || [];
        if (perms.includes(requiredPermission) || perms.includes('all')) {
          setStatus('allowed');
          return;
        }
      }

      // 3. Is it a student? Block them
      const { data: studentReg } = await supabase
        .from('registration_requests')
        .select('id')
        .eq('email', email)
        .eq('status', 'approved')
        .single();

      if (studentReg) {
        // This is a student — send them to their card
        setStatus('student');
        return;
      }

      setStatus('denied');
    };

    check();
  }, [requiredPermission]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', background: '#050810',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36,
            border: '3px solid rgba(0,212,255,0.15)',
            borderTop: '3px solid #00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
            Verifying access...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (status === 'student') return <Navigate to="/card" replace />;
  if (status === 'denied')  return <Navigate to="/admin/login" replace />;

  return children;
}