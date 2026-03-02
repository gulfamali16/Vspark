import React, { useEffect, useState } from 'react'
import { Download, Search, Users, Filter, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterEvent, setFilterEvent] = useState('')
  const [events, setEvents] = useState([])
  const [toast, setToast] = useState(null)

  const load = async () => {
    const [{ data: regData }, { data: evData }] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('title'),
    ])
    setRegs(regData || [])
    setFiltered(regData || [])
    const evNames = [...new Set((regData || []).map(r => r.event_name).filter(Boolean))]
    setEvents(evNames)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let f = regs
    if (search) f = f.filter(r => r.student_name?.toLowerCase().includes(search.toLowerCase()) || r.reg_number?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase()))
    if (filterEvent) f = f.filter(r => r.event_name === filterEvent)
    setFiltered(f)
  }, [search, filterEvent, regs])

  const handleExport = () => {
    try {
      const XLSX = window.XLSX
      if (!XLSX) {
        // Fallback: CSV export
        const headers = ['Name', 'Email', 'Reg No', 'Department', 'Event', 'Date']
        const rows = filtered.map(r => [r.student_name, r.email, r.reg_number, r.department, r.event_name, new Date(r.created_at).toLocaleDateString()])
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'vspark-registrations.csv'; a.click()
        setToast({ message: 'Exported as CSV!', type: 'success' })
        return
      }
      const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
        Name: r.student_name, Email: r.email, 'Reg No': r.reg_number,
        Department: r.department, Event: r.event_name,
        Date: new Date(r.created_at).toLocaleDateString(),
      })))
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations')
      XLSX.writeFile(wb, 'vspark-registrations.xlsx')
      setToast({ message: 'Exported as Excel!', type: 'success' })
    } catch (e) {
      setToast({ message: 'Export failed: ' + e.message, type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return
    await supabase.from('registrations').delete().eq('id', id)
    setToast({ message: 'Registration deleted.', type: 'success' })
    load()
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, reg no..."
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div style={{ position: 'relative', minWidth: 180 }}>
            <Filter size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ paddingLeft: 40 }}>
              <option value="">All Events</option>
              {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> results
          </span>
          <button onClick={handleExport} className="btn-primary" style={{ padding: '10px 20px' }}>
            <Download size={16} /> Export
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
                <tr><th>Name</th><th>Email</th><th>Reg. No.</th><th>Department</th><th>Event</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(reg => (
                  <tr key={reg.id}>
                    <td style={{ fontWeight: 600 }}>{reg.student_name}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reg.email}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{reg.reg_number}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reg.department}</td>
                    <td>
                      <span style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {reg.event_name}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(reg.id)} style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={13} />
                      </button>
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
