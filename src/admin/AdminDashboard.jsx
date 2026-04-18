/**
 * AdminDashboard.jsx — Premium light-theme dashboard
 */
import React, { useEffect, useState } from 'react'
import { Calendar, Users, BookOpen, Image, TrendingUp, Zap, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [stats,      setStats]      = useState({ events:0, registrations:0, blogs:0, highlights:0 })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events,registrations,blogs,highlights,recent] = await Promise.all([
          supabase.from('events').select('id',{ count:'exact', head:true }),
          supabase.from('registrations').select('id',{ count:'exact', head:true }),
          supabase.from('blogs').select('id',{ count:'exact', head:true }),
          supabase.from('highlights').select('id',{ count:'exact', head:true }),
          supabase.from('registrations').select('*').order('created_at',{ ascending:false }).limit(5),
        ])
        setStats({ events:events.count||0, registrations:registrations.count||0, blogs:blogs.count||0, highlights:highlights.count||0 })
        setRecentRegs(recent.data||[])
      } catch(err){ console.error('Dashboard fetch error:',err) }
      finally { setLoading(false) }
    }
    fetchStats()
  }, [])

  const statCards = [
    { icon:<Calendar size={20}/>, label:'Total Events',    value:stats.events,        color:'#4F46E5', bg:'#EEF2FF', sub:'Manage all events' },
    { icon:<Users    size={20}/>, label:'Registrations',   value:stats.registrations, color:'#7C3AED', bg:'#F5F3FF', sub:'Students registered' },
    { icon:<BookOpen size={20}/>, label:'Blog Posts',      value:stats.blogs,         color:'#059669', bg:'#ECFDF5', sub:'Published articles' },
    { icon:<Image    size={20}/>, label:'Highlights',      value:stats.highlights,    color:'#D97706', bg:'#FFFBEB', sub:'Gallery images' },
  ]

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:'linear-gradient(135deg, #EEF2FF, #FFF7ED)', border:'1px solid #E5E7EB', borderRadius:20, padding:'28px 32px', marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
            <Zap size={16} style={{ color:'#4F46E5' }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'#4F46E5', textTransform:'uppercase' }}>VSpark 2025</span>
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:800, color:'#0F172A', marginBottom:4 }}>Welcome back, Admin! 👋</h2>
          <p style={{ color:'#6B7280', fontSize:'0.875rem' }}>Manage events, registrations, blogs, and highlights from this dashboard.</p>
        </div>
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:14, padding:'14px 20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', color:'#4F46E5', textTransform:'uppercase', marginBottom:4 }}>Main Event</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color:'#0F172A' }}>December 10, 2025</div>
          <div style={{ color:'#9CA3AF', fontSize:'0.8rem', marginTop:2 }}>COMSATS Vehari Campus</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16, marginBottom:36 }}>
        {statCards.map((card,i) => (
          <div key={i} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:16, padding:22, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:card.bg, display:'flex', alignItems:'center', justifyContent:'center', color:card.color }}>
                {card.icon}
              </div>
              <TrendingUp size={14} style={{ color:'#D1D5DB' }} />
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:900, letterSpacing:'-0.04em', color:card.color, marginBottom:3 }}>
              {loading ? '—' : card.value}
            </div>
            <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#0F172A', marginBottom:2 }}>{card.label}</div>
            <div style={{ color:'#9CA3AF', fontSize:'0.75rem' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:20, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding:'20px 28px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <Clock size={16} style={{ color:'#4F46E5' }} />
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', color:'#0F172A' }}>Recent Registrations</h3>
          </div>
          <a href="/admin/registrations" style={{ display:'flex', alignItems:'center', gap:5, color:'#4F46E5', textDecoration:'none', fontWeight:600, fontSize:'0.8rem' }}>
            View all <ArrowRight size={13}/>
          </a>
        </div>
        {loading ? (
          <div style={{ padding:40, textAlign:'center' }}>
            <div style={{ width:32, height:32, border:'2px solid #E5E7EB', borderTop:'2px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} />
          </div>
        ) : recentRegs.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'#9CA3AF', fontSize:'0.875rem' }}>No registrations yet.</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Name</th><th>Reg. No.</th><th>Event</th><th>Department</th><th>Registered</th></tr></thead>
              <tbody>
                {recentRegs.map(reg => (
                  <tr key={reg.id}>
                    <td style={{ fontWeight:600, color:'#0F172A' }}>{reg.student_name}</td>
                    <td>{reg.reg_number}</td>
                    <td><span style={{ background:'#EEF2FF', color:'#4F46E5', padding:'3px 10px', borderRadius:100, fontSize:'0.75rem', fontWeight:600 }}>{reg.event_name}</span></td>
                    <td>{reg.department}</td>
                    <td style={{ fontSize:'0.8rem' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
