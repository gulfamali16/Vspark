import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, BookOpen, Image, LogOut, Menu, X, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', exact: true },
  { to: '/admin/events', icon: <Calendar size={18} />, label: 'Events' },
  { to: '/admin/registrations', icon: <Users size={18} />, label: 'Registrations' },
  { to: '/admin/blogs', icon: <BookOpen size={18} />, label: 'Blogs' },
  { to: '/admin/highlights', icon: <Image size={18} />, label: 'Highlights' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 32 }} />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '4px 12px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: '#7C3AED', fontWeight: 700, letterSpacing: '1px' }}>ADMIN PANEL</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: 'none',
                color: active ? 'white' : 'var(--text-muted)',
                background: active ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <span style={{ color: active ? 'var(--primary)' : 'inherit', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 8 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Logged in as</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 16px', background: 'transparent',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
            color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-heading)',
            fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <div className="admin-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile header */}
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-admin-header">
        <img src={VSPARK_LOGO} alt="VSpark" style={{ height: 28 }} />
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 260, height: '100%', background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="admin-content">
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '3px', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>
              VSpark 2025
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
              {navItems.find(n => isActive(n))?.label || 'Dashboard'}
            </h1>
          </div>
          <a href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(0,212,255,0.2)', padding: '8px 16px', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Zap size={14} /> View Website
          </a>
        </div>

        <Outlet />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .mobile-admin-header { display: flex !important; }
          .admin-content { margin-left: 0 !important; padding-top: 80px !important; }
        }
      `}</style>
    </div>
  )
}
