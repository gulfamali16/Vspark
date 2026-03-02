import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Image, TrendingUp } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, registrations: 0, blogs: 0, highlights: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('registrations').select('id', { count: 'exact' }),
      supabase.from('blogs').select('id', { count: 'exact' }),
      supabase.from('highlights').select('id', { count: 'exact' }),
      supabase.from('registrations').select('*').order('id', { ascending: false }).limit(5),
    ]).then(([events, regs, blogs, highlights, recentRegs]) => {
      setStats({
        events: events.count || 0,
        registrations: regs.count || 0,
        blogs: blogs.count || 0,
        highlights: highlights.count || 0,
      });
      setRecent(recentRegs.data || []);
    });
  }, []);

  const cards = [
    { icon: Calendar, label: 'Total Events', value: stats.events, color: '#00d4ff' },
    { icon: Users, label: 'Registrations', value: stats.registrations, color: '#7c3aed' },
    { icon: FileText, label: 'Blog Posts', value: stats.blogs, color: '#ff6b00' },
    { icon: Image, label: 'Highlights', value: stats.highlights, color: '#ffd700' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>VSpark 2025 Admin Overview</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {cards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass" style={{ padding: '1.75rem', borderRadius: 2, borderLeft: `3px solid ${color}`, transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 30px ${color}20`}
              onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Icon size={24} style={{ color }} />
                <TrendingUp size={16} style={{ color: '#00ff88' }} />
              </div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: '#e8eaf6', lineHeight: 1, letterSpacing: 2 }}>{value}</div>
              <div style={{ color: '#8892b0', fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent registrations */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 2 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} style={{ color: '#00d4ff' }} /> Recent Registrations
          </h2>
          {recent.length === 0 ? (
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>No registrations yet. They will appear here after students register.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                    {['Name', 'Email', 'Reg #', 'Department', 'Event'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'Bebas Neue', letterSpacing: 1.5, color: '#00d4ff', fontSize: '0.85rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.05)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      {[r.student_name, r.email, r.reg_number, r.department, r.event_id].map((val, vi) => (
                        <td key={vi} style={{ padding: '10px 12px', color: '#8892b0', fontSize: '0.9rem' }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
