import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Image, TrendingUp, Clock, CheckCircle, XCircle, Swords, Shield, UserCog } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, pending: 0, approved: 0, rejected: 0, blogs: 0, competitions: 0 });
  const [recent, setRecent] = useState([]);
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('Admin');
  const [perms, setPerms] = useState(['all']);

  useEffect(() => {
    // Get role info from sessionStorage
    const storedRole  = sessionStorage.getItem('vspark_role')  || 'admin';
    const storedName  = sessionStorage.getItem('vspark_name')  || 'Admin';
    const storedPerms = sessionStorage.getItem('vspark_perms');
    setRole(storedRole);
    setName(storedName);
    setPerms(storedPerms ? JSON.parse(storedPerms) : ['all']);

    // Load stats
    Promise.all([
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'approved'),
      supabase.from('registration_requests').select('id', { count: 'exact' }).eq('status', 'rejected'),
      supabase.from('blogs').select('id', { count: 'exact' }),
      supabase.from('competitions').select('id', { count: 'exact' }),
      supabase.from('registration_requests').select('*, competitions(title)').order('id', { ascending: false }).limit(6),
    ]).then(([ev, pend, appr, rej, bl, comp, rec]) => {
      setStats({
        events: ev.count || 0,
        pending: pend.count || 0,
        approved: appr.count || 0,
        rejected: rej.count || 0,
        blogs: bl.count || 0,
        competitions: comp.count || 0,
      });
      setRecent(rec.data || []);
    });
  }, []);

  const isAdmin = role === 'admin';
  const hasAll  = perms.includes('all');

  const cards = [
    { icon: Clock,         label: 'Pending',      value: stats.pending,      color: '#ff6b00', perm: 'registrations', urgent: stats.pending > 0 },
    { icon: CheckCircle,   label: 'Approved',     value: stats.approved,     color: '#00ff88', perm: 'registrations' },
    { icon: XCircle,       label: 'Rejected',     value: stats.rejected,     color: '#ff3d77', perm: 'registrations' },
    { icon: Swords,        label: 'Competitions', value: stats.competitions, color: '#7c3aed', perm: 'competitions' },
    { icon: Calendar,      label: 'Events',       value: stats.events,       color: '#00d4ff', perm: 'events' },
    { icon: FileText,      label: 'Blogs',        value: stats.blogs,        color: '#ffd700', perm: 'blogs' },
  ].filter(c => hasAll || perms.includes(c.perm));

  const statusColor = s => s === 'approved' ? '#00ff88' : s === 'rejected' ? '#ff3d77' : '#ff6b00';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2.5rem' }}>

        {/* Header — shows correct name and role */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: 3, color: '#e8eaf6', lineHeight: 1 }}>
                Dashboard
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: isAdmin ? 'rgba(0,212,255,0.08)' : 'rgba(124,58,237,0.08)', border: `1px solid ${isAdmin ? 'rgba(0,212,255,0.2)' : 'rgba(124,58,237,0.2)'}` }}>
                {isAdmin
                  ? <Shield size={12} style={{ color: '#00d4ff' }} />
                  : <UserCog size={12} style={{ color: '#7c3aed' }} />
                }
                <span style={{ color: isAdmin ? '#00d4ff' : '#7c3aed', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', letterSpacing: 2 }}>
                  {isAdmin ? 'SUPER ADMIN' : 'ASSISTANT'}
                </span>
              </div>
            </div>
            <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.76rem' }}>
              Welcome back, <span style={{ color: isAdmin ? '#00d4ff' : '#7c3aed' }}>{name}</span> — VSpark Control Panel
            </p>
          </div>

          {/* Show assistant permissions as tags */}
          {!isAdmin && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p style={{ color: '#8892b0', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', marginBottom: 5, letterSpacing: 1 }}>YOUR ACCESS</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {perms.map(p => (
                  <span key={p} style={{ padding: '1px 8px', background: 'rgba(124,58,237,0.12)', color: '#7c3aed', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', border: '1px solid rgba(124,58,237,0.25)', textTransform: 'capitalize' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pending alert */}
        {stats.pending > 0 && (hasAll || perms.includes('registrations')) && (
          <div style={{ marginBottom: '2rem', padding: '1rem 1.5rem', background: 'rgba(255,107,0,0.07)', border: '1px solid rgba(255,107,0,0.3)', borderLeft: '4px solid #ff6b00', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Clock size={18} style={{ color: '#ff6b00', flexShrink: 0 }} />
            <p style={{ color: '#ff6b00', fontWeight: 600, fontSize: '0.92rem' }}>
              <strong>{stats.pending}</strong> pending registration request{stats.pending > 1 ? 's' : ''} waiting for approval.
            </p>
            <a href="/admin/registrations" style={{ marginLeft: 'auto', color: '#ff6b00', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', textDecoration: 'underline', whiteSpace: 'nowrap' }}>Review →</a>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {cards.map(({ icon: Icon, label, value, color, urgent }) => (
            <div key={label} className="glass" style={{ padding: '1.5rem', borderLeft: `3px solid ${color}`, transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 30px ${color}20`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Icon size={20} style={{ color }} />
                <TrendingUp size={13} style={{ color: '#00ff88' }} />
              </div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.8rem', color: '#e8eaf6', lineHeight: 1, letterSpacing: 2 }}>{value}</div>
              <div style={{ color: '#8892b0', fontSize: '0.78rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent requests — only show if has access */}
        {(hasAll || perms.includes('registrations')) && (
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: 2, color: '#e8eaf6', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={16} style={{ color: '#00d4ff' }} /> Recent Requests
            </h2>
            {recent.length === 0
              ? <p style={{ color: '#8892b0', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>No requests yet.</p>
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
                        {['Name', 'Email', 'Institute', 'Competition', 'Status'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: 'Bebas Neue', letterSpacing: 1.5, color: '#00d4ff', fontSize: '0.78rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                          <td style={{ padding: '8px 10px', color: '#e8eaf6', fontWeight: 600, fontSize: '0.87rem' }}>{r.student_name}</td>
                          <td style={{ padding: '8px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.email}</td>
                          <td style={{ padding: '8px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.institute}</td>
                          <td style={{ padding: '8px 10px', color: '#8892b0', fontSize: '0.82rem' }}>{r.competitions?.title || r.competition_id}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', background: `${statusColor(r.status)}15`, color: statusColor(r.status), fontSize: '0.7rem', fontFamily: 'JetBrains Mono', border: `1px solid ${statusColor(r.status)}35` }}>
                              {r.status?.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}
      </main>
    </div>
  );
}