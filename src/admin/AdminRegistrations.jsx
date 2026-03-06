import React, { useEffect, useState } from 'react'
import { Download, Search, Users, Filter, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected']

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('All')
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    setRegs(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let f = regs
    if (search) f = f.filter(r =>
      r.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reg_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.institution_name?.toLowerCase().includes(search.toLowerCase())
    )
    if (statusTab !== 'All') f = f.filter(r => (r.status || 'pending').toLowerCase() === statusTab.toLowerCase())
    setFiltered(f)
  }, [search, statusTab, regs])

  const handleApprove = async (id, email) => {
    try {
      await supabase.from('registrations').update({ status: 'approved' }).eq('id', id)
      // Call edge function to generate credentials and send email
      await supabase.functions.invoke('approve-registration', { body: { registration_id: id } })
      setToast({ message: `Approved! Credentials sent to ${email}.`, type: 'success' })
      load()
    } catch (err) {
      setToast({ message: err.message || 'Approval failed.', type: 'error' })
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject this registration?')) return
    await supabase.from('registrations').update({ status: 'rejected' }).eq('id', id)
    setToast({ message: 'Registration rejected.', type: 'success' })
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return
    await supabase.from('registrations').delete().eq('id', id)
    setToast({ message: 'Registration deleted.', type: 'success' })
    load()
  }

  const handleExport = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Institution', 'Department', 'Reg No', 'Competition', 'Transaction ID', 'Screenshot', 'Status', 'Date']
      const rows = filtered.map(r => [
        r.student_name, r.email, r.phone || '', r.institution_name || '', r.department || '',
        r.reg_number, r.event_name || '', r.transaction_id || '', r.screenshot_url || '',
        r.status || 'pending', new Date(r.created_at).toLocaleDateString(),
      ])
      const csv = [headers, ...rows].map(row => row.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'vspark-registrations.csv'; a.click()
      setToast({ message: 'Exported as CSV!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Export failed: ' + err.message, type: 'error' })
    }
  }

  const counts = {
    All: regs.length,
    Pending: regs.filter(r => !r.status || r.status === 'pending').length,
    Approved: regs.filter(r => r.status === 'approved').length,
    Rejected: regs.filter(r => r.status === 'rejected').length,
  }

  const statusColor = (s) => {
    if (s === 'approved') return { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' }
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.1)', color: '#f87171' }
    return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setStatusTab(tab)} style={{
            padding: '8px 18px',
            background: statusTab === tab ? 'linear-gradient(135deg, var(--primary), var(--accent2))' : 'var(--surface)',
            border: '1px solid',
            borderColor: statusTab === tab ? 'transparent' : 'var(--border)',
            borderRadius: 100,
            color: statusTab === tab ? 'white' : 'var(--text-muted)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, reg no..."
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> results
          </span>
          <button onClick={handleExport} className="btn-primary" style={{ padding: '10px 20px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>{regs.length === 0 ? 'No registrations yet.' : 'No results match your search.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Institution</th><th>Competition</th><th>Transaction ID</th><th>Screenshot</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(reg => {
                  const sc = statusColor(reg.status || 'pending')
                  return (
                    <tr key={reg.id}>
                      <td style={{ fontWeight: 600 }}>{reg.student_name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reg.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reg.phone || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.institution_name || reg.department || '—'}</td>
                      <td>
                        <span style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {reg.event_name || '—'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{reg.transaction_id || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {reg.screenshot_url ? <a href={reg.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>View</a> : '—'}
                      </td>
                      <td>
                        <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {reg.status === 'approved' ? <CheckCircle size={11} /> : reg.status === 'rejected' ? <XCircle size={11} /> : <Clock size={11} />}
                          {reg.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(!reg.status || reg.status === 'pending') && (
                            <>
                              <button onClick={() => handleApprove(reg.id, reg.email)} title="Approve" style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={13} />
                              </button>
                              <button onClick={() => handleReject(reg.id)} title="Reject" style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <XCircle size={13} />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDelete(reg.id)} title="Delete" style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
