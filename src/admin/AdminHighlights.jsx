/**
 * AdminHighlights.jsx — Premium light-theme highlights management
 */
import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const EMPTY_FORM = { image_url:'', description:'' }

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [toast,      setToast]      = useState(null)

  const fetchHighlights = async () => {
    const { data } = await supabase.from('highlights').select('*').order('created_at',{ ascending:false })
    setHighlights(data||[]); setLoading(false)
  }
  useEffect(() => { fetchHighlights() }, [])

  const handleFieldChange = (key) => (e) => setForm(f => ({ ...f, [key]:e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image_url) { setToast({ message:'Image URL is required.', type:'error' }); return }
    setSaving(true)
    try {
      await supabase.from('highlights').insert([form])
      setToast({ message:'Highlight added!', type:'success' }); setModal(false); setForm(EMPTY_FORM); fetchHighlights()
    } catch(err) { setToast({ message:err.message, type:'error' }) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this highlight?')) return
    await supabase.from('highlights').delete().eq('id',id)
    setToast({ message:'Highlight deleted.', type:'success' }); fetchHighlights()
  }

  const inputStyle = { background:'#FAFAFA', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'10px 14px', fontSize:14, color:'#0F172A', outline:'none', width:'100%', fontFamily:'var(--font-body)' }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:16 }}>
        <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>Add images from past events to the public gallery.</p>
        <button onClick={() => setModal(true)} className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }}><Plus size={15}/> Add Image</button>
      </div>

      {/* Tip */}
      <div style={{ background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:'0.84rem', color:'#374151', display:'flex', gap:10, alignItems:'flex-start' }}>
        <span style={{ color:'#4F46E5', flexShrink:0 }}>💡</span>
        <span><strong>Tip:</strong> Upload images to GitHub and paste the raw URL: <code style={{ background:'rgba(79,70,229,0.1)', padding:'1px 6px', borderRadius:4, color:'#4F46E5', fontSize:12 }}>https://github.com/user-attachments/assets/...</code></span>
      </div>

      {loading ? (
        <div style={{ padding:60, textAlign:'center' }}><div style={{ width:36, height:36, border:'2px solid #E5E7EB', borderTop:'2px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} /></div>
      ) : highlights.length === 0 ? (
        <div style={{ padding:80, textAlign:'center', color:'#9CA3AF', background:'#fff', borderRadius:20, border:'1px solid #E5E7EB' }}>
          <ImageIcon size={44} style={{ margin:'0 auto 14px', opacity:0.3 }} />
          <p style={{ marginBottom:16 }}>No highlights yet.</p>
          <button onClick={() => setModal(true)} className="btn-primary" style={{ fontSize:14 }}><Plus size={14}/> Add First Image</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:14 }}>
          {highlights.map(h => (
            <div key={h.id} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
              <img src={h.image_url} alt={h.description} style={{ width:'100%', height:150, objectFit:'cover', display:'block' }} onError={e=>{ e.currentTarget.style.display='none' }} />
              <div style={{ padding:'10px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                <span style={{ fontSize:'0.78rem', color:'#9CA3AF', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {h.description||'No description'}
                </span>
                <button onClick={() => handleDelete(h.id)} style={{ width:28, height:28, borderRadius:6, background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth:460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color:'#0F172A' }}>Add Highlight</h3>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Image URL *</label>
                <input style={inputStyle} value={form.image_url} onChange={handleFieldChange('image_url')} placeholder="https://github.com/user-attachments/assets/..." required />
              </div>
              {form.image_url && (
                <div style={{ marginBottom:20 }}>
                  <img src={form.image_url} alt="Preview" style={{ width:'100%', height:150, objectFit:'cover', borderRadius:10, border:'1px solid #E5E7EB' }} onError={e => { e.currentTarget.style.display='none' }} />
                </div>
              )}
              <div className="form-group">
                <label>Description</label>
                <input style={inputStyle} value={form.description} onChange={handleFieldChange('description')} placeholder="VSpark 2024 Opening Ceremony" />
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline" style={{ padding:'10px 20px', fontSize:14 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }} disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation:'rotate 0.8s linear infinite' }}/> Adding...</> : <><Save size={14}/> Add Highlight</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
