import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const empty = { title: '', description: '', date: '', venue: '', image_url: '', category: '' }
const categories = ['Main Event', 'Deadline', 'Orientation', 'Workshop', 'Competition', 'Other']

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (ev) => { setForm({ title: ev.title, description: ev.description || '', date: ev.date?.slice(0, 16) || '', venue: ev.venue || '', image_url: ev.image_url || '', category: ev.category || '' }); setEditing(ev.id); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('events').update(form).eq('id', editing)
        setToast({ message: 'Event updated successfully!', type: 'success' })
      } else {
        await supabase.from('events').insert([form])
        setToast({ message: 'Event created successfully!', type: 'success' })
      }
      setModal(false)
      load()
    } catch (e) {
      setToast({ message: e.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    setToast({ message: 'Event deleted.', type: 'success' })
    load()
  }

  const h = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage upcoming and past events for VSpark 2025.</p>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ marginBottom: 16 }}>No events yet.</p>
            <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add First Event</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 600, maxWidth: 250 }}>{ev.title}</td>
                    <td>
                      <span style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {ev.category || 'Event'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{ev.date ? new Date(ev.date).toLocaleDateString() : '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.venue || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(ev)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(ev.id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>{editing ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={h('title')} placeholder="VSpark 2025 Main Event" required /></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={h('category')}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={form.date} onChange={h('date')} /></div>
              <div className="form-group"><label>Venue</label><input value={form.venue} onChange={h('venue')} placeholder="COMSATS Vehari Campus, Auditorium" /></div>
              <div className="form-group"><label>Image URL</label><input value={form.image_url} onChange={h('image_url')} placeholder="https://..." /></div>
              <div className="form-group"><label>Description</label><textarea rows={4} value={form.description} onChange={h('description')} placeholder="Event description..." /></div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation: 'rotate 0.8s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save Event</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
