import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, Image, LogOut, ChevronRight } from 'lucide-react';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/registrations', icon: Users, label: 'Registrations' },
  { to: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { to: '/admin/highlights', icon: Image, label: 'Highlights' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = () => { sessionStorage.removeItem('vspark_admin'); navigate('/admin/login'); };

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: '#02040c',
      borderRight: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: 3 }}>
          V<span style={{ color: '#00d4ff' }}>SPARK</span> <span style={{ color: '#ff6b00', fontSize:'1rem' }}>2025</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#8892b0', marginTop: 2, letterSpacing: 2 }}>ADMIN PANEL</div>
      </div>
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              textDecoration: 'none', marginBottom: 2,
              background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: active ? '#00d4ff' : '#8892b0',
              borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            }}>
              <Icon size={16} />{label}
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <button onClick={logout} style={{
          width: '100%', padding: '10px 14px', background: 'transparent',
          border: '1px solid rgba(255,61,119,0.3)', color: '#ff3d77',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.9rem',
          transition: 'all 0.2s',
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
