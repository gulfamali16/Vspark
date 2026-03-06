import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader, Save, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const empty = { title: '', description: '', category: '', icon: '', registration_fee: 0, is_active: true }
const categories = ['Programming', 'Gaming', 'Development', 'Design', 'AI', 'Quiz', 'Other']

export default function AdminCompetitions() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('competitions').select('*').order('title')
    setCompetitions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (c) => {
    setForm({ title: c.title, description: c.description || '', category: c.category || '', icon: c.icon || '', registration_fee: c.registration_fee || 0, is_active: c.is_active !== false })
    setEditing(c.id)
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, registration_fee: parseInt(form.registration_fee) || 0 }
      if (editing) {
        await supabase.from('competitions').update(payload).eq('id', editing)
        setToast({ message: 'Competition updated!', type: 'success' })
      } else {
        await supabase.from('competitions').insert([payload])
        setToast({ message: 'Competition created!', type: 'success' })
      }
      setModal(false)
      load()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this competition?')) return
    await supabase.from('competitions').delete().eq('id', id)
    setToast({ message: 'Competition deleted.', type: 'success' })
    load()
  }

  const h = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage competition categories for VSpark.</p>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Competition
        </button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : competitions.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ marginBottom: 16 }}>No competitions yet.</p>
            <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add First Competition</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Icon</th><th>Title</th><th>Category</th><th>Fee (PKR)</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {competitions.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontSize: '1.5rem' }}>{c.icon || '🏆'}</td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>
                      <span style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {c.category || 'Other'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.registration_fee > 0 ? `PKR ${c.registration_fee}` : 'Free'}</td>
                    <td>
                      <span style={{ background: c.is_active !== false ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: c.is_active !== false ? '#22c55e' : '#f87171', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        {c.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(c)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
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
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>{editing ? 'Edit Competition' : 'Add Competition'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={h('title')} placeholder="Speed Programming" required /></div>
              <div className="form-group"><label>Icon (emoji or text)</label><input value={form.icon} onChange={h('icon')} placeholder="💻" /></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={h('category')}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Registration Fee (PKR)</label><input type="number" min="0" value={form.registration_fee} onChange={h('registration_fee')} placeholder="0" /></div>
              <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={h('description')} placeholder="Competition description..." /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={h('is_active')} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer' }}>Active (visible on website)</label>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation: 'rotate 0.8s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
