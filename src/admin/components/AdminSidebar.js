import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CalendarDays, Users,
  FileText, Image, LogOut, ChevronRight,
  Swords, Settings, GraduationCap, UserCog, Shield, Trophy
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ALL_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', perm: null },
  { to: '/admin/registrations', icon: Users, label: 'Registrations', perm: 'registrations', badge: true },
  { to: '/admin/competitions', icon: Swords, label: 'Competitions', perm: 'competitions' },
  { to: '/admin/results', icon: Trophy, label: 'Results', perm: 'results' },
  { to: '/admin/schedule', icon: Calendar, label: 'Schedule', perm: 'schedule' },
  { to: '/admin/events', icon: CalendarDays, label: 'Events', perm: 'events' },
  { to: '/admin/department', icon: GraduationCap, label: 'CS Department', perm: 'department' },
  { to: '/admin/blogs', icon: FileText, label: 'Blogs', perm: 'blogs' },
  { to: '/admin/highlights', icon: Image, label: 'Highlights', perm: 'highlights' },
  { to: '/admin/assistants', icon: UserCog, label: 'Assistants', perm: 'assistants' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', perm: 'settings' },
];

export default function AdminSidebar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('Admin');
  const [perms, setPerms] = useState(['all']);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('vspark_role') || 'admin';
    const storedName = sessionStorage.getItem('vspark_name') || 'Admin';
    const storedPerms = sessionStorage.getItem('vspark_perms');
    setRole(storedRole);
    setName(storedName);
    setPerms(storedPerms ? JSON.parse(storedPerms) : ['all']);
  }, [loc.pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('vspark_role');
    sessionStorage.removeItem('vspark_name');
    sessionStorage.removeItem('vspark_perms');
    navigate('/admin/login');
  };

  const visibleItems = ALL_ITEMS.filter(item => {
    if (!item.perm) return true;
    if (perms.includes('all')) return true;
    return perms.includes(item.perm);
  });

  const isAdmin = role === 'admin';

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: '#02040c',
      borderRight: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* ── Logo — clicking goes to dashboard ── */}
      <Link to="/admin" style={{
        padding: '1.1rem 1.5rem',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <img
          src="/images/vspark.png"
          alt="VSpark"
          style={{ height: 52, width: 'auto', objectFit: 'contain' }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Text fallback */}
        <span style={{ display: 'none', fontFamily: 'Bebas Neue,cursive', fontSize: '1.3rem', letterSpacing: 3, color: '#e8eaf6' }}>
          V<span style={{ color: '#00d4ff' }}>SPARK</span>
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.55rem', color: '#8892b0', letterSpacing: 2 }}>
            {isAdmin ? 'ADMIN' : 'ASSISTANT'}
          </div>
        </div>
      </Link>

      {/* ── User info ── */}
      <div style={{
        margin: '0.6rem 0.75rem',
        padding: '0.65rem 1rem',
        background: isAdmin ? 'rgba(0,212,255,0.05)' : 'rgba(124,58,237,0.07)',
        border: `1px solid ${isAdmin ? 'rgba(0,212,255,0.15)' : 'rgba(124,58,237,0.2)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: isAdmin ? 'rgba(0,212,255,0.15)' : 'rgba(124,58,237,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isAdmin ? <Shield size={12} style={{ color: '#00d4ff' }} /> : <UserCog size={12} style={{ color: '#7c3aed' }} />}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#e8eaf6', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
            <p style={{ color: isAdmin ? '#00d4ff' : '#7c3aed', fontSize: '0.58rem', fontFamily: 'JetBrains Mono', letterSpacing: 1 }}>
              {isAdmin ? 'SUPER ADMIN' : 'ASSISTANT'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
        {visibleItems.map(({ to, icon: Icon, label, badge }) => {
          const active = loc.pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 13px', textDecoration: 'none', marginBottom: 2,
              background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: active ? '#00d4ff' : '#8892b0',
              borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
              fontWeight: 600, fontSize: '0.86rem', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; e.currentTarget.style.color = '#e8eaf6'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892b0'; } }}
            >
              <Icon size={15} />
              {label}
              {badge && <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#ff6b00', flexShrink: 0 }} />}
              {active && !badge && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <button onClick={logout} style={{
          width: '100%', padding: '9px 13px',
          background: 'transparent', border: '1px solid rgba(255,61,119,0.3)',
          color: '#ff3d77', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '0.86rem', transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}