import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CalendarDays, Users,
  FileText, Image, LogOut, ChevronRight,
  Swords, Settings, GraduationCap, UserCog
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const items = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/registrations',icon: Users,           label: 'Registrations', badge: true },
  { to: '/admin/competitions', icon: Swords,          label: 'Competitions' },
  { to: '/admin/schedule',     icon: Calendar,        label: 'Schedule' },
  { to: '/admin/events',       icon: CalendarDays,    label: 'Events' },
  { to: '/admin/department',   icon: GraduationCap,   label: 'CS Department' },
  { to: '/admin/blogs',        icon: FileText,        label: 'Blogs' },
  { to: '/admin/highlights',   icon: Image,           label: 'Highlights' },
  { to: '/admin/assistants',   icon: UserCog,         label: 'Assistants' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

export default function AdminSidebar({ userPermissions }) {
  const loc = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Filter items based on assistant permissions
  const visibleItems = items.filter(item => {
    if (!userPermissions) return true; // full admin sees all
    if (userPermissions.includes('all')) return true;
    // Always show dashboard
    if (item.to === '/admin') return true;
    // Check if permission matches
    const key = item.to.replace('/admin/', '');
    return userPermissions.includes(key);
  });

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: '#02040c',
      borderRight: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo — clicking goes to dashboard */}
      <Link to="/admin" style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        textDecoration: 'none',
        display: 'block',
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: '1.5rem', letterSpacing: 3 }}>
          V<span style={{ color: '#00d4ff' }}>SPARK</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', color: '#8892b0', marginTop: 2, letterSpacing: 2 }}>
          ADMIN PANEL
        </div>
      </Link>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {visibleItems.map(({ to, icon: Icon, label, badge }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to} to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', textDecoration: 'none', marginBottom: 2,
                background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: active ? '#00d4ff' : '#8892b0',
                borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
                fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; e.currentTarget.style.color = '#e8eaf6'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892b0'; } }}
            >
              <Icon size={16} />
              {label}
              {badge && (
                <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#ff6b00' }} />
              )}
              {active && !badge && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', padding: '10px 14px',
            background: 'transparent',
            border: '1px solid rgba(255,61,119,0.3)',
            color: '#ff3d77', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: '0.88rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,61,119,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}