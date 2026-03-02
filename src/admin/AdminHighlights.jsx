import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const empty = { image_url: '', description: '' }

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('highlights').select('*').order('created_at', { ascending: false })
    setHighlights(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image_url) { setToast({ message: 'Image URL is required.', type: 'error' }); return }
    setSaving(true)
    try {
      await supabase.from('highlights').insert([form])
      setToast({ message: 'Highlight added!', type: 'success' })
      setModal(false)
      setForm(empty)
      load()
    } catch (e) {
      setToast({ message: e.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this highlight?')) return
    await supabase.from('highlights').delete().eq('id', id)
    setToast({ message: 'Highlight deleted.', type: 'success' })
    load()
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add images from past events to the public gallery. Use GitHub image URLs.</p>
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        💡 <strong style={{ color: 'var(--text)' }}>Tip:</strong> Upload images to GitHub and use the raw URL format:
        <code style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4, marginLeft: 8, color: 'var(--primary)' }}>
          https://github.com/user-attachments/assets/...
        </code>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : highlights.length === 0 ? (
        <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
          <ImageIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ marginBottom: 16 }}>No highlights yet.</p>
          <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Add First Image</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {highlights.map(h => (
            <div key={h.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', position: 'relative', group: true }}>
              <img src={h.image_url} alt={h.description} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.description || 'No description'}
                </span>
                <button onClick={() => handleDelete(h.id)} style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>Add Highlight</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Image URL (GitHub/Direct) *</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://github.com/user-attachments/assets/..." required />
              </div>
              {form.image_url && (
                <div style={{ marginBottom: 20 }}>
                  <img src={form.image_url} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} onError={e => e.currentTarget.style.display = 'none'} />
                </div>
              )}
              <div className="form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="VSpark 2024 Opening Ceremony" />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation: 'rotate 0.8s linear infinite' }} /> Adding...</> : <><Save size={14} /> Add Highlight</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
