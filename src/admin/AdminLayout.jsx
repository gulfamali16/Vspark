/**
 * AdminLayout.jsx — Premium light-theme admin shell
 */
import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, BookOpen, Image, LogOut, Menu, X, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const VSPARK_LOGO = 'https://github.com/user-attachments/assets/898fc673-4cc8-440d-957e-21d6942085e5'

const NAV_ITEMS = [
  { to:'/admin',               icon:<LayoutDashboard size={17}/>, label:'Dashboard',     exact:true },
  { to:'/admin/events',        icon:<Calendar size={17}/>,        label:'Events' },
  { to:'/admin/registrations', icon:<Users size={17}/>,           label:'Registrations' },
  { to:'/admin/blogs',         icon:<BookOpen size={17}/>,        label:'Blogs' },
  { to:'/admin/highlights',    icon:<Image size={17}/>,           label:'Highlights' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }
  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  const SidebarContent = () => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Logo */}
      <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <img src={VSPARK_LOGO} alt="VSpark" style={{ height:32, marginBottom:12 }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:100, padding:'3px 10px' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#22C55E' }} />
          <span style={{ fontSize:11, fontWeight:700, color:'#4F46E5', letterSpacing:'0.05em', textTransform:'uppercase' }}>Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'16px 12px' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item)
          return (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              borderRadius:10, marginBottom:2, textDecoration:'none',
              color:      active ? '#4F46E5' : '#6B7280',
              background: active ? '#EEF2FF' : 'transparent',
              fontWeight: active ? 600 : 500,
              fontSize:   '14px',
              transition: 'all 0.18s',
            }}
              onMouseEnter={e=>{ if (!active){ e.currentTarget.style.background='#F9FAFB'; e.currentTarget.style.color='#374151' } }}
              onMouseLeave={e=>{ if (!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B7280' } }}
            >
              {item.icon} {item.label}
              {active && <ChevronRight size={13} style={{ marginLeft:'auto', color:'#4F46E5' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding:'16px 12px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ padding:'10px 14px', background:'#F9F7F4', borderRadius:10, marginBottom:8 }}>
          <div style={{ fontSize:11, color:'#9CA3AF', marginBottom:2, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Logged in as</div>
          <div style={{ fontSize:'0.84rem', fontWeight:600, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
        </div>
        <button onClick={handleSignOut} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'transparent', border:'1.5px solid #FECACA', borderRadius:10, color:'#DC2626', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px', transition:'all 0.18s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='#FEF2F2' }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent' }}
        >
          <LogOut size={15}/> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <div className="admin-sidebar"><SidebarContent /></div>

      {/* Mobile header */}
      <div style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:200, background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'14px 20px', alignItems:'center', justifyContent:'space-between' }} className="mobile-admin-header">
        <img src={VSPARK_LOGO} alt="VSpark" style={{ height:28 }} />
        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{ background:'none', border:'none', color:'#374151', cursor:'pointer' }}>
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:150 }}>
          <div onClick={()=>setMobileOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.4)' }} />
          <div style={{ position:'absolute', top:0, left:0, width:260, height:'100%', background:'#fff', borderRight:'1px solid #E5E7EB' }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="admin-content">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'#4F46E5', textTransform:'uppercase', marginBottom:4 }}>VSpark 2025</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:800, color:'#0F172A' }}>
              {NAV_ITEMS.find(n=>isActive(n))?.label || 'Dashboard'}
            </h1>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize:'13px', padding:'8px 16px' }}>
            <Zap size={13}/> View Website
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
