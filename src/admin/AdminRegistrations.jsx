/**
 * AdminRegistrations.jsx — Premium light-theme registrations management
 */
import React, { useEffect, useState } from 'react'
import { Download, Search, Users, Filter, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

export default function AdminRegistrations() {
  const [regs,        setRegs]        = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterEvent, setFilterEvent] = useState('')
  const [events,      setEvents]      = useState([])
  const [toast,       setToast]       = useState(null)

  const fetchRegistrations = async () => {
    const [{ data: regData }] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at',{ ascending:false }),
    ])
    const allRegs = regData||[]
    setRegs(allRegs); setFiltered(allRegs)
    setEvents([...new Set(allRegs.map(r => r.event_name).filter(Boolean))])
    setLoading(false)
  }
  useEffect(() => { fetchRegistrations() }, [])

  useEffect(() => {
    let result = regs
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r => r.student_name?.toLowerCase().includes(q) || r.reg_number?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q))
    }
    if (filterEvent) result = result.filter(r => r.event_name === filterEvent)
    setFiltered(result)
  }, [search, filterEvent, regs])

  const handleExport = () => {
    try {
      const toRow = (r) => ({ Name:r.student_name, Email:r.email, 'Reg No':r.reg_number, Department:r.department, Event:r.event_name, Date:new Date(r.created_at).toLocaleDateString() })
      const XLSX = window.XLSX
      if (!XLSX) {
        const headers = ['Name','Email','Reg No','Department','Event','Date']
        const rows    = filtered.map(r => Object.values(toRow(r)))
        const csv     = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob    = new Blob([csv],{ type:'text/csv' })
        const url     = URL.createObjectURL(blob)
        const a       = document.createElement('a')
        a.href=url; a.download='vspark-registrations.csv'; a.click()
        URL.revokeObjectURL(url)
        setToast({ message:'Exported as CSV!', type:'success' }); return
      }
      const ws = XLSX.utils.json_to_sheet(filtered.map(toRow))
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws,'Registrations')
      XLSX.writeFile(wb,'vspark-registrations.xlsx')
      setToast({ message:'Exported as Excel!', type:'success' })
    } catch(err) { setToast({ message:'Export failed: '+err.message, type:'error' }) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return
    await supabase.from('registrations').delete().eq('id',id)
    setToast({ message:'Registration deleted.', type:'success' }); fetchRegistrations()
  }

  const sharedInput = { background:'#fff', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'9px 14px', fontSize:14, color:'#0F172A', outline:'none', fontFamily:'var(--font-body)', width:'100%' }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Filters bar */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:10, flex:1, flexWrap:'wrap' }}>
          {/* Search */}
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, reg no..." style={{ ...sharedInput, paddingLeft:38 }} />
          </div>
          {/* Event filter */}
          <div style={{ position:'relative', minWidth:180 }}>
            <Filter size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
            <select value={filterEvent} onChange={e=>setFilterEvent(e.target.value)} style={{ ...sharedInput, paddingLeft:38, cursor:'pointer' }}>
              <option value="">All Events</option>
              {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ color:'#9CA3AF', fontSize:'0.875rem' }}>
            <strong style={{ color:'#4F46E5' }}>{filtered.length}</strong> results
          </span>
          <button onClick={handleExport} className="btn-primary" style={{ padding:'9px 18px', fontSize:14 }}>
            <Download size={14}/> Export
          </button>
        </div>
      </div>

      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:20, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ padding:60, textAlign:'center' }}><div style={{ width:36, height:36, border:'2px solid #E5E7EB', borderTop:'2px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'#9CA3AF' }}>
            <Users size={44} style={{ margin:'0 auto 14px', opacity:0.3 }} />
            <p>{regs.length===0 ? 'No registrations yet.' : 'No results match your search.'}</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Reg. No.</th><th>Department</th><th>Event</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {filtered.map(reg => (
                  <tr key={reg.id}>
                    <td style={{ fontWeight:600, color:'#0F172A' }}>{reg.student_name}</td>
                    <td style={{ fontSize:'0.84rem' }}>{reg.email}</td>
                    <td>{reg.reg_number}</td>
                    <td style={{ fontSize:'0.84rem' }}>{reg.department}</td>
                    <td><span style={{ background:'#EEF2FF', color:'#4F46E5', padding:'3px 10px', borderRadius:100, fontSize:'0.74rem', fontWeight:700, whiteSpace:'nowrap' }}>{reg.event_name}</span></td>
                    <td style={{ fontSize:'0.8rem' }}>{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(reg.id)} style={{ width:30, height:30, borderRadius:7, background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Trash2 size={13}/>
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
