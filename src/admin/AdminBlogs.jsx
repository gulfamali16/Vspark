import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, X, Loader, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Toast from '../components/Toast'

const empty = { title: '', content: '', image_url: '', author: '' }

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    setBlogs(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit = (b) => { setForm({ title: b.title, content: b.content || '', image_url: b.image_url || '', author: b.author || '' }); setEditing(b.id); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('blogs').update(form).eq('id', editing)
        setToast({ message: 'Blog updated!', type: 'success' })
      } else {
        await supabase.from('blogs').insert([form])
        setToast({ message: 'Blog published!', type: 'success' })
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
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blogs').delete().eq('id', id)
    setToast({ message: 'Blog deleted.', type: 'success' })
    load()
  }

  const h = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Publish and manage blog posts for VSpark.</p>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'rotate 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ marginBottom: 16 }}>No blog posts yet.</p>
          <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Write First Post</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {blogs.map(blog => (
            <div key={blog.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {blog.image_url && (
                <img src={blog.image_url} alt={blog.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              )}
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                  {blog.author || 'Unknown'} • {new Date(blog.created_at).toLocaleDateString()}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: 8, lineHeight: 1.3 }}>{blog.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 16 }}>
                  {blog.content?.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(blog)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: '0.8rem' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>{editing ? 'Edit Blog Post' : 'New Blog Post'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={h('title')} placeholder="Blog post title" required /></div>
              <div className="form-group"><label>Author</label><input value={form.author} onChange={h('author')} placeholder="Author name" /></div>
              <div className="form-group"><label>Cover Image URL</label><input value={form.image_url} onChange={h('image_url')} placeholder="https://..." /></div>
              <div className="form-group"><label>Content *</label><textarea rows={10} value={form.content} onChange={h('content')} placeholder="Write your blog post content here..." required /></div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <><Loader size={14} style={{ animation: 'rotate 0.8s linear infinite' }} /> Saving...</> : <><Save size={14} /> {editing ? 'Update' : 'Publish'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
