import React, { useEffect, useState } from 'react'
import { Calendar, Users, BookOpen, Image, TrendingUp, Zap, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, registrations: 0, blogs: 0, highlights: 0 })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, registrations, blogs, highlights, recent] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('registrations').select('id', { count: 'exact', head: true }),
          supabase.from('blogs').select('id', { count: 'exact', head: true }),
          supabase.from('highlights').select('id', { count: 'exact', head: true }),
          supabase.from('registrations').select('*').order('created_at', { ascending: false }).limit(5),
        ])
        setStats({
          events: events.count || 0,
          registrations: registrations.count || 0,
          blogs: blogs.count || 0,
          highlights: highlights.count || 0,
        })
        setRecentRegs(recent.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { icon: <Calendar size={22} />, label: 'Total Events', value: stats.events, color: '#00D4FF', change: 'Manage all events' },
    { icon: <Users size={22} />, label: 'Registrations', value: stats.registrations, color: '#7C3AED', change: 'Total students registered' },
    { icon: <BookOpen size={22} />, label: 'Blog Posts', value: stats.blogs, color: '#10B981', change: 'Published articles' },
    { icon: <Image size={22} />, label: 'Highlights', value: stats.highlights, color: '#F59E0B', change: 'Gallery images' },
  ]

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '3px', color: 'var(--primary)', textTransform: 'uppercase' }}>VSpark 2025</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Welcome back, Admin! 👋</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage events, registrations, blogs, and highlights from this dashboard.</p>
        </div>
        <div style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>Main Event</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem' }}>December 10, 2025</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>COMSATS Vehari Campus</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {statCards.map((card, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${card.color}15`, border: `1px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              <TrendingUp size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: card.color, marginBottom: 4 }}>
              {loading ? '—' : card.value}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>{card.label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{card.change}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem' }}>Recent Registrations</h3>
          </div>
          <a href="/admin/registrations" style={{ color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.8rem' }}>View all →</a>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : recentRegs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No registrations yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Name</th><th>Reg. No.</th><th>Event</th><th>Department</th><th>Registered</th></tr>
              </thead>
              <tbody>
                {recentRegs.map(reg => (
                  <tr key={reg.id}>
                    <td style={{ fontWeight: 600 }}>{reg.student_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{reg.reg_number}</td>
                    <td>
                      <span style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {reg.event_name}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{reg.department}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
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
