/**
 * AdminBlogs.jsx — Premium light-theme blogs CRUD
 */
import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const EMPTY_FORM = { title:'', content:'', image_url:'', author:'' }

export default function AdminBlogs() {
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)

  const fetchBlogs = async () => {
    const { data } = await supabase.from('blogs').select('*').order('created_at',{ ascending:false })
    setBlogs(data||[]); setLoading(false)
  }
  useEffect(() => { fetchBlogs() }, [])

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setModal(true) }
  const openEdit = (b) => { setForm({ title:b.title, content:b.content||'', image_url:b.image_url||'', author:b.author||'' }); setEditing(b.id); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await supabase.from('blogs').update(form).eq('id',editing); setToast({ message:'Blog updated!', type:'success' }) }
      else          { await supabase.from('blogs').insert([form]); setToast({ message:'Blog published!', type:'success' }) }
      setModal(false); fetchBlogs()
    } catch(err) { setToast({ message:err.message, type:'error' }) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blogs').delete().eq('id',id)
    setToast({ message:'Blog deleted.', type:'success' }); fetchBlogs()
  }

  const hfc = (key) => (e) => setForm(f => ({ ...f, [key]:e.target.value }))
  const inputStyle = { background:'#FAFAFA', border:'1.5px solid #E5E7EB', borderRadius:10, padding:'10px 14px', fontSize:14, color:'#0F172A', outline:'none', width:'100%', fontFamily:'var(--font-body)' }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:16 }}>
        <p style={{ color:'#6B7280', fontSize:'0.9rem' }}>Publish and manage blog posts for VSpark.</p>
        <button onClick={openAdd} className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }}><Plus size={15}/> New Blog Post</button>
      </div>

      {loading ? (
        <div style={{ padding:60, textAlign:'center' }}><div style={{ width:36, height:36, border:'2px solid #E5E7EB', borderTop:'2px solid #4F46E5', borderRadius:'50%', animation:'rotate 0.8s linear infinite', margin:'0 auto' }} /></div>
      ) : blogs.length === 0 ? (
        <div style={{ padding:80, textAlign:'center', color:'#9CA3AF', background:'#fff', borderRadius:20, border:'1px solid #E5E7EB' }}>
          <BookOpen size={44} style={{ margin:'0 auto 14px', opacity:0.3 }} />
          <p style={{ marginBottom:16 }}>No blog posts yet.</p>
          <button onClick={openAdd} className="btn-primary" style={{ fontSize:14 }}><Plus size={14}/> Write First Post</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          {blogs.map(blog => (
            <div key={blog.id} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', transition:'all 0.2s' }}>
              {blog.image_url && <img src={blog.image_url} alt={blog.title} style={{ width:'100%', height:150, objectFit:'cover' }} />}
              <div style={{ padding:20 }}>
                <div style={{ fontSize:'0.75rem', color:'#9CA3AF', marginBottom:8, fontWeight:600 }}>
                  {blog.author||'Unknown'} · {new Date(blog.created_at).toLocaleDateString()}
                </div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem', color:'#0F172A', marginBottom:8, lineHeight:1.35 }}>{blog.title}</h3>
                <p style={{ color:'#6B7280', fontSize:'0.84rem', lineHeight:1.55, marginBottom:16 }}>{blog.content?.substring(0,100)}...</p>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => openEdit(blog)} className="btn-outline" style={{ flex:1, justifyContent:'center', padding:'7px 14px', fontSize:'0.8rem' }}>
                    <Edit2 size={12}/> Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} style={{ width:34, height:34, borderRadius:8, background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth:660 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color:'#0F172A' }}>{editing ? 'Edit Blog Post' : 'New Blog Post'}</h3>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input style={inputStyle} value={form.title} onChange={hfc('title')} placeholder="Blog post title" required /></div>
              <div className="form-group"><label>Author</label><input style={inputStyle} value={form.author} onChange={hfc('author')} placeholder="Author name" /></div>
              <div className="form-group"><label>Cover Image URL</label><input style={inputStyle} value={form.image_url} onChange={hfc('image_url')} placeholder="https://..." /></div>
              <div className="form-group"><label>Content *</label><textarea style={{ ...inputStyle, minHeight:200 }} value={form.content} onChange={hfc('content')} placeholder="Write your blog post content here..." required /></div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline" style={{ padding:'10px 20px', fontSize:14 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding:'10px 20px', fontSize:14 }} disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation:'rotate 0.8s linear infinite' }}/> Saving...</> : <><Save size={14}/> {editing?'Update':'Publish'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
