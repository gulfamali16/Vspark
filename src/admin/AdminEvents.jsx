/**
 * AdminEvents.jsx — Premium light-theme events CRUD
 */
import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const EMPTY_FORM = { title:'', description:'', date:'', venue:'', image_url:'', category:'' }
const CATEGORIES  = ['Main Event','Deadline','Orientation','Workshop','Competition','Other']

const CAT_STYLES = {
  'Main Event':  { bg:'#EEF2FF', color:'#4F46E5' },
  'Deadline':    { bg:'#FEF2F2', color:'#DC2626' },
  'Orientation': { bg:'#F5F3FF', color:'#7C3AED' },
  'Workshop':    { bg:'#ECFDF5', color:'#059669' },
  'Competition': { bg:'#FFF7ED', color:'#F97316' },
  'Other':       { bg:'#F3F4F6', color:'#6B7280' },
}

export default function AdminEvents() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date',{ ascending:false })
    setEvents(data||[]); setLoading(false)
  }
  useEffect(() => { fetchEvents() }, [])

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setModal(true) }
  const openEdit = (ev) => {
    setForm({ title:ev.title, description:ev.description||'', date:ev.date?.slice(0,16)||'', venue:ev.venue||'', image_url:ev.image_url||'', category:ev.category||'' })
    setEditing(ev.id); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await supabase.from('events').update(form).eq('id',editing); setToast({ message:'Event updated!', type:'success' }) }
      else          { await supabase.from('events').insert([form]); setToast({ message:'Event created!', type:'success' }) }
      setModal(false); fetchEvents()
    } catch(err) { setToast({ message:err.message, type:'error' }) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id',id)
    setToast({ message:'Event deleted.', type:'success' }); fetchEvents()
  }

  const hfc = (key) => (e) => setForm(f => ({ ...f, [key]:e.target.value }))

  const inputStyle = { background:'#FAFAFA', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'10px 14px', fontSize:14, color:'#0F172A', outline:'none', width:'100%', fontFamily:'var(--font-body)' }
  const actionBtn  = (color,bg) => ({ width:32, height:32, borderRadius:8, background:bg, border:`1px solid ${color}30`, color:color, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s' })

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:16 }}>
        <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>Manage upcoming and past events for VSpark 2025.</p>
        <button onClick={openAdd} className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }}><Plus size={15}/> Add Event</button>
      </div>

      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:20, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ padding:60, textAlign:'center' }}><div style={{ width:36, height:36, border:'2px solid #E5E7EB', borderTop:'2px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} /></div>
        ) : events.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'#9CA3AF' }}>
            <Calendar size={44} style={{ margin:'0 auto 14px', opacity:0.3 }} />
            <p style={{ marginBottom:16 }}>No events yet.</p>
            <button onClick={openAdd} className="btn-primary" style={{ fontSize:14 }}><Plus size={14}/> Add First Event</button>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map(ev => {
                  const s = CAT_STYLES[ev.category] || CAT_STYLES['Other']
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight:600, color:'#0F172A', maxWidth:240 }}>{ev.title}</td>
                      <td><span style={{ background:s.bg, color:s.color, padding:'3px 10px', borderRadius:100, fontSize:12, fontWeight:700 }}>{ev.category||'Event'}</span></td>
                      <td style={{ fontSize:'0.875rem' }}>{ev.date ? new Date(ev.date).toLocaleDateString() : '—'}</td>
                      <td style={{ fontSize:'0.875rem', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.venue||'—'}</td>
                      <td>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={() => openEdit(ev)} style={actionBtn('#4F46E5','#EEF2FF')} onMouseEnter={e=>{e.currentTarget.style.background='#C7D2FE'}} onMouseLeave={e=>{e.currentTarget.style.background='#EEF2FF'}}><Edit2 size={13}/></button>
                          <button onClick={() => handleDelete(ev.id)} style={actionBtn('#DC2626','#FEF2F2')} onMouseEnter={e=>{e.currentTarget.style.background='#FECACA'}} onMouseLeave={e=>{e.currentTarget.style.background='#FEF2F2'}}><Trash2 size={13}/></button>
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

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color:'#0F172A' }}>{editing ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input style={inputStyle} value={form.title} onChange={hfc('title')} placeholder="VSpark 2025 Main Event" required /></div>
              <div className="form-group"><label>Category</label>
                <select style={inputStyle} value={form.category} onChange={hfc('category')}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date & Time</label><input style={inputStyle} type="datetime-local" value={form.date} onChange={hfc('date')} /></div>
              <div className="form-group"><label>Venue</label><input style={inputStyle} value={form.venue} onChange={hfc('venue')} placeholder="COMSATS Vehari Campus, Auditorium" /></div>
              <div className="form-group"><label>Image URL</label><input style={inputStyle} value={form.image_url} onChange={hfc('image_url')} placeholder="https://..." /></div>
              <div className="form-group"><label>Description</label><textarea style={inputStyle} rows={4} value={form.description} onChange={hfc('description')} placeholder="Event description..." /></div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline" style={{ padding:'10px 20px', fontSize:14 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }} disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation:'rotate 0.8s linear infinite' }}/> Saving...</> : <><Save size={14}/> Save Event</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
